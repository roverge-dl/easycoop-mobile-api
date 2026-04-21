/* eslint-disable @typescript-eslint/naming-convention */
import User from '#models/user'
import { emailPattern, generateOTP, phonePattern } from '../utils/generic.js'
import mail from '@adonisjs/mail/services/main'
import SkezzoleSmsService from './skezzole_sms_service.js'
import redis from '@adonisjs/redis/services/main'
import type { HttpContext } from '@adonisjs/core/http'
import Password from '#models/password'
import db from '@adonisjs/lucid/services/db'
import Wallet from '#models/wallet'
import { hash } from 'node:crypto'

interface MailData {
  name?: string
  recipient: User | { email?: string; phone: string }
  purpose: string
  otp?: string | number
}

export default class AuthService {
  static async sendOtp(mail_data: MailData, channel: string) {
    console.log('mail_data', mail_data)
    try {
      const code = await generateOTP()
      let recipient_box = ''
      if (channel === 'email') {
        recipient_box = mail_data.recipient.phone!
      } else if (channel === 'phone') {
        recipient_box = mail_data.recipient.phone!
      } else {
        throw new Error('Identifier must be a valid email or phone number')
      }

      const storeOtp = await this.saveOtp(code, recipient_box)

      mail_data.otp = code
      if (storeOtp) {
        if (channel === 'email') {
          // Your existing email logic
          const sendMail = await mail.send((message: any) => {
            message
              .to(mail_data.recipient.email)
              .subject(mail_data.purpose.replaceAll('_', ' ').toUpperCase())
              .htmlView('mails/account_verification', {
                recipient: mail_data.recipient,
                otp: code,
              })
          })
          console.log(sendMail)
        } else if (channel === 'phone') {
          // NEW: Skezzole SMS Integration
          const messageContent = `Your verification code is: ${code}. It expires in 10 minutes. Please do not share this code with anyone.`
          const senderId = 'Skezzole' // Change this to your 11-char brand name

          const smsResult = await SkezzoleSmsService.sendSms(
            `234${mail_data.recipient.phone}`,
            messageContent,
            senderId
          )
          console.log('Skezzole SMS Sent:', smsResult)
        }
      } else {
        throw new Error('Failed to store OTP.')
      }

      return {
        status: true,
        message: `OTP sent successfully to ${channel}`,
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error)
      return {
        status: false, // Changed to false to indicate failure
        error: error.message || 'Failed to send OTP',
      }
    }
  }

  static async saveOtp(otp: number | string, recipient_box: string) {
    try {
      const key = recipient_box + '_otp'
      // console.log('Saving OTP to Redis with key:', key, 'and value:', otp)

      await redis.setex(
        key,
        600,
        otp // OTP expires in 10 minutes (600 seconds)
      )
      return true
    } catch (error) {
      console.error('Error saving OTP to Redis:', error)
      return false
    }
  }

  static async verifyOtp(
    auth: HttpContext['auth'],
    otp: string | number,
    identifier: string,
    purpose: string,
    password?: string,
    regPayload?: { firstName: string; lastName: string; email: string; phone: string }
  ): Promise<{ status: 'success' | 'fail'; message: string; token?: string; error?: string }> {
    console.log('otp', otp)
    try {
      let channel: 'email' | 'phone'
      // let identifier_db_value = identifier // This variable is not used after modification, can be removed if not needed elsewhere
      if (emailPattern.test(identifier)) {
        channel = 'email'
      } else if (phonePattern.test(identifier)) {
        channel = 'phone'
      } else {
        return {
          status: 'fail',
          message: 'Identifier must be a valid email or phone number',
          error: 'Invalid identifier format',
        }
      }
      const otp_in_db = await redis.get(identifier + '_otp')

      if (otp_in_db && otp_in_db?.toString() === otp.toString()) {
        // Ensure strict comparison after converting to string
        if (purpose === 'phone_verification' && phonePattern.test(identifier)) {
          // Delete OTP after successful password reset
          return {
            status: 'success',
            message: 'phone number verified successfully.',
          }
        } else if (purpose === 'registration' && password && regPayload) {
          const user = await this.createUserAccount({
            ...regPayload,
            password: password,
          })
          await redis.del(identifier + '_otp')
          const token = await auth.use('api').createToken(user, ['*'])

          return {
            status: 'success',
            message: 'Phone verified successfully.',
            token: token?.value?.release(),
          }
        } else if (purpose === 'reset_password' && password) {
          const user = await User.query().where(channel, identifier).first()
          if (!user) {
            return {
              status: 'fail',
              message: `The ${channel} ${identifier} not found in our database.`,
            }
          }
          const userPassword = await Password.query().where('userId', user.id).first()
          if (!userPassword) {
            return {
              status: 'fail',
              message: 'Password record not found.',
            }
          }
          userPassword.password = password // The @beforeSave hook on the Password model will handle hashing
          await userPassword.save()
          await redis.del(identifier + '_otp') // Delete OTP after successful password reset
          return {
            status: 'success',
            message: 'Password reset successfully.',
          }
        } else if (purpose === 'email_verification' && emailPattern.test(identifier)) {
          const user = await User.query().where(channel, identifier).first()
          if (!user) {
            return {
              status: 'fail',
              message: `The ${channel} ${identifier} not found in our database.`,
            }
          }
          await user.save()
          await redis.del(identifier + '_otp')
          return {
            status: 'success',
            message: 'Email verified successfully.',
          }
        } else if (purpose === 'link_old_bank_account') {
          // Validated successfully for account linking
          await auth.authenticate()

          const user = auth.user
          if (!user) {
            return {
              status: 'fail',
              message: 'User not authenticated for account linking.',
            }
          }
          await redis.del(identifier + '_otp')

          return {
            status: 'success',
            message: 'OTP verified successfully for account linking.',
          }
        } else if (purpose === 'forgot_password') {
          // This case handles general account verification after login
          // No specific user field update needed here, just OTP verification success
          // await redis.del(identifier + '_otp')
          return {
            status: 'success',
            message: 'OTP verified successfully.',
          }
        } else if (purpose === 'login') {
          await redis.del(identifier + '_otp')
          return {
            status: 'success',
            message: 'OTP verified successfully.',
          }
        } else {
          // If purpose is reset_password but no password is provided, or other unhandled purposes
          return {
            status: 'fail',
            message: 'Invalid purpose or missing new password for reset.',
            error: 'Invalid request',
          }
        }
      } else {
        return {
          status: 'fail',
          message: `Invalid OTP supplied for ${identifier}`,
          error: 'Invalid OTP',
        }
      }
    } catch (error: any) {
      return {
        status: 'fail',
        message: 'An error occurred during OTP verification.',
        error: error.message || 'OTP verification failed',
      }
    }
  }

  static async createUserAccount(data: any) {
    return await db.transaction(async (trx) => {
      // 1. Create User
      const user = new User()
      user.fill({
        firstName: data.firstName, // Assuming you added these columns
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      })
      user.useTransaction(trx)
      await user.save()

      // 2. Create Password (since it's separated in your architecture)
      // The @beforeSave hook on this model will handle the hashing!
      const userPassword = new Password()
      userPassword.fill({
        userId: user.id,
        password: data.password, // Pass it as plain text here
      })
      userPassword.useTransaction(trx)
      await userPassword.save()

      // 3. Create associated Wallet
      const wallet = new Wallet()
      wallet.fill({
        userId: user.id,
        balance: 0,
        currency: 'NGN',
      })
      wallet.useTransaction(trx)
      await wallet.save()

      return user
    })
  }

  static async getUserRolesAndPermissions(userId: string) {
    const user = await User.query()
      .where('id', userId)
      .preload('roles', (roleQuery) => {
        roleQuery.preload('permissions')
      })
      .preload('permissions')
      .firstOrFail()

    const userRoles = user.roles.map((role) => role.name)
    const rolePermissions = user.roles.flatMap((role) =>
      role.permissions.map((permission) => permission.name)
    )
    const directPermissions = user.permissions.map((permission) => permission.name)
    const allPermissions = Array.from(new Set([...rolePermissions, ...directPermissions]))

    return { roles: userRoles, permissions: allPermissions }
  }
}

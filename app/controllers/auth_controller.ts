/* eslint-disable @typescript-eslint/naming-convention */
// app/controllers/auth_controller.ts
import { HttpContext } from '@adonisjs/core/http'
import { FieldObjects, runValidation } from '#validators/buchi'
import AuthService from '#services/auth_service'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import Password from '#models/password'

export default class AuthController {
  async sendOtp({ request, response }: HttpContext) {
    const { identifier, purpose } = request.only(['identifier', 'purpose'])

    const validationArray: FieldObjects[] = [
      {
        input: { value: purpose, field: 'purpose', type: 'text' },
        rules: {
          required: true,
        },
      },
    ]

    switch (purpose) {
      case 'phone_verification':
        validationArray.push({
          input: { value: identifier, field: 'phone', type: 'text' },
          rules: {
            required: true,
            char_length: 11,
            unique: 'users',
          },
        })

        break

      default:
        // userFinder = ['phone', identifier]
        validationArray.push({
          input: { value: identifier, field: 'phone', type: 'text' },
          rules: {
            required: true,
            char_length: 10,
            exists: 'users',
          },
        })
        break
    }

    const validate = await runValidation(validationArray)

    if (validate.status === false) {
      return response.status(409).json({
        status: 'fail',
        errors: validate.errors,
        message: 'Login Failed',
      })
    }

    const otpSent = await AuthService.sendOtp(
      {
        recipient: { phone: identifier },
        purpose: purpose,
      },
      'phone'
    )

    if (otpSent.status) {
      return response.ok({
        status: 'success',
        message: otpSent.message,
      })
    } else {
      return response.status(500).json({
        status: 'fail',
        message: 'Failed to send OTP. Please try again later.',
        error: otpSent.error,
      })
    }
  }

  async verifyOtp({ request, response, auth }: HttpContext) {
    try {
      const { identifier, otp, purpose, password } = request.only([
        'identifier',
        'otp',
        'purpose',
        'password',
      ])

      const validationArray: FieldObjects[] = [
        {
          input: { value: purpose, field: 'purpose', type: 'text' },
          rules: {
            required: true,
            in: ['registration', 'phone_verification', 'reset_password'],
          },
        },
        {
          input: { value: otp, field: 'otp', type: 'text' },
          rules: {
            required: true,
          },
        },
      ]

      if (purpose === 'reset_password') {
        validationArray.push({
          input: { value: password, field: 'password', type: 'text' },
          rules: {
            required: true,
            char_length: 6,
          },
        })
      } else if (purpose === 'registration') {
        validationArray.push({
          input: { value: password, field: 'password', type: 'text' },
          rules: {
            required: true,
            char_length: 6,
            // has_uppercase: true,
            // must_have_number: true,
            // has_special_character: true,
            // has_lowercase: true,
          },
        })
      } else if (purpose === 'phone_verification') {
        validationArray.push({
          input: { value: identifier, field: 'phone', type: 'text' },
          rules: {
            required: true,
            char_length: 10,
          },
        })
      }

      const validate = await runValidation(validationArray)

      if (validate.status === false) {
        return response.status(409).json({
          status: 'fail',
          errors: validate.errors,
          message: 'OTP Verification Failed',
        })
      }

      const result = await AuthService.verifyOtp(auth, otp, identifier, purpose, password)
      if (result.status === 'success') {
        return response.status(200).json(result)
      } else {
        return response.status(400).json(result)
      }
    } catch (error) {
      console.log(error)
      throw new Error('Otp verification failed')
    }
  }

  async register({ request, response, auth }: HttpContext) {
    try {
      const { email, password, otp, first_name, last_name, phone } = request.body()
      const validate = await runValidation([
        {
          input: { value: email, field: 'email', type: 'text' },
          rules: {
            required: true,
            email: true,
            unique: 'users',
          },
        },
        {
          input: { value: phone, field: 'phone', type: 'text' },
          rules: {
            required: true,
            char_length: 11,
            unique: 'users',
          },
        },
        {
          input: { value: first_name, field: 'first_name', type: 'text' },
          rules: {
            required: true,
          },
        },
        {
          input: { value: last_name, field: 'last_name', type: 'text' },
          rules: {
            required: true,
          },
        },
        {
          input: { value: password, field: 'password', type: 'text' },
          rules: {
            required: true,
            min_length: 8,
            has_uppercase: true,
            must_have_number: true,
            has_special_character: true,
            has_lowercase: true,
          },
        },
        {
          input: { value: otp, field: 'otp', type: 'text' },
          rules: {
            required: true,
          },
        },
      ])

      if (!validate.status) {
        return response.status(400).json({
          status: 'fail',
          errors: validate.errors,
          message: 'Registration Failed',
        })
      }

      const verifyOtp = await AuthService.verifyOtp(auth, otp, phone, 'registration', password, {
        firstName: first_name,
        lastName: last_name,
        email,
        phone,
      })
      if (verifyOtp.status === 'success') {
        await AuthService.createUserAccount({
          firstName: first_name,
          lastName: last_name,
          email,
          phone,
          password,
        })
      } else {
        return response.status(400).json(verifyOtp)
      }
    } catch (error) {
      console.log(error)
      throw new Error('Registration failed')
    }
  }

  async login({ request, response, auth }: HttpContext) {
    try {
      let { identifier, password } = request.only(['identifier', 'password'])

      const validationArray: FieldObjects[] = [
        {
          input: { value: password, field: 'password', type: 'text' },
          rules: {
            required: true,
          },
        },
        {
          input: { value: identifier, field: 'phone', type: 'text' },
          rules: { required: true },
        },
      ]

      const validateLoginData = await runValidation(validationArray)
      if (validateLoginData.status === false) {
        return response.status(409).json({
          status: 'fail',
          errors: validateLoginData.errors,
          message: 'Login Failed',
        })
      }

      const user = await User.findBy('phone', identifier)
      if (!user) {
        return response.unauthorized({
          status: 'fail',
          message: 'incorrect login details', // Generic message for security
        })
      }

      const passwordRecord = await Password.findBy('userId', user.id)
      if (!passwordRecord) {
        return response.unauthorized({
          status: 'fail',
          message: 'incorrect login details',
        })
      }

      const isPasswordValid = await hash.verify(passwordRecord.password, password)
      if (!isPasswordValid) {
        return response.unauthorized({
          status: 'fail',
          message: 'incorrect login details',
        })
      }

      const { roles, permissions } = await AuthService.getUserRolesAndPermissions(user.id)

      // 6. Generate Opaque Tokens
      const accessTokenObj = await User.accessTokens.create(user, ['*'], {
        expiresIn: '3 hours',
      })
      const refreshTokenObj = await User.accessTokens.create(user, ['refresh'], {
        expiresIn: '7 days',
      })

      // 7. Return the exact JSON structure your legacy app expects
      return response.ok({
        status: 'success',
        message: 'Login successful',
        data: {
          user: user,
          roles: roles,
          permissions: permissions,
          accessToken: accessTokenObj.value!.release(),
          refreshToken: refreshTokenObj.value!.release(),
        },
      })
    } catch (error: any) {
      return response.status(error.status || 400).json({
        status: 'fail',
        message: error.message || 'Login failed',
      })
    }
  }
}

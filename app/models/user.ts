import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  computed,
  beforeSave,
  belongsTo,
  hasOne,
  hasMany,
  manyToMany,
} from '@adonisjs/lucid/orm'

import type { BelongsTo, HasOne, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Imports: You will need to create these models and uncomment these
import Group from '#models/group'
import Password from '#models/password'
import Role from '#models/role'
import Permission from '#models/permission'
import Wallet from '#models/wallet'
import Kyc from '#models/kyc'
import Beneficiary from '#models/beneficiary'
import Ticket from '#models/ticket'
import Budget from '#models/budget'
import Message from '#models/message'
import Conversation from '#models/conversation'
import LoanApplication from '#models/loan_application'
import WithdrawRequest from '#models/withdraw_request'
import Chatroom from '#models/chatroom'
import GroupMembership from '#models/group_membership'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

export default class User extends BaseModel {
  public static table = 'users'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  // Virtual Field (Equivalent to DataTypes.VIRTUAL)
  @computed()
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  @column()
  declare email: string

  @column()
  declare address: string | null

  @column()
  declare country: string | null

  @column()
  declare state: string | null

  @column()
  declare gender: string | null

  // BigInt in Postgres is often safely handled as a string in JS to prevent precision loss
  @column()
  declare phone: string | null

  @column()
  declare kycStatus: 'pending' | 'verified' | 'rejected'

  @column()
  declare isActivated: boolean | null

  @column()
  declare isVerified: boolean

  @column()
  declare phoneVerified: boolean | null

  @column()
  declare profileImage: string | null

  @column()
  declare referralCode: string | null

  @column()
  declare uniqueString: string | null

  @column()
  declare otp: string | null

  @column.dateTime()
  declare otpExpiry: DateTime | null

  @column()
  declare loanBalance: number

  @column()
  declare loanStatus: 'active' | 'inactive' | 'pending'

  @column()
  declare loanApplicationId: string | null

  @column()
  declare walletId: string | null

  @column()
  declare kegowPhoneId: string | null

  @column()
  declare groupId: string | null

  // ==================== TIMESTAMPS & PARANOID ====================

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Replicates Sequelize's paranoid: true
  @column.dateTime()
  declare deletedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  // ==================== HOOKS (MUTATORS) ====================

  @beforeSave()
  public static async formatFields(user: User) {
    if (user.firstName) {
      user.firstName = user.firstName.trim().toLowerCase()
    }
    if (user.lastName) {
      user.lastName = user.lastName.trim().toLowerCase()
    }
    if (user.email) {
      user.email = user.email.trim().toLowerCase()
    }
  }

  // ==================== ASSOCIATIONS ====================

  @belongsTo(() => Group)
  declare group: BelongsTo<typeof Group>

  @hasOne(() => Password)
  declare password: HasOne<typeof Password>

  // Many-to-Many requires defining the pivot table
  @manyToMany(() => Role, {
    pivotTable: 'user_roles',
  })
  declare roles: ManyToMany<typeof Role>

  @manyToMany(() => Permission, {
    pivotTable: 'user_permissions',
  })
  declare permissions: ManyToMany<typeof Permission>

  @hasOne(() => Wallet)
  declare wallet: HasOne<typeof Wallet>

  @hasMany(() => Kyc)
  declare kycs: HasMany<typeof Kyc>

  @hasMany(() => Beneficiary)
  declare beneficiaries: HasMany<typeof Beneficiary>

  @hasMany(() => Ticket)
  declare tickets: HasMany<typeof Ticket>

  @hasMany(() => Budget)
  declare budgets: HasMany<typeof Budget>

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>

  @hasMany(() => Conversation)
  declare conversations: HasMany<typeof Conversation>

  @hasMany(() => LoanApplication)
  declare loanApplications: HasMany<typeof LoanApplication>

  @hasMany(() => WithdrawRequest)
  declare withdrawRequests: HasMany<typeof WithdrawRequest>

  @manyToMany(() => Chatroom, {
    pivotTable: 'chatroom_users',
  })
  declare chatrooms: ManyToMany<typeof Chatroom>

  @hasOne(() => GroupMembership)
  declare groupMembership: HasOne<typeof GroupMembership>
}

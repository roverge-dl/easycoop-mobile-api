import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Imports: You will need to create these models and uncomment these
import User from '#models/user'
import Wallet from '#models/wallet'
import Transaction from '#models/transaction'
import LoanApplication from '#models/loan_application'

export default class Group extends BaseModel {
  public static table = 'groups'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare entranceFee: number

  @column()
  declare recurrentPayment: number

  @column()
  declare recurrentPaymentFrequency:
    | 'daily'
    | 'weekly'
    | 'bi-weekly'
    | 'monthly'
    | 'quarterly'
    | 'yearly'

  @column()
  declare type: 'typeA' | 'typeB'

  @column()
  declare isActive: boolean

  @column()
  declare walletId: string | null

  // ================== Loan setting COLUMNS ================== //

  @column()
  declare loanRepaymentDuration: number | null

  @column()
  declare loanInterestType: string | null

  // Decimals are mapped to numbers in TypeScript
  @column()
  declare loanInterestRate: number | null

  @column()
  declare loanDurationType: string | null

  @column()
  declare loanApplicationFee: number | null

  @column()
  declare returneeLoanApplicationFee: number | null

  // ================== Thrift setting COLUMNS ================== //

  @column()
  declare minimumThriftAmount: number | null

  @column()
  declare thriftLatenessFee: number | null

  @column()
  declare loaneeThriftLatenessFee: number | null

  @column()
  declare thriftFrequency: string | null

  // ==================== TIMESTAMPS & PARANOID ====================

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Replicates Sequelize's paranoid: true
  @column.dateTime()
  declare deletedAt: DateTime | null

  // ==================== ASSOCIATIONS ====================

  @hasMany(() => User, {
    foreignKey: 'groupId',
  })
  declare users: HasMany<typeof User>

  // Aliased relationship pointing to the same User model
  @hasMany(() => User, {
    foreignKey: 'groupId',
  })
  declare adminUsers: HasMany<typeof User>

  @hasOne(() => Wallet, {
    foreignKey: 'groupId',
  })
  declare wallet: HasOne<typeof Wallet>

  @hasOne(() => Transaction, {
    foreignKey: 'groupId',
  })
  declare transaction: HasOne<typeof Transaction>

  @hasMany(() => LoanApplication, {
    foreignKey: 'groupId',
  })
  declare loanApplications: HasMany<typeof LoanApplication>
}

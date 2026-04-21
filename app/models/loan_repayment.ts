import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Imports: Uncomment these as we build them
import User from '#models/user'
import Group from '#models/group'
import LoanApplication from '#models/loan_application'
import LoanRepaymentTransaction from '#models/loan_repayment_transaction'

export default class LoanRepayment extends BaseModel {
  public static table = 'loan_repayments'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare groupId: string

  @column()
  declare loanApplicationId: string

  @column()
  declare weeklyAmount: number

  @column()
  declare weeklyInterest: number

  @column()
  declare transactionId: string | null

  @column()
  declare amountIsPaid: boolean

  @column()
  declare interestIsPaid: boolean

  // Stored as INTEGER in DB (Unix timestamp)
  @column()
  declare dueDate: number

  @column()
  declare amountPaid: number

  @column()
  declare interestPaid: number

  // ==================== TIMESTAMPS ====================

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // ==================== ASSOCIATIONS ====================

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Group)
  declare group: BelongsTo<typeof Group>

  @belongsTo(() => LoanApplication)
  declare loanApplication: BelongsTo<typeof LoanApplication>

  @hasMany(() => LoanRepaymentTransaction, {
    foreignKey: 'loanRepaymentId',
  })
  declare transactions: HasMany<typeof LoanRepaymentTransaction>
}

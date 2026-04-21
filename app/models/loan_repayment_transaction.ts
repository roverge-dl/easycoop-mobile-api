import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Imports: Uncomment these as we finalize the structure
import LoanRepayment from '#models/loan_repayment'
import Transaction from '#models/transaction'

export default class LoanRepaymentTransaction extends BaseModel {
  public static table = 'loan_repayment_transactions'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare loanRepaymentId: string

  @column()
  declare transactionId: string

  @column()
  declare amountPaid: number | null

  @column()
  declare interestPaid: number

  // ==================== TIMESTAMPS ====================

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // ==================== ASSOCIATIONS ====================

  @belongsTo(() => LoanRepayment, {
    foreignKey: 'loanRepaymentId',
  })
  declare loanRepayment: BelongsTo<typeof LoanRepayment>

  @belongsTo(() => Transaction, {
    foreignKey: 'transactionId',
  })
  declare transaction: BelongsTo<typeof Transaction>
}

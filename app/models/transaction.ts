import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne, HasMany } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Imports: Uncomment these as we build them
import Wallet from '#models/wallet'
import Category from '#models/category'
import Payment from '#models/payment'
import Group from '#models/group'
import LoanRepaymentTransaction from '#models/loan_repayment_transaction'
import LoanApplication from '#models/loan_application'

// Define the expected structure of the metadata JSON for excellent type safety
interface TransactionMetaData {
  from: {
    senderid: string
    senderName: string
  }
  to: {
    receiverId: string
    receiverName: string
  }
  bank: {
    name: string
  }
  [key: string]: any // Allows for additional dynamic keys
}

export default class Transaction extends BaseModel {
  public static table = 'transactions'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare amount: number

  @column()
  declare currency: string

  @column()
  declare reference: string | null

  @column()
  declare code: string | null

  @column()
  declare type: 'credit' | 'debit' | 'transfer_to' | 'transfer_from'

  // 'class' is a reserved keyword in JavaScript/TypeScript, so we must map it differently.
  // We use 'transactionClass' in the class property, but tell Lucid the database column is 'class'
  @column({ columnName: 'class' })
  declare transactionClass: 'charge' | 'transaction'

  @column()
  declare status: 'pending' | 'success' | 'failed' | 'suspicious'

  @column()
  declare description: string

  @column()
  declare groupId: string | null

  @column()
  declare senderId: string | null

  @column()
  declare senderType: string | null

  // Mapped via the interface defined above
  @column()
  declare metaData: TransactionMetaData

  // These two were missing from the Sequelize definitions, but are required for the associations!
  @column()
  declare walletId: string | null

  @column()
  declare categoryId: string | null

  // ==================== TIMESTAMPS & PARANOID ====================

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Replicates Sequelize's paranoid: true
  @column.dateTime()
  declare deletedAt: DateTime | null

  // ==================== ASSOCIATIONS ====================

  @belongsTo(() => Wallet)
  declare wallet: BelongsTo<typeof Wallet>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @hasOne(() => Payment)
  declare payment: HasOne<typeof Payment>

  @belongsTo(() => Group)
  declare group: BelongsTo<typeof Group>

  @hasMany(() => LoanRepaymentTransaction, {
    foreignKey: 'transactionId',
  })
  declare loanRepayments: HasMany<typeof LoanRepaymentTransaction>

  @hasOne(() => LoanApplication)
  declare loanApplication: HasOne<typeof LoanApplication>
}

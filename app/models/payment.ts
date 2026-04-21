import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Import: Uncomment this as we build it
import Transaction from '#models/transaction'

export default class Payment extends BaseModel {
  public static table = 'payments'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare method: string

  @column()
  declare gateway: string

  @column()
  declare total: number

  @column()
  declare status: string | null

  @column()
  declare currency: string

  /**
   * Maps to the JSON column in the database
   */
  @column()
  declare extra: Record<string, any>

  @column()
  declare transactionId: string | null

  // ==================== TIMESTAMPS & PARANOID ====================

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Replicates Sequelize's paranoid: true
   */
  @column.dateTime()
  declare deletedAt: DateTime | null

  // ==================== ASSOCIATIONS ====================

  @belongsTo(() => Transaction)
  declare transaction: BelongsTo<typeof Transaction>
}

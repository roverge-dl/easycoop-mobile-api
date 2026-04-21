import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Import: Uncomment this as we build them
import User from '#models/user'

export default class WithdrawRequest extends BaseModel {
  public static table = 'withdraw_requests'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  // Added this column because it was missing from the Sequelize definition
  // but is strictly required for the User relationship to work!
  @column()
  declare userId: string

  @column()
  declare amount: number

  @column()
  declare reason: string

  @column()
  declare status: 'successful' | 'unsuccessful' | 'pending'

  // ==================== TIMESTAMPS ====================
  // Note: No paranoid mode enabled on this model

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // ==================== ASSOCIATIONS ====================

  // Lucid automatically assumes the foreign key is 'userId'
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}

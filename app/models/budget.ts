import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Imports: Uncomment these as we build them
import User from '#models/user'
import Category from '#models/category'

export default class Budget extends BaseModel {
  public static table = 'budgets'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare categoryId: string

  @column()
  declare amount: number

  @column()
  declare period: 'daily' | 'weekly' | 'monthly' | 'yearly'

  // Sequelize DataTypes.DATE maps to PostgreSQL TIMESTAMP, so we use dateTime()
  @column.dateTime()
  declare startDate: DateTime

  @column.dateTime()
  declare endDate: DateTime

  // ==================== TIMESTAMPS ====================
  // Note: No paranoid mode enabled on this model

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // ==================== ASSOCIATIONS ====================

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>
}

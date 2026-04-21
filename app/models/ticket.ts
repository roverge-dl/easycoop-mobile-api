import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Import: Uncomment this as we build them
import User from '#models/user'

export default class Ticket extends BaseModel {
  public static table = 'tickets'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare status: 'open' | 'in_progress' | 'closed'

  @column()
  declare userId: string

  // ==================== TIMESTAMPS ====================
  // Note: No paranoid mode enabled on this model

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // ==================== ASSOCIATIONS ====================

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}

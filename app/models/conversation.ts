import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Import: Uncomment this as we build them
import Message from '#models/message'

export default class Conversation extends BaseModel {
  public static table = 'conversations'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId1: string

  @column()
  declare userId1Name: string

  @column()
  declare userId2: string

  @column()
  declare userId2Name: string

  @column()
  declare lastMessageId: string | null

  @column()
  declare lastMessageContent: string | null

  // ==================== TIMESTAMPS & PARANOID ====================

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Replicates Sequelize's paranoid: true
  @column.dateTime()
  declare deletedAt: DateTime | null

  // ==================== ASSOCIATIONS ====================

  // Lucid assumes the foreign key on the Message table is 'conversationId'
  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>
}

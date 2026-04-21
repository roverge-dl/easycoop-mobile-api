import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Imports: Uncomment these as we build them
import User from '#models/user'
import Conversation from '#models/conversation'

export default class Message extends BaseModel {
  public static table = 'messages'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare senderId: string

  @column()
  declare recipientId: string

  // Added this column because it was missing in the Sequelize definition
  // but required for the Conversation association
  @column()
  declare conversationId: string | null

  @column()
  declare content: string | null

  @column()
  declare fileUrl: string | null

  @column()
  declare status: 'sent' | 'delivered' | 'read'

  // ==================== TIMESTAMPS & PARANOID ====================

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Replicates Sequelize's paranoid: true
  @column.dateTime()
  declare deletedAt: DateTime | null

  // ==================== ASSOCIATIONS ====================

  // Explicitly map the sender relationship to the senderId column
  @belongsTo(() => User, {
    foreignKey: 'senderId',
  })
  declare sender: BelongsTo<typeof User>

  // Explicitly map the recipient relationship to the recipientId column
  @belongsTo(() => User, {
    foreignKey: 'recipientId',
  })
  declare recipient: BelongsTo<typeof User>

  // Lucid automatically assumes the foreign key is 'conversationId'
  @belongsTo(() => Conversation)
  declare conversation: BelongsTo<typeof Conversation>
}

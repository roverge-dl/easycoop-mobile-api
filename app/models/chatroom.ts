import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Import: Uncomment this as we build them
import User from '#models/user'

export default class Chatroom extends BaseModel {
  public static table = 'chatrooms'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare type: 'private' | 'public'

  // ==================== TIMESTAMPS & PARANOID ====================

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Replicates Sequelize's paranoid: true
  @column.dateTime()
  declare deletedAt: DateTime | null

  // ==================== ASSOCIATIONS ====================

  @manyToMany(() => User, {
    pivotTable: 'chatroom_users',
  })
  declare users: ManyToMany<typeof User>
}

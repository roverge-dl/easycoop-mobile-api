import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'

export default class Password extends BaseModel {
  public static table = 'passwords'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  // We explicitly declare the foreign key column for the relationship
  @column()
  declare userId: string

  // serializeAs: null ensures the hash is never accidentally leaked in API responses
  @column({ serializeAs: null })
  declare password: string

  // ==================== TIMESTAMPS & PARANOID ====================

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Replicates Sequelize's paranoid: true
  @column.dateTime()
  declare deletedAt: DateTime | null

  // ==================== HOOKS ====================

  @beforeSave()
  public static async hashPassword(passwordInstance: Password) {
    // $dirty only contains properties that have been newly assigned or modified
    if (passwordInstance.$dirty.password) {
      passwordInstance.password = await hash.make(passwordInstance.password)
    }
  }

  // ==================== METHODS ====================

  /**
   * Compare a plain text password against the hashed password
   * Converted to async to prevent blocking the Node.js event loop
   */
  public async comparePassword(plainPassword: string): Promise<boolean> {
    return await hash.verify(this.password, plainPassword)
  }

  // ==================== ASSOCIATIONS ====================

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}

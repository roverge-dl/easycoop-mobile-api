import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Import: Uncomment this as we build them
import User from '#models/user'

export default class Kyc extends BaseModel {
  public static table = 'kyc_records'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare identificationDocument: string

  @column()
  declare documentIdentifier: string | null

  @column()
  declare status: 'pending' | 'accepted' | 'rejected'

  @column()
  declare rejectionReason: string | null

  @column()
  declare documentFile: string | null

  // Stored as a string in Sequelize, so we keep it as a string here
  @column()
  declare dob: string | null

  // ==================== TIMESTAMPS & PARANOID ====================

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Replicates Sequelize's paranoid: true
  @column.dateTime()
  declare deletedAt: DateTime | null

  // ==================== ASSOCIATIONS ====================

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}

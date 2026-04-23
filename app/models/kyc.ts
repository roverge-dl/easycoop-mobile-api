import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import User from '#models/user'
import KycRequirement from '#models/kyc_requirement'

export default class Kyc extends BaseModel {
  public static table = 'kyc_records'

  @beforeCreate()
  public static async generateId(model: KycRequirement) {
    model.id = crypto.randomUUID()
  }

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  /**
   * Links to the new KycRequirement blueprint table
   */
  @column()
  declare requirementId: string

  // --- Legacy Columns Maintained for Backwards Compatibility ---
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

  @column()
  declare dob: string | null

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

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => KycRequirement)
  declare requirement: BelongsTo<typeof KycRequirement>
}

import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Import: Uncomment this as we build them
import User from '#models/user'

export default class Beneficiary extends BaseModel {
  public static table = 'beneficiaries'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare name: string

  @column()
  declare accountNumber: string

  @column()
  declare bankName: string

  @column()
  declare swiftCode: string | null

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

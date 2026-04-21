import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Import: Uncomment this as we build it
import Wallet from '#models/wallet'

export default class SubWallet extends BaseModel {
  public static table = 'sub_wallets'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare type: 'typeA' | 'typeB' | 'typeC'

  @column()
  declare balance: number

  @column()
  declare currency: string

  // Foreign key for the association
  @column()
  declare walletId: string

  // ==================== TIMESTAMPS ====================
  // Note: paranoid was commented out in Sequelize, so no deletedAt here.

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // ==================== ASSOCIATIONS ====================

  @belongsTo(() => Wallet)
  declare wallet: BelongsTo<typeof Wallet>
}

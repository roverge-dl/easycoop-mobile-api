import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import hash from '@adonisjs/core/services/hash'

// ⚠️ Placeholder Imports: Uncomment these as we build them
import User from '#models/user'
import Group from '#models/group'
import Transaction from '#models/transaction'
import Subscription from '#models/subscription'
import SubWallet from '#models/sub_wallet'
import Fees from '#models/fee'

export default class Wallet extends BaseModel {
  public static table = 'wallets'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare balance: number

  @column()
  declare currency: string

  @column()
  declare reference: string | null

  @column()
  declare type: 'typeA' | 'typeB'

  // serializeAs: null ensures the hashed PIN is never returned in API JSON responses
  @column({ serializeAs: null })
  declare pin: string | null

  @column()
  declare isActive: boolean

  @column()
  declare userId: string | null

  @column()
  declare groupId: string | null

  @column()
  declare kegowAccount: string | null

  @column()
  declare kegowAccountId: string | null

  @column()
  declare kegowAccountName: string | null

  // Maps to PostgreSQL JSONB
  @column()
  declare kegowData: Record<string, any> | null

  @column()
  declare bankCode: string | null

  @column()
  declare superGroup: boolean

  // ==================== TIMESTAMPS ====================
  // Note: paranoid was false/commented out, so no deletedAt column is included

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // ==================== HOOKS ====================

  @beforeSave()
  public static async hashPin(wallet: Wallet) {
    // Only hash the pin if it was newly set or modified
    if (wallet.$dirty.pin && wallet.pin) {
      wallet.pin = await hash.make(wallet.pin)
    }
  }

  // ==================== METHODS ====================

  /**
   * Compare a plain text PIN against the hashed PIN
   */
  public async verifyPin(plainPin: string): Promise<boolean> {
    if (!this.pin) return false
    return await hash.verify(this.pin, plainPin)
  }

  // ==================== ASSOCIATIONS ====================

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Group)
  declare group: BelongsTo<typeof Group>

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>

  @hasMany(() => Subscription)
  declare subscriptions: HasMany<typeof Subscription>

  @hasMany(() => SubWallet)
  declare subWallets: HasMany<typeof SubWallet>

  @hasMany(() => Fees)
  declare fees: HasMany<typeof Fees>
}

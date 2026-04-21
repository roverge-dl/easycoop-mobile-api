import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Import: Uncomment this as we build them
import Wallet from '#models/wallet'

export default class Subscription extends BaseModel {
  public static table = 'subscriptions'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare currency: string

  @column()
  declare name: string

  @column()
  declare interval: string

  @column()
  declare amount: number

  @column()
  declare code: string

  @column()
  declare status: 'active' | 'non-renewing' | 'attention' | 'completed' | 'cancelled'

  // Added missing foreign key for the Wallet relationship
  @column()
  declare walletId: string | null

  // Added missing foreign key for the self-referencing relationship
  @column()
  declare subscriptionId: string | null

  // ==================== TIMESTAMPS & PARANOID ====================

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Replicates Sequelize's paranoid: true
  @column.dateTime()
  declare deletedAt: DateTime | null

  // ==================== ASSOCIATIONS ====================

  @belongsTo(() => Wallet)
  declare wallet: BelongsTo<typeof Wallet>

  // Self-referencing relationship
  @belongsTo(() => Subscription, {
    foreignKey: 'subscriptionId',
  })
  declare parentSubscription: BelongsTo<typeof Subscription>
}

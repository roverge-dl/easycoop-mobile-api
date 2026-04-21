import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Imports: Uncomment these as we build them
import User from '#models/user'
import Wallet from '#models/wallet'

export default class Fee extends BaseModel {
  public static table = 'fees'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare type:
    | 'building'
    | 'development'
    | 'maintenance'
    | 'insurance'
    | 'late_loan_repayment'
    | 'late_recurrent_payment'
    | 'entrance_fee'

  @column()
  declare amount: number

  @column()
  declare currency: string

  @column()
  declare status: 'paid' | 'unpaid'

  @column()
  declare thriftId: string | null

  @column()
  declare userId: string | null

  // Added to support the relationship established in the Wallet model
  @column()
  declare walletId: string | null

  // ==================== TIMESTAMPS ====================

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // ==================== ASSOCIATIONS ====================

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Wallet)
  declare wallet: BelongsTo<typeof Wallet>
}

import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Imports: Uncomment these as we build them
import Budget from '#models/budget'
import Transaction from '#models/transaction'

export default class Category extends BaseModel {
  public static table = 'categories'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare type: 'income' | 'expense'

  // ==================== TIMESTAMPS ====================

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // ==================== ASSOCIATIONS ====================

  @hasMany(() => Budget)
  declare budgets: HasMany<typeof Budget>

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>
}

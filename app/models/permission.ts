import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'

import type { ManyToMany } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Imports: Uncomment these as we build them
import Role from '#models/role'
import User from '#models/user'

export default class Permission extends BaseModel {
  public static table = 'permissions'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  // ==================== TIMESTAMPS & PARANOID ====================

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Replicates Sequelize's paranoid: true
  @column.dateTime()
  declare deletedAt: DateTime | null

  // ==================== ASSOCIATIONS ====================

  @manyToMany(() => Role, {
    pivotTable: 'role_permissions',
  })
  declare roles: ManyToMany<typeof Role>

  @manyToMany(() => User, {
    pivotTable: 'user_permissions',
  })
  declare users: ManyToMany<typeof User>
}

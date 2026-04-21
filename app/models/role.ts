import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'

import type { ManyToMany } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Imports: Uncomment these as we build them
import User from '#models/user'
import Permission from '#models/permission'

export default class Role extends BaseModel {
  public static table = 'roles'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  // Enforcing the allowed values via TypeScript types
  @column()
  declare name: 'Admin' | 'SuperAdmin' | 'EndUser'

  // ==================== TIMESTAMPS & PARANOID ====================

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Replicates Sequelize's paranoid: true
  @column.dateTime()
  declare deletedAt: DateTime | null

  // ==================== ASSOCIATIONS ====================

  @manyToMany(() => User, {
    pivotTable: 'user_roles',
  })
  declare users: ManyToMany<typeof User>

  @manyToMany(() => Permission, {
    pivotTable: 'role_permissions',
  })
  declare permissions: ManyToMany<typeof Permission>
}

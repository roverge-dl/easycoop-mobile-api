import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Imports: Uncomment these
import User from '#models/user'
import Group from '#models/group'

export default class GroupMembership extends BaseModel {
  public static table = 'group_memberships'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare groupId: string

  // Mapped as a Luxon DateTime object
  @column.dateTime()
  declare entranceDate: DateTime

  @column()
  declare approvedBy: string | null

  @column()
  declare paymentId: string | null

  @column()
  declare status: 'pending' | 'approved' | 'rejected'

  @column()
  declare notes: string | null

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

  @belongsTo(() => Group)
  declare group: BelongsTo<typeof Group>
}

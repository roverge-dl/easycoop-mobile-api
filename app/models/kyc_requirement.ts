import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Kyc from '#models/kyc'

export default class KycRequirement extends BaseModel {
  public static table = 'kyc_requirements'

  @beforeCreate()
  public static async generateId(model: KycRequirement) {
    model.id = crypto.randomUUID()
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  // Lucid automatically maps camelCase properties to snake_case columns (step_number)
  @column()
  declare stepNumber: number

  @column()
  declare inputType: string[]

  @column()
  declare acceptedFormats: string[] | null

  @column()
  declare isRequired: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // @hasMany(() => Kyc)
  // declare submissions: HasMany<typeof Kyc>
}

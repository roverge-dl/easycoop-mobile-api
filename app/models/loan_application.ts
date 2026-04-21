import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

// ⚠️ Placeholder Imports: Uncomment these as we build them
import User from '#models/user'
import Group from '#models/group'
import Transaction from '#models/transaction'
import LoanRepayment from '#models/loan_repayment'

export default class LoanApplication extends BaseModel {
  public static table = 'loan_applications'

  // ==================== COLUMNS ====================

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare firstName: string | null

  @column()
  declare lastName: string | null

  @column()
  declare email: string | null

  @column()
  declare phone: string | null

  @column()
  declare gender: string | null

  @column.dateTime()
  declare dob: DateTime | null

  @column()
  declare amount: number | null

  @column()
  declare address: string | null

  @column()
  declare employmentStatus: 'employed' | 'unemployed' | 'selfEmployed' | null

  @column()
  declare employerName: string | null

  @column()
  declare jobTitle: string | null

  @column()
  declare employmentAddress: string | null

  @column()
  declare nokFirstName: string | null

  @column()
  declare nokLastName: string | null

  @column()
  declare nokEmail: string | null

  @column()
  declare nokPhone: string | null

  @column()
  declare nokRelationship: string | null

  @column()
  declare bvn: string | null

  @column()
  declare nin: string | null

  @column()
  declare verificationDocument: string | null

  @column()
  declare guarantorFirstName: string | null

  @column()
  declare guarantorLastName: string | null

  @column()
  declare guarantorEmail: string | null

  // Sequelize BIGINT is often safest typed as a string to avoid JS precision loss
  @column()
  declare guarantorPhone: string | null

  @column()
  declare guarantorOccupation: string | null

  @column()
  declare guarantorOfficeAddress: string | null

  @column()
  declare guarantorHomeAddress: string | null

  @column()
  declare status: string

  @column()
  declare groupId: string | null

  @column()
  declare userId: string

  @column()
  declare transactionId: string | null

  @column()
  declare approvalDate: number | null

  // ==================== TIMESTAMPS ====================

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // ==================== HOOKS ====================

  @beforeSave()
  public static async formatEmails(application: LoanApplication) {
    if (application.email) {
      application.email = application.email.trim().toLowerCase()
    }
    if (application.nokEmail) {
      application.nokEmail = application.nokEmail.trim().toLowerCase()
    }
    if (application.guarantorEmail) {
      application.guarantorEmail = application.guarantorEmail.trim().toLowerCase()
    }
  }

  // ==================== ASSOCIATIONS ====================

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Group)
  declare group: BelongsTo<typeof Group>

  @belongsTo(() => Transaction)
  declare transaction: BelongsTo<typeof Transaction>

  // Aliased LoanRepayment relationships
  @hasMany(() => LoanRepayment, {
    foreignKey: 'loanApplicationId',
  })
  declare repaymentSchedule: HasMany<typeof LoanRepayment>

  @hasMany(() => LoanRepayment, {
    foreignKey: 'loanApplicationId',
  })
  declare futurePaid: HasMany<typeof LoanRepayment>

  @hasMany(() => LoanRepayment, {
    foreignKey: 'loanApplicationId',
  })
  declare pastPaid: HasMany<typeof LoanRepayment>

  @hasMany(() => LoanRepayment, {
    foreignKey: 'loanApplicationId',
  })
  declare pastUnpaid: HasMany<typeof LoanRepayment>

  @hasMany(() => LoanRepayment, {
    foreignKey: 'loanApplicationId',
  })
  declare nextFutureUnpaid: HasMany<typeof LoanRepayment>
}

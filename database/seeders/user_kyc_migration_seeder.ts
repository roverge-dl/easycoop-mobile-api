// database/seeders/user_kyc_migration_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import KycRequirement from '#models/kyc_requirement'
import Kyc from '#models/kyc'

export default class extends BaseSeeder {
  async run() {
    // 1. Find the exact blueprint for Step 1
    const phoneRequirement = await KycRequirement.findBy('stepNumber', 1)

    if (!phoneRequirement) {
      console.error('⚠️ Please run the KycRequirementSeeder first!')
      return
    }

    // 2. Fetch all users who actually have a phone number on record
    const users = await User.query().whereNotNull('phone').whereNot('phone', '')

    // 3. Map them to the new Kyc submission format
    const kycPayload: Partial<Kyc>[] = users.map((user) => ({
      userId: user.id,
      requirementId: phoneRequirement.id,
      documentIdentifier: user.phone!,
      documentFile: null,
      identificationDocument: 'phone',
      status: 'accepted' as const,
    }))

    // 4. Safely insert. updateOrCreateMany prevents duplicates if you run the seeder twice!
    await Kyc.updateOrCreateMany(['userId', 'requirementId'], kycPayload)

    console.log(`✅ Successfully grandfathered ${users.length} users into KYC Step 1!`)
  }
}

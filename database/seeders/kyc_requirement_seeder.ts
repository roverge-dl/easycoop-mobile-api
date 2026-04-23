// database/seeders/kyc_requirement_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import KycRequirement from '#models/kyc_requirement'

export default class extends BaseSeeder {
  async run() {
    await KycRequirement.updateOrCreateMany('name', [
      {
        name: 'Phone Verification',
        description: 'Verify your phone number using the OTP sent to your device.',
        stepNumber: 1,
        inputType: JSON.stringify(['text']) as any,
        acceptedFormats: null,
        isRequired: true,
      },
      {
        name: 'BVN',
        description: 'Provide your 11-digit Bank Verification Number (BVN).',
        stepNumber: 2,
        inputType: JSON.stringify(['text']) as any,
        acceptedFormats: null,
        isRequired: true,
      },
      {
        name: 'NIN',
        description: 'Enter your NIN and upload a clear picture of the slip or ID card.',
        stepNumber: 3, // Combined into Step 3!
        inputType: JSON.stringify(['text', 'file']) as any, // <-- Asking for both!
        acceptedFormats: JSON.stringify(['jpg', 'jpeg', 'png', 'pdf']) as any,
        isRequired: true,
      },
      {
        name: 'Face Capture',
        description: 'Take a clear selfie to verify your identity against your documents.',
        stepNumber: 4, // Shifted up
        inputType: JSON.stringify(['file']) as any,
        acceptedFormats: JSON.stringify(['jpg', 'jpeg', 'png']) as any,
        isRequired: true,
      },
    ])
  }
}

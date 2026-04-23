// app/services/kyc_service.ts
import KycRequirement from '#models/kyc_requirement'
import Kyc from '#models/kyc'

export default class KycService {
  /**
   * Calculates the exact next step for a specific user
   */
  async getNextPendingStep(userId: string) {
    try {
      // Fetch all active requirements ordered sequentially
      const requirements = await KycRequirement.query().orderBy('stepNumber', 'asc')
      console.log('requirements', requirements)
      // Fetch everything the user has submitted so far
      const userSubmissions = await Kyc.query().where('userId', userId)

      if (!userSubmissions.length) {
        return {
          isComplete: false,
          isPendingAdminReview: false,
          requirement: requirements[0],
        }
      }

      let reqCount = 0
      for (const requirement of requirements) {
        const submission = userSubmissions.find((s) => s.requirementId === requirement.id)

        // Scenario A: User hasn't done this step, or it was rejected
        if (!submission || submission.status === 'rejected') {
          return {
            isComplete: false,
            isPendingAdminReview: false,
            requirement: requirement,
            previousSubmission: submission || null, // Lets frontend show the rejectionReason!
          }
        }

        // Scenario B: User did the step, but admin hasn't approved it yet
        // We block them from moving to the next step until this is cleared
        if (submission.status === 'pending') {
          return {
            isComplete: false,
            isPendingAdminReview: true,
            requirement:
              requirements.length - 1 === reqCount ? requirement : requirements[reqCount + 1],
            message: 'Your current submission is under review by our team.',
          }
        }

        reqCount++
        // Scenario C: Status is 'accepted'. The loop automatically continues to the next step!
      }

      // Scenario D: The loop finished. They beat the game.
      return {
        isComplete: true,
        message: 'All KYC requirements have been successfully completed.',
      }
    } catch (error: any) {
      console.error('[KYC_GET_NEXT_STEP_ERROR]:', error)
      return null
    }
  }

  async submitKyc(userId: string, requirementId: string, data: any) {
    try {
      await Kyc.updateOrCreate(
        {
          userId,
          requirementId,
        },
        {
          identificationDocument: data.identificationDocument, // Fallback for legacy NOT NULL
          documentFile: data.documentFile,
          documentIdentifier: data.documentIdentifier,
          status: 'pending', // Always goes to pending for admin review
          rejectionReason: null, // Clear any old rejection reasons
        }
      )

      return {
        status: 'success',
        message: 'KYC step submitted successfully and is pending review.',
      }
    } catch (error: any) {
      console.error('[KYC_SUBMIT_ERROR]:', error)
      throw new Error(error.message)
    }
  }
}

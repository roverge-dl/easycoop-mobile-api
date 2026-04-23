/* eslint-disable @typescript-eslint/naming-convention */
// app/controllers/kyc_controller.ts
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import KycService from '#services/kyc_service'
import { FieldObjects, runValidation } from '#validators/buchi'
import KycRequirement from '#models/kyc_requirement'
import UploadService from '#services/upload_service'

@inject()
export default class KycController {
  constructor(protected kycService: KycService) {}

  /**
   * GET /api/v1/kyc/next-step
   * Fetches what the user needs to do right now.
   */
  async getNextStep({ auth, response }: HttpContext) {
    try {
      // Because this route will be protected by auth middleware, user is guaranteed
      const user = auth.getUserOrFail()

      const nextStepData = await this.kycService.getNextPendingStep(user.id)

      return response.ok({
        status: 'success',
        data: nextStepData,
      })
    } catch (error) {
      console.error('[KYC_NEXT_STEP_ERROR]:', error)
      return response.internalServerError({
        status: 'error',
        message: 'Could not fetch KYC status at this time.',
      })
    }
  }

  /**
   * POST /api/v1/kyc/submit
   * Handles the actual file/text uploads
   */
  async submitStep({ request, auth, response, params }: HttpContext) {
    try {
      const document_text = request.input('document_text')
      const document_file = request.file('document_file', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg', 'pdf'],
      })
      const id = params.id

      const kycStep = await KycRequirement.find(id)
      if (!kycStep) {
        return response.status(404).json({
          status: 'fail',
          message: 'Invalid KYC Id',
        })
      }

      let fileIsNeeded = false
      const validateArr: FieldObjects[] = []

      kycStep.inputType.forEach((type) => {
        if (type === 'file') {
          fileIsNeeded = true
          validateArr.push({
            input: { value: document_file, field: 'document_file', type: 'file' },
            rules: { required: true, max_size: 1024 },
          })
        } else if (type === 'text') {
          validateArr.push({
            input: { value: document_text, field: 'document_text', type: 'text' },
            rules: { required: true },
          })
        }
      })

      const validate = await runValidation(validateArr)
      if (!validate.status) {
        return response.status(400).json({
          status: 'fail',
          message: 'Validation failed',
          errors: validate.errors,
        })
      }

      let fileUrl = null
      if (fileIsNeeded && document_file) {
        const uploadService = new UploadService()

        fileUrl = await uploadService.uploadFile(document_file, 'olaikecoop/nin_slips')

        if (!fileUrl) {
          return response.status(500).json({
            status: 'fail',
            message: 'Failed to upload file to storage.',
          })
        }
      }

      const result = await this.kycService.submitKyc(auth.user!.id, id, {
        identificationDocument: kycStep.name,
        documentFile: document_file ? fileUrl : null,
        documentIdentifier: document_text,
      })

      if (result.status === 'fail') {
        return response.status(400).json({
          status: 'fail',
          message: result.message,
        })
      }

      return response.status(200).json({
        status: 'success',
        message: 'KYC step submitted successfully and is pending review.',
      })
    } catch (error) {
      console.error('[KYC_SUBMIT_STEP_ERROR]:', error)
      return response.status(500).json({
        status: 'error',
        message: 'Could not submit KYC step at this time.',
      })
    }
  }
}

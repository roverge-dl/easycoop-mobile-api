// app/controllers/groups_controller.ts
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import GroupService from '#services/group_service'

@inject()
export default class GroupsController {
  constructor(protected groupService: GroupService) {}

  /**
   * GET /api/v1/groups
   */
  async index({ response }: HttpContext) {
    try {
      const groups = await this.groupService.getGroups()

      return response.ok({
        status: 'success',
        data: groups,
      })
    } catch (error) {
      // In industry practice, we log the actual error for devops but return a clean status
      console.error('[GROUPS_INDEX_ERROR]:', error)
      return response.internalServerError({
        status: 'error',
        message: 'Unable to fetch groups at this time',
      })
    }
  }

  /**
   * GET /api/v1/groups/:id
   */
  async show({ params, response }: HttpContext) {
    try {
      // .findOrFail() throws a standard Adonis error if the ID is missing/wrong
      const group = await this.groupService.getGroupById(params.id)

      return response.ok({
        status: 'success',
        data: group,
      })
    } catch (error: any) {
      if (error.code === 'E_ROW_NOT_FOUND' || error.status === 404) {
        return response.notFound({
          status: 'error',
          message: `Group with ID ${params.id} not found`,
        })
      }

      return response.internalServerError({
        status: 'error',
        message: 'An error occurred while retrieving the group',
      })
    }
  }
}

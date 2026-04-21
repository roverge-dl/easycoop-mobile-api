// app/services/group_service.ts
import Group from '#models/group'

export default class GroupService {
  async getGroups() {
    // Only return non-deleted groups (Lucid handles paranoid automatically)
    return await Group.query()
      .select('id', 'name')
      .whereNot('name', 'master')
      .orderBy('name', 'asc')
  }

  async getGroupById(id: string) {
    // Throws E_ROW_NOT_FOUND if not found
    return await Group.findOrFail(id)
  }
}

/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

const GroupsController = () => import('#controllers/groups_controller')

router
  .group(() => {
    /**
     * Group Routes
     * Prefix: /api/v1/groups
     */
    router
      .group(() => {
        // GET /api/v1/groups - Fetch all groups
        router.get('/', [GroupsController, 'index'])

        // GET /api/v1/groups/:id - Fetch single group details
        router.get('/:id', [GroupsController, 'show'])
      })
      .prefix('groups')

    router
      .group(() => {
        // router.post('/register', [AuthController, 'register'])
        router.post('/signup', [AuthController, 'register'])
        router.post('/verify-otp', [AuthController, 'verifyOtp'])
        router.post('/send-otp', [AuthController, 'sendOtp'])
        router.post('/login', [AuthController, 'login'])
      })
      .prefix('/auth')
  })
  .prefix('api/v1')

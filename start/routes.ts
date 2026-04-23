/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
const KycController = () => import('#controllers/kyc_controller')

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

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

    router
      .group(() => {
        // KYC Routes
        router
          .group(() => {
            router.get('/next-step', [KycController, 'getNextStep'])
            router.post('/:id/submit', [KycController, 'submitStep'])
          })
          .prefix('/kyc')
      })
      .use(middleware.auth())
  })
  .prefix('api/v1')

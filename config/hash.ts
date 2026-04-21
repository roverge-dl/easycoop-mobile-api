import { defineConfig, drivers } from '@adonisjs/core/hash'

const hashConfig = defineConfig({
  // 1. Change the default hasher to bcrypt
  default: 'bcrypt',

  list: {
    scrypt: drivers.scrypt({
      cost: 16384,
      blockSize: 8,
      parallelization: 1,
      maxMemory: 33554432,
    }),
    // 2. Add the bcrypt driver configuration
    bcrypt: drivers.bcrypt({
      rounds: 10, // Matches your existing Sequelize bcrypt.genSalt(10)
    }),
  },
})

export default hashConfig

/**
 * Inferring types for the list of hashers you have configured
 * in your application.
 */
declare module '@adonisjs/core/types' {
  export interface HashersList extends InferHashers<typeof hashConfig> {}
}

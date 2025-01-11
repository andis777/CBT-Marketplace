export default {
  development: {
    client: 'mysql',
    connection: {
      host: 'localhost', 
      user: 'kpt_usr',
      password: 'oebynqxaTHalK0uS',
      database: 'kpt',
      charset: 'utf8mb4'
    },
    pool: {
      min: 2,
      max: 10,
      afterCreate: (conn, done) => {
        console.log('New database connection created');
        done(null, conn);
      }
    },
    debug: false,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  }
};
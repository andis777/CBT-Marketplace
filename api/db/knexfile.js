export default {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: './api/db/cbt.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './api/db/migrations'
    },
    seeds: {
      directory: './api/db/seeds'
    }
  }
};
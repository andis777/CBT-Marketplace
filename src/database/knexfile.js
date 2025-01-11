export default {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: './src/database/cbt.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './src/database/migrations'
    },
    seeds: {
      directory: './src/database/seeds'
    }
  }
};
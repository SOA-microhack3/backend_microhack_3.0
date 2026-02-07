export default () => ({
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'hack_db',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'secret-jwt-key-change-in-production',
    expiration: process.env.JWT_EXPIRATION || '3600s',
  },

  // Admin seed
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@portflow.ma',
    password: process.env.ADMIN_PASSWORD || 'demo123',
    fullName: process.env.ADMIN_FULL_NAME || 'Port Admin',
    seed: process.env.SEED_ADMIN !== 'false',
  },

  ports: {
    seed: process.env.SEED_PORTS !== 'false',
  },

  terminals: {
    seed: process.env.SEED_TERMINALS !== 'false',
  },

  seedDemo: process.env.SEED_DEMO !== 'false',
});

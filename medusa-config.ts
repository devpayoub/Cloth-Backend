import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
  },
  modules: [
    {
      resolve: '@medusajs/file',
      options: {
        providers: [
          {
            resolve: '@medusajs/file-s3',
            id: 's3',
            options: {
              bucket: process.env.S3_BUCKET,
              region: process.env.S3_REGION,
              endpoint: process.env.S3_ENDPOINT,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              file_url: process.env.S3_FILE_URL,
              acl: false,
              // Neon Object Storage uses path-style (not virtual-host)
              additional_client_config: { forcePathStyle: true },
            },
          },
        ],
      },
    },
  ],
})

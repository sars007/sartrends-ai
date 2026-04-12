// @ts-check
/** @type {import('prisma').Config} */
const config = {
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
}
export default config


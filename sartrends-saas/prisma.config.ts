// @ts-check
/** @type {import('prisma').Config} */
const config = {
  schema: './prisma/schema.prisma',
  datasource: {
    url: 'file:./prisma/dev.db',
  },
}
export default config


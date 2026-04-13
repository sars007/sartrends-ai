cd "c:/Projects/sartrends-ai/sartrends-saas"
npx prisma generate --schema=prisma/schema.prisma
npx prisma db push --schema=prisma/schema.prisma
npm run build
npm run dev

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const fakeLoads = [
  {
    brokerName: 'ABC Freight',
    origin: 'Chicago, IL',
    destination: 'Dallas, TX',
    miles: 930,
    rate: 4500,
    lat: 41.8781,
    lng: -87.6298
  },
  {
    brokerName: 'QuickLoad Brokers',
    origin: 'Los Angeles, CA',
    destination: 'Phoenix, AZ',
    miles: 373,
    rate: 2100,
    lat: 34.0522,
    lng: -118.2437
  },
  {
    brokerName: 'DAT Load #123',
    origin: 'New York, NY',
    destination: 'Atlanta, GA',
    miles: 850,
    rate: 3800,
    lat: 40.7128,
    lng: -74.0060
  },
  {
    brokerName: 'TruckStop Express',
    origin: 'Houston, TX',
    destination: 'Miami, FL',
    miles: 1180,
    rate: 5200,
    lat: 29.7604,
    lng: -95.3698
  },
  {
    brokerName: 'FleetLine',
    origin: 'Seattle, WA',
    destination: 'Denver, CO',
    miles: 1330,
    rate: 6100,
    lat: 47.6062,
    lng: -122.3321
  }
]

async function main() {
  await prisma.load.deleteMany() // Clear existing

  for (const loadData of fakeLoads) {
    const ratePerMile = (loadData.rate / loadData.miles).toFixed(2)

    await prisma.load.create({
      data: {
        ...loadData,
        ratePerMile: parseFloat(ratePerMile),
        status: 'open'
      }
    })
  }
  console.log(`✅ Seeded ${fakeLoads.length} realistic loads ✅`)
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())


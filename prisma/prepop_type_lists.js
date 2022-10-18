const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const fs = require('fs');

async function main() {	
	console.log(`Fetching type lists...`)
	
	const entityTypes = await prisma.entityType.findMany({
		orderBy: {
			name: 'asc'
		}
	})
	
	const relationTypes = await prisma.relationType.findMany({
		orderBy: {
			name: 'asc'
		}
	})
	
	console.log(`Saving type lists...`)
	
	fs.writeFileSync('lib/entityTypes.json', JSON.stringify(entityTypes));
	
	fs.writeFileSync('lib/relationTypes.json', JSON.stringify(relationTypes));
	
	console.log(`Saving complete...`)
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})

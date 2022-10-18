const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const fs = require('fs');

async function main() {	
	console.log(`Start seeding ...`)
	
	const deleteUsers = await prisma.user.deleteMany({})
	
	const user = await prisma.user.createMany({
		data: [
			{id:1, username:'testuser',isBot:false},
			{id:99999, username:'annotationbot',isBot:true},
		]
	})
	console.log(`Created users`)
	
	const relationTypes = await prisma.relationType.createMany({
		data: [
			{id:1, name:'Upregulates', description:'Mentions of one gene/protein upregulating the expression or activity of another gene/protein'},
			{id:2, name:'Downregulates', description:'Mentions of one gene/protein downregulating the expression or activity of another gene/protein'},
		]
	})
	console.log(`Created relation types`)
	
	console.log(`Seeding finished.`)
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})

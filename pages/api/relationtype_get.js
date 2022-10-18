import prisma from '../../lib/prisma'

export default async function handle(req, res) {
		
	const relationTypes = await prisma.relationType.findMany()
	
	res.json(relationTypes)
}

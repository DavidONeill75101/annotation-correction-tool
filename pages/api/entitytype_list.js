import prisma from '../../lib/prisma'

export default async function handle(req, res) {
		
	const entityTypes = await prisma.entityType.findMany({
		orderBy: {
			name: 'asc'
		}
	})
	
	res.json(entityTypes)
}

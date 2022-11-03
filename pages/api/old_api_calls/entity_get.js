import prisma from '../../lib/prisma'

export default async function handle(req, res) {
	
	const entityId = parseInt(req.query.entityId)
	
	var entity = await prisma.entity.findUnique({
		where: {
			id: entityId,
		},
		include: {
			entityType: true,
			synonyms: true
		}
	})
	
	res.json(entity)
}

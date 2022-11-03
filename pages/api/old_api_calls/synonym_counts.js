import prisma from '../../lib/prisma'

export default async function handle(req, res) {
	
	const offset = parseInt(req.query.offset)
	const limit = parseInt(req.query.limit)
	
	const where = req.query.entityTypeId ? {entity:{entityTypeId:parseInt(req.query.entityTypeId)}} : {}
	
	const result = await prisma.entitySynonym.findMany({
		include: {
			entity: { include: {entityType: true} },
			_count: {
				select: { entityAnnotations: true },
			},
		},
		where: where,
		orderBy: {
			entityAnnotations: {
				_count: 'desc'
			}
		},
		skip: offset,
		take: limit
	})
	
	res.json(result)
}

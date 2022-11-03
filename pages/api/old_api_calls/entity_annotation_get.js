import prisma from '../../lib/prisma'

export default async function handle(req, res) {
	
	
	const entityId = parseInt(req.query.entityId)
	
	
	var entity = await prisma.entityAnnotation.findUnique({
		where: {
			id: entityId
		},
		
	})
	
	res.json(entity)
}

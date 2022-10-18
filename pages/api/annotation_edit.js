import prisma from '../../lib/prisma'

export default async function handle(req, res) {
	
	const entityAnnotationId = parseInt(req.query.entityAnnotationId)
	const entityId = parseInt(req.query.entityId)
	
	const updateEntityAnnotation = await prisma.entityAnnotation.update({
		where: {
			id: entityAnnotationId,
		},
		data: {
			entityId: entityId,
			userId: 1,
			score: 10
		},
	})
	
	res.status(200).json({'status':'success'})
}

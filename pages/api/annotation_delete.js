import prisma from '../../lib/prisma'

export default async function handle(req, res) {
	
	const entityAnnotationId = parseInt(req.query.entityAnnotationId);
		
	const rejectAnnotation = await prisma.entityAnnotation.update({
		where: {
			id: entityAnnotationId,
		},
		data: {
			rejected: true,
			userId: 1,
			score: 10
		},
	})
	
	res.status(200).json({'status':'success'})
}

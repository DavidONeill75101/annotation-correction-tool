import prisma from '../../lib/prisma'

export default async function handle(req, res) {
	
	//const sentenceId = parseInt(req.query.sentenceId)
	
	var entityAnnotations = await prisma.entityAnnotation.findMany({
		where: {
			rejected: false
		},
		distinct: ['sentenceId'],
		orderBy: {
			'score':'asc'
		},
		take: 10
	})
	
	
	res.json(entityAnnotations)
}

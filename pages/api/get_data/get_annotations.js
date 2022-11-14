import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

	var relationAnnotations = await prisma.RelationAnnotation.findMany({
		select: {
			relationType: true,
            entityAnnotations: true,
            AnnotatedSentence: true,

		}
	})

    
	res.json(relationAnnotations[0])
	
}

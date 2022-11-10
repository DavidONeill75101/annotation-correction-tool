import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

	const sentence_id = parseInt(req.query.sentence_id)

    const params = {'sentence_id':sentence_id}
	
	var entity_annotations = await prisma.EntityAnnotation.findMany({
		select: {
			id:true,
            sentence_id: true,
            entity_type: true,
            start: true,
            end:true,            
		},
		where: params,
	})

    res.json(entity_annotations)
}

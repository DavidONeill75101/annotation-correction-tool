import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

	const sentence_id = parseInt(req.query.sentence_id)

    const params = {'sentence_id':sentence_id}
	
	var relation_annotations = await prisma.RelationAnnotation.findMany({
		select: {
			id:true,
            sentence_id: true,
            relation_type_id: true,
            entity_one_id: true,
            entity_two_id:true,            
		},
		where: params,
	})

    res.json(relation_annotations)
}

import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

	const sentence_id = parseInt(req.query.sentence_id)
    
    const relation_type_id = parseInt(req.query.relation_type_id)
    const src_id = parseInt(req.query.src_id)
    const dst_id = parseInt(req.query.dst_id)

    const record = {sentence_id: sentence_id,
            relation_type_id: relation_type_id,
            entity_one_id: src_id,
            entity_two_id: dst_id,
            entity_three_id: 0,
            variant_group: 'predisposing'}
	
	var relation_annotation = await prisma.RelationAnnotation.create({
		data: record,
	})

	res.json(relation_annotation)
      
	
}

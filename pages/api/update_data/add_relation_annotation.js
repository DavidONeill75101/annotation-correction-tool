import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

	const annotated_sentence_id = parseInt(req.query.sentence_id)
    const relation_type_id = parseInt(req.query.relation_type_id)
    
    const record = {
        annotatedSentenceId: annotated_sentence_id,
        relationTypeId: relation_type_id,
    }
	
	var relation_annotation = await prisma.RelationAnnotation.create({
		data: record,
	})

	res.json(relation_annotation)
      
	
}

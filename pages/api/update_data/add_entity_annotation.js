import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

    const start = parseInt(req.query.start)
	const annotated_sentence_id = parseInt(req.query.sentence_id)
    const entity_type_id = parseInt(req.query.entity_type_id)
    const offset = parseInt(req.query.offset)
    const relation_annotation_id = parseInt(req.query.relation_annotation_id)

    const record = {
        start: start,
        annotatedSentenceId: annotated_sentence_id,
        entityTypeId: entity_type_id,
        offset: offset,
        relationAnnotationId: relation_annotation_id    
    }
	
	var entity_annotation = await prisma.EntityAnnotation.create({
		data: record,
	})

	res.json(entity_annotation)
    
	
}

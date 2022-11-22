import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

    const relation_type_id = parseInt(req.query.relation_type_id)
    const user_annotation_id = parseInt(req.query.user_annotation_id)
    
    const record = {
        relationTypeId: relation_type_id,
        userAnnotationId: user_annotation_id,
    }
	
	var relation_annotation = await prisma.RelationAnnotation.create({
		data: record,
	})

	res.json(relation_annotation)
      
	
}

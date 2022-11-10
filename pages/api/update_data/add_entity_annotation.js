import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

	const sentence_id = parseInt(req.query.sentence_id)
    
    const entity_type = req.query.entity_type
    const start = parseInt(req.query.start)
    const end = parseInt(req.query.end)

    const entityAnnotationExists = await prisma.EntityAnnotation.findFirst({
        where: {sentence_id: sentence_id,
        relation_id: 2,
        entity_type: entity_type,
        start: start,
        end: end},
      });
    	
    if(!entityAnnotationExists){
        const record = {sentence_id: sentence_id,
            
            entity_type: entity_type,
            start: start,
            end: end}
	
	var entity_annotation = await prisma.EntityAnnotation.create({
		data: record,
	})

	res.json(entity_annotation)
    }   
	
}

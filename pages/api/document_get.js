import prisma from '../../lib/prisma'

export default async function handle(req, res) {
	
	const documentId = parseInt(req.query.documentId)
	
	var doc = await prisma.document.findUnique({
		where: {
			id: documentId,
		},
		include: {
			entityAnnotations: {include: {entity: {include: {entityType: true}}, user:true} },
			relationAnnotations: {include: {relationType: true} }
		}
	})
	
	doc['formatting'] = JSON.parse(doc.formatting_json)
	delete doc.formatting_json
	
	doc.entityAnnotations = doc.entityAnnotations.filter( a => !a.rejected )
	
	doc.entityAnnotations = doc.entityAnnotations.map( a => [a.start,a.end-a.start,'EntityAnnotation',{entityAnnotationId:a.id, entityId:a.entity.id, externalId:a.entity.externalId, name:a.entity.name, type:a.entity.entityType.name, description:a.entity.description, isUnlinked:a.entity.isUnlinked, userId:a.userId, userIsBot:a.user.isBot}] )
	
	doc.offset = 0
	
	res.json(doc)
}

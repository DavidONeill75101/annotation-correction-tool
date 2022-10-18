import prisma from '../../lib/prisma'

export default async function handle(req, res) {
	
	const sentenceId = parseInt(req.query.sentenceId)
	
	var sentence = await prisma.sentence.findUnique({
		where: {
			id: sentenceId,
		}
	})
	
	var doc = await prisma.document.findUnique({
		where: {
			id: sentence.documentId,
		},
		include: {
			entityAnnotations: {include: {entity: {include: {entityType: true}}, user:true} },
			relationAnnotations: {include: {relationType: true} }
		}
	})
	
	doc['formatting'] = JSON.parse(doc.formatting_json)
	doc['formatting'] = doc['formatting'].filter( a => (a[0] >= sentence.start && (a[0]+a[1]) <= sentence.end) )
	delete doc.formatting_json
	
	doc.entityAnnotations = doc.entityAnnotations.filter( a => (a.start >= sentence.start && a.end <= sentence.end) )
	
	doc.entityAnnotations = doc.entityAnnotations.filter( a => !a.rejected )
	
	doc.entityAnnotations = doc.entityAnnotations.map( a => [a.start,a.end-a.start,'EntityAnnotation',{entityAnnotationId:a.id, entityId:a.entity.id, externalId:a.entity.externalId, name:a.entity.name, type:a.entity.entityType.name, description:a.entity.description, isUnlinked:a.entity.isUnlinked, userId:a.userId, userIsBot:a.user.isBot}] )
	
	doc.contents = doc.contents.substring(sentence.start,sentence.end)
	
	doc.offset = sentence.start
	
	res.json(doc)
}

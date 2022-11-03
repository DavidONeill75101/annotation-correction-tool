import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
	
	const start = parseInt(req.query.start)
	const end = parseInt(req.query.end)
	const entityId = parseInt(req.query.entityId)
	const documentId = parseInt(req.query.documentid)
	const name = req.query.name
	
	const entity = await prisma.entity.findUnique({
		where: {
			id: entityId
		},
		include: {
			synonyms: true
		}
	})
	
	var entitySynonymId = null
	if (!entity.isUnlinked) {
		const nameLowercase = name.toLowerCase()
		
		const matchingSynonyms = entity.synonyms.filter( s => (s.name == nameLowercase) )
	
		if (matchingSynonyms.length == 0) {
			const entitySynonym = await prisma.entitySynonym.create({
			  data: {
				entityId: entityId,
				name: nameLowercase, // TODO: Should it be lowercase?
				status: 'ADDED_MANUALLY'
			  },
			})
			
			entitySynonymId = entitySynonym.id
		} else {
			entitySynonymId = matchingSynonyms[0].id
		}
	}
	
	const sentences = await prisma.sentence.findMany({
		where: {
			documentId: documentId
		},
	})
	
	const sentencesInRange = sentences.filter( s=> (s.start <= start && end <= s.end) )
	
	const sentenceId = sentencesInRange.length == 1 ? sentencesInRange[0].id : null
	
	const entityAnnotation = {
		rejected: false,
		start: start,
		end: end,
		entityId: entityId,
		documentId: documentId,
		sentenceId: sentenceId,
		userId: 1,
		score: 10,
		synonymId: entitySynonymId
	}
	
	const post = await prisma.entityAnnotation.create({data:entityAnnotation})
	
	res.status(200).json({'status':'success'})
	
}

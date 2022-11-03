import prisma from '../../lib/prisma'

export default async function handle(req, res) {
	
	const searchQuery = req.query.q.toLowerCase()
		
	const synonyms = await prisma.entitySynonym.findMany({
		where: {
			name: searchQuery,
		},
		include: {
			entity: {include: {entityType: true}}
		}
	})
	
	res.json(synonyms)
}

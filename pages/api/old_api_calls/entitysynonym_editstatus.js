import prisma from '../../lib/prisma'

export default async function handle(req, res) {
	
	const entitySynonymId = parseInt(req.query.entitySynonymId)
	const status = req.query.status
	
	const updateEntitySynonym = await prisma.entitySynonym.update({
		where: {
			id: entitySynonymId,
		},
		data: {
			status: status
		},
	})
	
	res.status(200).json({'status':'success'})
}

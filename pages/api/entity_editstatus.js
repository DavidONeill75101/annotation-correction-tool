import prisma from '../../lib/prisma'

export default async function handle(req, res) {
	
	const entityId = parseInt(req.query.entityId)
	const status = req.query.status
	
	const updateEntity = await prisma.entity.update({
		where: {
			id: entityId,
		},
		data: {
			status: status
		},
	})
	
	res.status(200).json({'status':'success'})
}

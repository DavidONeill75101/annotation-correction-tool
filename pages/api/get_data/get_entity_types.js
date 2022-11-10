import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

	var entity_types = await prisma.EntityType.findMany({
		select: {
			id:true,
            name: true
		}
	})

    
	res.json(entity_types)
}

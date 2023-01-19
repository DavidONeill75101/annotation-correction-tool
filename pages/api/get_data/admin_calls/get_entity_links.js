import prisma from '../../../../lib/prisma'


export default async function handle(req, res) {

    const entity_type = req.query.entity_type

	var entity_links = await prisma.EntityLink.findMany({
		select: {
			entityType: true,
            entityText: true,
            trueName: true,
		},
        where:{
            entityType: entity_type
        }
			
		
	})

    res.json(entity_links)
}

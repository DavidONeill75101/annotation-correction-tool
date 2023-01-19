import prisma from '../../../lib/prisma'


export default async function handle(req, res) {

    const entity_type = req.query.entity_type
    const entity_text = req.query.entity_text
    const true_name = req.query.true_name

    const record = {
        entityType: entity_type,
        entityText: entity_text,
        trueName: true_name    
    }
	
	var entity_link = await prisma.EntityLink.create({
		data: record,
	})

	res.json(entity_link)
}

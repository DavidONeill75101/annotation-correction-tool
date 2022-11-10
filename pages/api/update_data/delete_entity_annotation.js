import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

	const entity_id = parseInt(req.query.id)

    const deleteEntityAnnotation = await prisma.EntityAnnotation.delete({
        where: {id: entity_id}
        
      });
    

	res.json(deleteEntityAnnotation)
       
	
}

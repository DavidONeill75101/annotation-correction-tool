import prisma from '../../lib/prisma'

export default async function handle(req, res) {
	
	const relationAnnotationId = parseInt(req.query.relationAnnotationId);
	
	const deleteAnnotation = await prisma.relationAnnotation.delete({
	  where: {
		id: relationAnnotationId,
	  },
	})
	
	res.status(200).json({'status':'success'})
}

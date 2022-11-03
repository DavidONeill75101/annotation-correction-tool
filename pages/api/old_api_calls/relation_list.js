import prisma from '../../lib/prisma'

export default async function handle(req, res) {

	const documentId = parseInt(req.query.documentId)

	var relation_annotations = await prisma.relationAnnotation.findMany({
		where: {
			documentId: documentId,
		}
	})
	
	res.json(relation_annotations)
}
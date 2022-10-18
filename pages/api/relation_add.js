import prisma from '../../lib/prisma'

export default async function handle(req, res) {
	
	const relationAnnotation = {
		relationTypeId: parseInt(req.query.relationTypeId),
		documentId: parseInt(req.query.documentid),
		srcId: parseInt(req.query.srcId),
		dstId: parseInt(req.query.dstId),
		userId: 1
	}
	
	const post = await prisma.relationAnnotation.create({data:relationAnnotation})
	
	res.status(200).json({'status':'success'})
}

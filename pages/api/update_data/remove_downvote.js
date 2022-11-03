import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

	const id = parseInt(req.query.id)
	
	var params = {'id':id}
	
	var sentences = await prisma.sentence.update({
		where: params,
        data: {downvotes: {decrement:1}}
	})

	res.json(sentences)
}

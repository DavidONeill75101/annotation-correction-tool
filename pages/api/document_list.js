import prisma from '../../lib/prisma'

export default async function handle(req, res) {
	var documents = await prisma.document.findMany({
		select: {
			id: true,
			title: true
		}
	})
	
	res.json(documents)
}

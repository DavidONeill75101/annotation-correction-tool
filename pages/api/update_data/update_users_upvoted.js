import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

	const id = parseInt(req.query.id)
    const usernames = req.query.usernames
	
	var params = {'id':id}
	
	var sentences = await prisma.sentence.update({
		where: params,
        data: {users_upvoted:usernames}
	})

	res.json(sentences)
}

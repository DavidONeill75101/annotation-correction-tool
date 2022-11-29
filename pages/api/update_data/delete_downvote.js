import prisma from '../../../lib/prisma'


export default async function handle(req, res) {

	const sentence_id = parseInt(req.query.sentence_id)
    const user_id = parseInt(req.query.user_id)

    const deleteDownvote = await prisma.UserDownvote.delete({
        where: {
            sentenceId_userId: {sentenceId: sentence_id, userId: user_id}
        }
      });

	res.json(deleteDownvote)      	
}

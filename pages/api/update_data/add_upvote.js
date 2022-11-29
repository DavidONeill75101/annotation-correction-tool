import prisma from '../../../lib/prisma'


export default async function handle(req, res) {

    const user_id = parseInt(req.query.user_id)
    const sentence_id = parseInt(req.query.sentence_id)

    var user = await prisma.User.findUnique({
		
		where: {
            id: user_id
        },
		
	})

    var sentence = await prisma.sentence.findUnique({
        where: {
            id: sentence_id
        }
    })

    var possible_user_upvote = await prisma.UserUpvote.findMany({
        where: {
            sentenceId: sentence.id,
            userId: user.id
        }
    })

    if (possible_user_upvote.length == 0){
        var user_upvote = await prisma.UserUpvote.create({
            data: {
                sentenceId: sentence.id,
                userId: user.id
            }
        })    
        res.json(user_upvote)
    }else{
        res.json(['error'])
    }
}

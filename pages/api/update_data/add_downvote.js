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

    var possible_user_downvote = await prisma.UserDownvote.findMany({
        where: {
            sentenceId: sentence.id,
            userId: user.id
        }
    })

    if (possible_user_downvote.length == 0){
        var user_downvote = await prisma.UserDownvote.create({
            data: {
                sentenceId: sentence.id,
                userId: user.id
            }
        })    
        res.json(user_downvote)
    }else{
        res.json(['error'])
    }
    
}

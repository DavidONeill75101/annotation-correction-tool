import { TrendingDown } from '@material-ui/icons'
import prisma from '../../../../lib/prisma'


export default async function handle(req, res) {
  
    var users = await prisma.user.findMany({
		select: {
            id: true,
            upvoted_sentences: {
                select: {
                    sentenceId: true,
                }
            },
            downvoted_sentences: {
                select: {
                    sentenceId: true,
                }
            }
        },
    })

    


    res.json(users)
}

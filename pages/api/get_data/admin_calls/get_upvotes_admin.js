import prisma from '../../../../lib/prisma'


export default async function handle(req, res) {
  
    var upvotes = await prisma.UserUpvote.groupBy({
        by: ['sentenceId'],
        select: {
            
        }
    })

    var ids = []

    upvotes.forEach(function (item, index) {
        ids.push(item['sentenceId'])
    });

    var sentences = await prisma.sentence.findMany({
        select: {
            id: true,
            title: true,
        },
        where: {
            id: {
                in: ids
            }
        }
    })
    
	res.json(sentences)
}

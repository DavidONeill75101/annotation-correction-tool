import prisma from '../../../../lib/prisma'

export default async function handle(req, res) {
  
	
    var downvotes = await prisma.UserDownvote.groupBy({
        by: ['sentenceId'],
        select: {
            
        }
    })

    var ids = []

    downvotes.forEach(function (item, index) {
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

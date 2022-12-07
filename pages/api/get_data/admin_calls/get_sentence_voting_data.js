import prisma from '../../../../lib/prisma'


export default async function handle(req, res) {
  
    var sentences = await prisma.sentence.findMany({
		select: {
      id: true,
      _count: {
        select: {
          user_upvotes: true,
          user_downvotes: true,
        }
      },
    },

    where: {
        NOT: [
          {
            user_downvotes: {
              none: {}
            },
            user_upvotes: {
                none: {}
            },
          },
        ],
      },        
	})

    res.json(sentences)
}

import prisma from '../../../../lib/prisma'


export default async function handle(req, res) {

    const sentence_id = parseInt(req.query.sentence_id)
	
	var params = {'sentenceId':sentence_id}

	var user_annotations = await prisma.UserAnnotation.findMany({
		select: {
			sentenceId: true,
			userId: true,
			sentence: {
				select: {
					sentence: true
				}
			},
			relations: {
				select: {
                    gene: { select: {
                        name: true,
                    }},
                    cancer: { select: {
                        name: true,
                    }},
                    drug: { select: {
                        name: true,
                    }}, 
                    variant: { select: {
                        name: true,
                    }},
					relationType: {
						select: {
							name: true,
                        },
					},
				}
			}
		},

        where: params
	})

    res.json(user_annotations)
}

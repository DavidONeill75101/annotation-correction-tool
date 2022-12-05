import prisma from '../../../../lib/prisma'


export default async function handle(req, res) {

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
		}
	})

    res.json(user_annotations)
}

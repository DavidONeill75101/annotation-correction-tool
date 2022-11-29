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
					relationType: {
						select: {
							name: true,
						}
					},
					entityAnnotations: {
						select: {
							start: true,
							offset: true,
							entityType: {
								select: {
									name: true
								}
							}
						}
					}
				}
			}
		}
	})

    res.json(user_annotations)
}

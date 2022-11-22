import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

    const sentence_id = parseInt(req.query.sentence_id)
    const user_id = parseInt(req.query.user_id)
	
    const record = {
        sentenceId: sentence_id,
        userId: user_id,
    }
	
	var user_annotation = await prisma.UserAnnotation.create({
		data: record,
	})

	res.json(user_annotation)
    
	
}

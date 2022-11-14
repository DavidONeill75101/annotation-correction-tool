import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

    const text = req.query.text
	
    const record = {
        text: text
    }
	
	var annotated_sentence = await prisma.AnnotatedSentence.create({
		data: record,
	})

	res.json(annotated_sentence)
    
	
}

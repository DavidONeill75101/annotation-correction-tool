import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

	const sentence_id = parseInt(req.query.sentence_id)
	
	
	var params = {'id':sentence_id}
	
	var sentence = await prisma.sentence.findUnique({
		select:{
			user_upvotes: true,
			user_downvotes: true,
			sentence: true,
		},
		where: params,
		
	})

	if (sentence['subsection']=='None'){
            sentence['subsection'] = 'No subsection'
    }
    
	
	res.json(sentence)
}

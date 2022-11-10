import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

	const sentence_id = parseInt(req.query.sentence_id)
	
	
	var params = {'id':sentence_id}
	
	var sentence = await prisma.sentence.findUnique({
		select: {
			id:true,
            downvotes: true,
            formatted:true, 
            journal: true,
            pmid: true,
            section:true,
            sentence:true, 
            subsection:true,
            upvotes:true,
            year:true,
			users_upvoted: true,
			users_downvoted: true,
		},
		where: params,
		
	})

	if (sentence['subsection']=='None'){
            sentence['subsection'] = 'No subsection'
    }
    
	
	res.json(sentence)
}

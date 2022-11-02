import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

	const matching_id = req.query.matching_id
	const start = parseInt(req.query.start)
	const end = parseInt(req.query.end)
	

	var params = {'matching_id':matching_id}

	
	var sentences = await prisma.sentence.findMany({
		select: {
			id:true,
			matching_id: true,
			evidencetype: true,
			gene: true,
			cancer: true,
			variant_group: true,
			drug: true,
            downvotes: true,
            formatted:true, 
            journal: true,
            month: true,
            pmid: true,
            section:true,
            sentence:true, 
            subsection:true,
            title: true,
            upvotes:true,
            year:true,
			users_upvoted: true,
			users_downvoted: true,
		},
		where: params,
	})

	sentences.forEach(function(item, index){
        if (item['subsection']=='None'){
            item['subsection'] = 'No subsection'
        }
    })
	
	res.json(sentences.slice(start,end))

	
}

import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

	const matching_id = req.query.matching_id
    const gene = req.query.gene
	const cancer = req.query.cancer
	const drug = req.query.drug
	const evidence_type = req.query.evidence_type
	const variant = req.query.variant_group
	const start = parseInt(req.query.start)
	const end = parseInt(req.query.end)

    var params = {'upvotes':{'gt':0}}

	if (matching_id){
		params['matching_id'] = matching_id
	}

	if (gene){
		params['gene'] = gene
	}

	if (cancer){
		params['cancer'] = cancer
	}

	if (drug){
		params['drug'] = drug
	}

	if (evidence_type){
		params['evidencetype'] = evidence_type
	}

	if (variant){
		params['variant_group'] = variant
	}
	
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
		},
        where: params,
		skip: start,
		take: 9,
	})

	sentences.forEach(function(item, index){
        if (item['subsection']=='None'){
            item['subsection'] = 'No subsection'
        }

        if (item['drug']=='nan'){
            item['drug'] = 'No Drug'
        }

		if (item['variant_group']=='nan'){
			item['variant_group']='No variant'
		}
    })
	
	res.json(sentences)
}

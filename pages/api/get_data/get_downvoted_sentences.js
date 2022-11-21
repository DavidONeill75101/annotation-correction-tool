import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

    const matching_id = req.query.matching_id
    const gene = req.query.gene
	const cancer = req.query.cancer
	const drug = req.query.drug
	const evidence_type = req.query.evidence_type
	const variant = req.query.variant_group
	var start = parseInt(req.query.start)


	var params = {}

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

    
	var downvotes = await prisma.UserDownvote.findMany({
		
        select: {
            sentenceId: true,
            userId: true,
            sentence: true,
        },

        where: { 
            sentence: params            
        },

        skip: start,
		take: 9,
		
	})

	
	res.json(downvotes)

}

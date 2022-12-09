import prisma from '../../../lib/prisma'


export default async function handle(req, res) {

    const matching_id = req.query.matching_id
    const gene = req.query.gene
	const cancer = req.query.cancer
	const drug = req.query.drug
	const evidence_type = req.query.evidence_type
	const variant = req.query.variant_group
	const user_id = parseInt(req.query.user_id)

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
            sentence: {
				select: {
					id: true,
					pmid: true,
					journal: true,
					year: true,
					section: true,
					subsection: true,
					sentence: true,
					matching_id: true,
					user_annotations: true,
				}
			}
        },

        where: { 
            sentence: params,
			// sentence.user_annotations does not include
			user: {'id': user_id}       
        },

        skip: start,
		take: 9,
		
	})

	var annotated_sentences = []

	for (var sentence of downvotes){
		for (var user_annotation of sentence.sentence.user_annotations){
			if (user_annotation.userId == user_id) {
				annotated_sentences.push(sentence.sentenceId)
			}
		}
	}

	var non_annotated_sentences = []


	for (var sentence of downvotes){
		if (!annotated_sentences.includes(sentence.sentenceId)){
			non_annotated_sentences.push(sentence)
		}
	}
	

	res.json(non_annotated_sentences)
}

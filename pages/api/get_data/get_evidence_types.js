import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

	var evidence_types = await prisma.relation.findMany({
		select: {
			evidencetype: true,	
		}
	})

    var evidence_type_list = []

    evidence_types.forEach(function(item, index){
        if (!evidence_type_list.includes(item['evidencetype'])){
            evidence_type_list.push(item['evidencetype'])

        }
    })

	res.json(evidence_type_list.sort(Intl.Collator().compare))
}

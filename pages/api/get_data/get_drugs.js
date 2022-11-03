import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

	var drugs = await prisma.relation.findMany({
		select: {
			drug: true,	
		}
	})

    var drug_list = []

    drugs.forEach(function(item, index){
        if (!drug_list.includes(item['drug'])){
            drug_list.push(item['drug'])

        }
    })

	res.json(drug_list.sort(Intl.Collator().compare))
}

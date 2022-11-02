import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

	var variants = await prisma.relation.findMany({
		select: {
			variant_group: true,	
		}
	})

    var variant_list = []

    variants.forEach(function(item, index){
        if (!variant_list.includes(item['variant_group'])){
            variant_list.push(item['variant_group'])

        }
    })

	res.json(variant_list.sort(Intl.Collator().compare))
	
}

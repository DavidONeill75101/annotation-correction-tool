import prisma from '../../../lib/prisma'

export default async function handle(req, res) {

	var genes = await prisma.relation.findMany({
		select: {
			gene: true,	
		}
	})

    var gene_list = []

    genes.forEach(function(item, index){
        if (!gene_list.includes(item['gene'])){
            gene_list.push(item['gene'])

        }
    })


	res.json(gene_list.sort(Intl.Collator().compare))

	
}

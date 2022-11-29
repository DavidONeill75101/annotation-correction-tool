import prisma from '../../../lib/prisma'


export default async function handle(req, res) {

	var cancers = await prisma.relation.findMany({
		select: {
			cancer: true,	
		}
	})

    var cancer_list = []

    cancers.forEach(function(item, index){
        if (!cancer_list.includes(item['cancer'])){
            cancer_list.push(item['cancer'])

        }
    })

	res.json(cancer_list.sort(Intl.Collator().compare))	
}

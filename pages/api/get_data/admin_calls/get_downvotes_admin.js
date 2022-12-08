import prisma from '../../../../lib/prisma'


export default async function handle(req, res) {
	
    var downvotes = await prisma.UserDownvote.groupBy({
        by: ['sentenceId'],
        _count: {
            _all: true,
        }
    })

    var ids = []

    downvotes.forEach(function (item, index) {
        ids.push(item['sentenceId'])
    });

    var sentences = await prisma.sentence.findMany({
        select: {
            id: true,
            sentence: true,
            evidencetype: true,
            gene: true,
            cancer: true,
            drug: true,
            variant_group:true,
        },
        where: {
            id: {
                in: ids
            }
        }
    })

    var result = []

    sentences.forEach(function(sentence){
        var count = 0

        downvotes.forEach(function(downvote){
            if (downvote.sentenceId == sentence.id){
                count = downvote._count._all
            }
        })

        result.push({id:sentence.id, 
                    text: sentence.sentence, 
                    evidence_type:sentence.evidencetype, 
                    gene:sentence.gene, 
                    cancer: sentence.cancer, 
                    drug: sentence.drug,
                    variant_group: sentence.variant_group,
                    count: count})
    })

    res.json(result)
}

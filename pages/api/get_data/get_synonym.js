import prisma from '../../../lib/prisma'


export default async function handle(req, res) {
    
    const gene_name = req.query.gene
    const cancer_name = req.query.cancer
    const drug_name = req.query.drug
    const variant_name = req.query.variant

    if (typeof gene_name != 'undefined'){

        try{
            const gene_params = {'name':gene_name}

            var gene_synonym = await prisma.GeneSynonym.findMany({
                select: {
                    gene:true,
                },
                where: gene_params,
            })
            
            res.json([gene_synonym[0]['gene']['id'], gene_synonym[0]['gene']['name']])
        }catch(error){
            res.json('no synonym')
        }

        

    }else if( typeof cancer_name != 'undefined'){
        try{
            const cancer_params = {'name':cancer_name}

            var cancer_synonym = await prisma.CancerSynonym.findMany({
                select:{
                    cancer: true,
                },
                where: cancer_params,
            })  

            res.json([cancer_synonym[0]['cancer']['id'], cancer_synonym[0]['cancer']['name']])
        }catch(error){
            res.json('no synonym')
        }
        
    }else if( typeof drug_name != 'undefined'){
        try{
            const drug_params = {'name':drug_name}

            var drug_synonym = await prisma.DrugSynonym.findMany({
                select: {
                    drug: true,
                },
                where: drug_params,
            })
    
            res.json([drug_synonym[0]['drug']['id'], drug_synonym[0]['drug']['name']])
        }catch(error){
            res.json('no synonym')
        }
        
    }else if ( typeof variant_name != 'undefined'){
        try{
            const variant_params = {'name':variant_name}

            var variant_synonym = await prisma.VariantSynonym.findMany({
                select: {
                    variant: true,
                },
                where: variant_params,
            })

            res.json([variant_synonym[0]['variant']['id'], variant_synonym[0]['variant']['name']])

        }catch(error){
            res.json('no synonym')
        }
    }
  
}

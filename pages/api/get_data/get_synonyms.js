import prisma from '../../../lib/prisma'


export default async function handle(req, res) {

    try{
        const gene_name = req.query.gene_name

        const gene_params = {'name':gene_name}
    
        var gene_synonym = await prisma.GeneSynonym.findMany({
            
            where: gene_params,
        })
    
        const cancer_name = req.query.cancer_name
    
        const cancer_params = {'name':cancer_name}
    
        var cancer_synonym = await prisma.CancerSynonym.findMany({
            
            where: cancer_params,
        })
    
        const drug_name = req.query.drug_name
    
        const drug_params = {'name':drug_name}
    
        var drug_synonym = await prisma.DrugSynonym.findMany({
            
            where: drug_params,
        })
    
        const variant_name = req.query.variant_name
    
        const variant_params = {'name':variant_name}
    
        var variant_synonym = await prisma.VariantSynonym.findMany({
            
            where: variant_params,
        })
    
        res.json({'gene_id': gene_synonym[0]['geneId'], 'cancer_id': cancer_synonym[0]['cancerId'], 'drug_id': drug_synonym[0]['drugId'], 'variant_id': variant_synonym[0]['variantId']})	
    
    }catch{
        res.json("Entity Error")
    }

    }

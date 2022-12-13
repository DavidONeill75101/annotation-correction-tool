import prisma from '../../../lib/prisma'


export default async function handle(req, res) {
    
    const gene_name = req.query.gene
    const cancer_name = req.query.cancer
    const drug_name = req.query.drug

    if (typeof gene_name != 'undefined'){

        try{
            const gene_params = {'name':gene_name}

            var gene_synonym = await prisma.GeneSynonym.findMany({
                select: {
                    gene:true,
                },
                where: gene_params,
            })
            
            res.json(gene_synonym[0]['gene']['name'])
        }catch(error){
            console.log(error.message)
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

            res.json(cancer_synonym[0]['cancer']['name'])
        }catch(error){
            console.log(error.message)
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
    
            res.json(drug_synonym[0]['drug']['name'])
        }catch(error){
            console.log(error.message)
        }
        
    }
  
}

import prisma from '../../../lib/prisma'


export default async function handle(req, res) {

    const user_annotation_id = parseInt(req.query.user_annotation_id)
    const variant_name = req.query.variant_name
    const variant_group = req.query.variant_group
    
    const record = {
        userAnnotationId: user_annotation_id,
        variant_name: variant_name,
        variant_group: variant_group,
    }
	
	var variant_annotation = await prisma.VariantAnnotation.create({
		data: record,
	})

	res.json(variant_annotation)
}

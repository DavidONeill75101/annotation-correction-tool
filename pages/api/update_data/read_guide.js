import prisma from '../../../lib/prisma'


export default async function handle(req, res) {

	const id = parseInt(req.query.user_id)
	
    
    const read_guide = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          read_guide: true,
        },
      })

	res.json(read_guide)
}

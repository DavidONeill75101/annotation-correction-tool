import prisma from '../../../lib/prisma'


export default async function handle(req, res) {

	const email = req.query.email
    const params = {'email':email}
	
	var user = await prisma.User.findUnique({
		
		where: params,
		
	})

	res.json(user)
}

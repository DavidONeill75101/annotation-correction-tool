import prisma from '../../lib/prisma'

export default async function handle(req, res) {
		
	const post = await prisma.account.create({
		data: {
			username: req.query.username,
			password: req.query.password,
		},
	})
	
	res.status(200).json({'status':'success'})
}

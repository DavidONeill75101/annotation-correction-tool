import prisma from '../../lib/prisma'

export default async function handle(req, res) {
		
	if (!req.query.username || !req.query.password) {
        res.status(400).json({'error':'Please provide username and password'})
    }

    const account = await prisma.account.findFirst({
        where: {
            username: req.query.username,
            password: req.query.password,
        },
    })

    if (!account) {
        return res.json({
            status: "authentication failed"
        })
    } else {
        return res.json({
            status: "authorised",
            accountAuthorised: req.query.username,
        })
    }
}


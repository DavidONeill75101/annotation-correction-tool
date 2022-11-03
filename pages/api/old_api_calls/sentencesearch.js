import prisma from '../../lib/prisma'

export default async function handle(req, res) {
	
	const queryParts = req.query.q.split('|').map( x => { 
		const split = x.split(':')
		return {'key':split[0], 'value':parseInt(split[1]), 'autoOrManual':split[2]}
	} )
	
	const entityIds = queryParts.filter( x => x['key']=='entityId' )
	const entityTypeIds = queryParts.filter( x => x['key']=='entityTypeId' )
	const entityTagIds = queryParts.filter( x => x['key']=='entityTagId' )
	
	const whereEntityId = entityIds.map( entityId => {
		var where = {
			entityAnnotations: {
				some: {
					rejected: false,
					entityId: entityId.value
				},
			}
		}
		
		if (entityId.autoOrManual != 'either') {
			where.entityAnnotations.some.user = {isBot: entityId.autoOrManual=='auto'}
		}
		
		return where		
	})
	
	const whereEntityTypeId = entityTypeIds.map( entityTypeId => {
		var where = {
			entityAnnotations: {
				some: {
					rejected: false,
					entity: {
						entityTypeId: entityTypeId.value
					}
				},
			}
		}
		
		if (entityTypeId.autoOrManual != 'either') {
			where.entityAnnotations.some.user = {isBot: entityTypeId.autoOrManual=='auto'}
		}
		
		return where	
	})
	
	/* {
		entityTagId: entityTagId.value
	}*/
	
	
	const whereEntityTagId = entityTagIds.map( entityTagId => {
		var where = {
			entityAnnotations: {
				some: {
					rejected: false,
					entity: {
						tags: {
							some: {
								id: entityTagId.value
							}
						}
					}
				},
			}
		}
		
		if (entityTagId.autoOrManual != 'either') {
			where.entityAnnotations.some.user = {isBot: entityTagId.autoOrManual=='auto'}
		}
		
		return where	
	})
	
	const wheres = whereEntityId.concat(whereEntityTypeId, whereEntityTagId)
		
	var sentences = await prisma.sentence.findMany({
		where: {AND: wheres},
		include: {entityAnnotations:{include:{entity:{include: {tags:true}}, user:true}}},
		take: 10
	})
	
	res.json(sentences)
}

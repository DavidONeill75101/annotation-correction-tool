import prisma from '../../lib/prisma'

export default async function handle(req, res) {
	
	const query = req.query.q.toLowerCase()
	
	const types = await prisma.entityType.findMany({
		where: {
			name: {
				contains: query
			},
		},
		take: 5
	})
	const typesAsOptions = types.map(s => { return {value:'entityTypeId:'+s.id, label:s.name + ' (entity)'} } )
	const unlinkedAsOptions = types.map(s => { return {value:'entityId:'+s.unlinkedEntityId, label:'Unlinked ' + s.name + ' (' + s.name + ')'} } )
	
	
	const tags = await prisma.entityTag.findMany({
		where: {
			name: {
				contains: query
			},
		},
		include: {
			entityType: true
		},
		take: 5
	})
	const tagsAsOptions = tags.map(s => { return {value:'entityTagId:'+s.id, label:s.name + ' ('+ s.entityType.name +' tag)'} } )

	const exact = await prisma.entitySynonym.findMany({
		where: {
			name: query,
		},
		include: {
			entity: {include: {entityType: true}}
		},
		take: 5
	})
	const exactAsOptions = exact.map(s => { return {value:'entityId:'+s.entityId, label:s.name + ' (' + s.entity.entityType.name +  ')'} } )
	
	const starts = await prisma.entitySynonym.findMany({
		where: {
			name: {
				startsWith: query
			},
		},
		include: {
			entity: {include: {entityType: true}}
		},
		take: 5
	})
	const startsAsOptions = starts.map(s => { return {value:'entityId:'+s.entityId, label:s.name + ' (' + s.entity.entityType.name +  ')'} } )
		
	const contains = await prisma.entitySynonym.findMany({
		where: {
			name: {
				contains: query
			},
		},
		include: {
			entity: {include: {entityType: true}}
		},
		take: 5
	})
	const containsAsOptions = contains.map(s => { return {value:'entityId:'+s.entityId, label:s.name + ' (' + s.entity.entityType.name +  ')'} } )
	
	const asOptions = typesAsOptions.concat(unlinkedAsOptions,tagsAsOptions,exactAsOptions,startsAsOptions,containsAsOptions)
	
	const flags = new Set();
	const unique = asOptions.filter(opt => {
		if (flags.has(opt.value)) {
			return false;
		}
		flags.add(opt.value);
		return true;
	});
	
	const uniqueWithEmptyParams = unique.map( u => { return {value:u.value, label:u.label, params:{} }} )
	
	res.json(uniqueWithEmptyParams)
}

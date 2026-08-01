// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RadicleDelegate,
	labels: {
		singular: 'radicle delegate',
		plural: 'radicle delegates',
	},
})({
	$repository: {
		entityType: EntityType.RadicleRepository,
		cardinality: EntityFieldCardinality.One,
	},
	did: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	role: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validFromRevision: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validToRevision: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		RepositoryDid: [
			'$repository',
			'did',
		],
	},
})

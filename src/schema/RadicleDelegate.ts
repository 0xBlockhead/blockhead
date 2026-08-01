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
		label: 'repository',
		entityType: EntityType.RadicleRepository,
		cardinality: EntityFieldCardinality.One,
	},
	did: {
		label: 'DID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	role: {
		label: 'role',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validFromRevision: {
		label: 'valid from revision',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validToRevision: {
		label: 'valid to revision',
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

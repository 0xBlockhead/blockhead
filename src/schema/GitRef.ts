// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitRef,
	labels: {
		singular: 'Git ref',
		plural: 'Git refs',
	},
})({
	$repository: {
		entityType: EntityType.GitRepository,
		cardinality: EntityFieldCardinality.One,
	},
	refName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	refKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	targetObjectId: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	symbolicTarget: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$observations: {
		entityType: EntityType.GitRefObservation_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		RepositoryRefName: [
			'$repository',
			'refName',
		],
	},
})

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
		label: 'repository',
		entityType: EntityType.GitRepository,
		cardinality: EntityFieldCardinality.One,
	},
	refName: {
		label: 'ref name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	refKind: {
		label: 'ref kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	targetObjectId: {
		label: 'target object ID',
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	symbolicTarget: {
		label: 'symbolic target',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$observations: {
		label: 'observations',
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

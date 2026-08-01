// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.RadicleSignedRef,
	labels: {
		singular: 'radicle signed ref',
		plural: 'radicle signed refs',
	},
})({
	$repository: {
		entityType: EntityType.RadicleRepository,
		cardinality: EntityFieldCardinality.One,
	},
	nodeId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	refName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	targetObjectId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	signature: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$gitRef: {
		entityType: EntityType.GitRef,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$refObservation: {
		entityType: EntityType.GitRefObservation_Timestamp,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.RadicleSignedRef_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		RepositoryNodeIdRefName: [
			'$repository',
			'nodeId',
			'refName',
		],
	},
})

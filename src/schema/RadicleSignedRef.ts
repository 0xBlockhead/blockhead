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
		label: 'repository',
		entityType: EntityType.RadicleRepository,
		cardinality: EntityFieldCardinality.One,
	},
	nodeId: {
		label: 'node ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	refName: {
		label: 'ref name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	targetObjectId: {
		label: 'target object ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	signature: {
		label: 'signature',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$gitRef: {
		label: 'Git ref',
		entityType: EntityType.GitRef,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$refObservation: {
		label: 'ref observation',
		entityType: EntityType.GitRefObservation_Timestamp,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
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

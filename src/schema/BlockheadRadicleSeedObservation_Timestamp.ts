// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadRadicleSeedObservation_Timestamp,
	labels: {
		singular: 'blockhead radicle seed observation timestamp',
		plural: 'blockhead radicle seed observation observations',
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
	timestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$observerNode: {
		entityType: EntityType.BlockheadRadicleNodeState,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	advertised: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reachable: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	refCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	objectCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		RepositoryNodeIdTimestampMsSource: [
			'$repository',
			'nodeId',
			'timestampMs',
			'source',
		],
	},
})

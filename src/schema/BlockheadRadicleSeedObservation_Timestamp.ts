// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadRadicleSeedObservation_TimestampSelector {
	RepositoryNodeIdTimestampMsSource = 'RepositoryNodeIdTimestampMsSource',
}
export const BlockheadRadicleSeedObservation_Timestamp = entity({
	entityType: EntityType.BlockheadRadicleSeedObservation_Timestamp,
	labels: {
		singular: 'blockhead radicle seed observation timestamp',
		plural: 'blockhead radicle seed observation observations',
	},
})({
	$repository: {
		label: 'repository',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.RadicleRepository,
		cardinality: EntityFieldCardinality.One,
	},
	nodeId: {
		label: 'node ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$observerNode: {
		label: 'observer node',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BlockheadRadicleNodeState,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	advertised: {
		label: 'advertised',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	reachable: {
		label: 'reachable',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	refCount: {
		label: 'ref count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	objectCount: {
		label: 'object count',
		type: EntityFieldType.Primitive,
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

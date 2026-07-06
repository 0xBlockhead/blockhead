// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BlockheadRadicleSeedObservation_TimestampSelector {
	RepositoryNodeIdTimestampMsSource = 'RepositoryNodeIdTimestampMsSource',
}
export default {
	entityType: EntityType.BlockheadRadicleSeedObservation_Timestamp,
	label: 'blockhead radicle seed observation timestamp',
	labelPlural: 'blockhead radicle seed observation observations',
	selectors: [
		{
			name: BlockheadRadicleSeedObservation_TimestampSelector.RepositoryNodeIdTimestampMsSource,
			fields: [
				'$repository',
				'nodeId',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$repository',
			label: 'repository',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.RadicleRepository,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'nodeId',
			label: 'node ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$observerNode',
			label: 'observer node',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadRadicleNodeState,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'advertised',
			label: 'advertised',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'reachable',
			label: 'reachable',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'refCount',
			label: 'ref count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'objectCount',
			label: 'object count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZeroGStorageNode_TimestampSelector {
	StorageNodeTimestampMsSource = 'StorageNodeTimestampMsSource',
}
export default {
	entityType: EntityType.ZeroGStorageNode_Timestamp,
	label: 'zero g storage node timestamp',
	labelPlural: 'zero g storage node observations',
	selectors: [
		{
			name: ZeroGStorageNode_TimestampSelector.StorageNodeTimestampMsSource,
			fields: [
				'$storageNode',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$storageNode',
			label: 'storage node',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ZeroGStorageNode,
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
			name: 'balance',
			label: 'balance',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'totalReward',
			label: 'total reward',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'winCount',
			label: 'win count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'miningAttempts',
			label: 'mining attempts',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

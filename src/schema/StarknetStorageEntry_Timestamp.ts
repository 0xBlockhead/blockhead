// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StarknetStorageEntry_TimestampSelector {
	EntryBlockNumberSource = 'EntryBlockNumberSource',
}
export default {
	entityType: EntityType.StarknetStorageEntry_Timestamp,
	label: 'starknet storage entry timestamp',
	labelPlural: 'starknet storage entry observations',
	selectors: [
		{
			name: StarknetStorageEntry_TimestampSelector.EntryBlockNumberSource,
			fields: [
				'$entry',
				'blockNumber',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$entry',
				label: 'entry',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.StarknetStorageEntry,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'blockNumber',
				label: 'Block number',
				description: 'The block height or number in its network.',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
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
				name: 'value',
				label: 'Value',
				description: 'The source-domain value.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'blockHash',
				label: 'Block hash',
				description: 'The hash that identifies the block in its network.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

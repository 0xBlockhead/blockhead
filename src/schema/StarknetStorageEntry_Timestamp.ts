// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StarknetStorageEntry_TimestampSelector {
	EntryBlockNumberSource = 'EntryBlockNumberSource',
}
export const StarknetStorageEntry_Timestamp = entity({
	entityType: EntityType.StarknetStorageEntry_Timestamp,
	label: 'starknet storage entry timestamp',
	labelPlural: 'starknet storage entry observations',
})({
	$entry: {
		label: 'entry',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.StarknetStorageEntry,
		cardinality: EntityFieldCardinality.One,
	},
	blockNumber: {
		label: 'Block number',
		description: 'The block height or number in its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	value: {
		label: 'Value',
		description: 'The source-domain value.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockHash: {
		label: 'Block hash',
		description: 'The hash that identifies the block in its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		EntryBlockNumberSource: [
			'$entry',
			'blockNumber',
			'source',
		],
	},
})

// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SolanaBlock,
	labels: {
		singular: 'solana block',
		plural: 'Solana blocks',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		label: 'Slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint').narrow((value) => value >= 0n),
		cardinality: EntityFieldCardinality.One,
	},
	blockHeight: {
		label: 'Block height',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockHash: {
		label: 'Block hash',
		description: 'The hash that identifies the block in its network.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	previousBlockHash: {
		label: 'Previous block hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$parent: {
		label: 'Parent',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.SolanaBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	parentSlot: {
		label: 'Parent slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	transactionCount: {
		label: 'Transaction count',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$transactions: {
		label: 'Transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.SolanaTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Solana_JsonRpc,
		],
	},
})({
	selectors: {
		Slot: [
			'$network',
			'slot',
		],
	},
})

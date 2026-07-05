// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum TronBlockSelector {
	NetworkHeight = 'NetworkHeight',
	NetworkHeightHash = 'NetworkHeightHash',
}
export default {
	entityType: EntityType.TronBlock,
	label: 'tron block',
	labelPlural: 'tron blocks',
	selectors: [
		{
			name: TronBlockSelector.NetworkHeight,
			fields: [
				'$network',
				'height',
			],
		},
		{
			name: TronBlockSelector.NetworkHeightHash,
			fields: [
				'$network',
				'height',
				'hash',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'height',
				label: 'Height',
				description: 'The block height.',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'hash',
				label: 'Hash',
				description: 'The hash that identifies this object in its protocol.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$parent',
				label: 'Parent',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TronBlock,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
					Source.TronFullNode_Rest,
					Source.TronSolidityNode_Rest,
					Source.TronScan_Rest,
					Source.ThreeXpl_Rest,
				],
		},
		{
				name: 'parentHash',
				label: 'Parent hash',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
					Source.TronFullNode_Rest,
					Source.TronSolidityNode_Rest,
				],
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
					Source.TronFullNode_Rest,
					Source.TronSolidityNode_Rest,
					Source.TronScan_Rest,
					Source.ThreeXpl_Rest,
				],
		},
		{
				name: '$witness',
				label: 'Witness',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TronWitness,
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
				],
		},
		{
				name: 'txTrieRoot',
				label: 'Transaction trie root',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
				],
		},
		{
				name: 'version',
				label: 'Version',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
				],
		},
		{
				name: 'transactionCount',
				label: 'Transaction count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.TronGrid_Rest,
					Source.TronScan_Rest,
				],
		},
		{
				name: '$$transactions',
				label: 'Transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.TronTransaction,
				cardinality: EntityFieldCardinality.Many,
				defaultSources: [
					Source.TronGrid_Rest,
					Source.TronFullNode_Rest,
					Source.TronSolidityNode_Rest,
				],
		},
	],
} as const satisfies EntityDefinition

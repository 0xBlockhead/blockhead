// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum UtxoBlockSelector {
	NetworkHeight = 'NetworkHeight',
	NetworkHeightHash = 'NetworkHeightHash',
}
export default {
	entityType: EntityType.UtxoBlock,
	label: 'UTXO block',
	labelPlural: 'UTXO blocks',
	selectors: [
		{
			name: UtxoBlockSelector.NetworkHeight,
			fields: [
				'$network',
				'height',
			],
		},
		{
			name: UtxoBlockSelector.NetworkHeightHash,
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
				description: 'The block or ledger height in its network.',
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
				entityType: EntityType.UtxoBlock,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'merkleRoot',
				label: 'Merkle root',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'nonce',
				label: 'Nonce',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'difficulty',
				label: 'Difficulty',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'sizeBytes',
				label: 'Size',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'weightUnits',
				label: 'Weight',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'transactionCount',
				label: 'Transaction count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$transactions',
				label: 'Transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.UtxoTransaction,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

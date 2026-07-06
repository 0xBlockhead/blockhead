// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CosmosBlockSelector {
	NetworkHeight = 'NetworkHeight',
	NetworkHash = 'NetworkHash',
}
export default {
	entityType: EntityType.CosmosBlock,
	label: 'Cosmos block',
	labelPlural: 'Cosmos blocks',
	selectors: [
		{
			name: CosmosBlockSelector.NetworkHeight,
			fields: [
				'$network',
				'height',
			],
		},
		{
			name: CosmosBlockSelector.NetworkHash,
			fields: [
				'$network',
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
			name: 'proposerConsensusAddress',
			label: 'Proposer consensus address',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
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
			entityType: EntityType.CosmosTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

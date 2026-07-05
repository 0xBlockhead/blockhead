// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AptosBlockSelector {
	NetworkHeight = 'NetworkHeight',
	NetworkContainsVersion = 'NetworkContainsVersion',
}
export default {
	entityType: EntityType.AptosBlock,
	label: 'aptos block',
	labelPlural: 'aptos blocks',
	selectors: [
		{
			name: AptosBlockSelector.NetworkHeight,
			fields: [
				'$network',
				'height',
			],
		},
		{
			name: AptosBlockSelector.NetworkContainsVersion,
			fields: [
				'$network',
				'containsVersion',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.AptosNetwork,
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
				name: 'containsVersion',
				label: 'contains version',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'firstVersion',
				label: 'first version',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'lastVersion',
				label: 'last version',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
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
				name: '$$transactions',
				label: 'transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.AptosTransaction,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum HyperliquidTransactionSelector {
	NetworkTxHash = 'networkTxHash',
}

export default {
	entityType: EntityType.HyperliquidTransaction,

	label: 'Hyperliquid Transaction',
	labelPlural: 'Hyperliquid Transactions',

	selectors: [
		{
			name: HyperliquidTransactionSelector.NetworkTxHash,
			fields: [
				'$network',
				'txHash',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'txHash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HyperliquidBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$account',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.HyperliquidAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'actionType',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

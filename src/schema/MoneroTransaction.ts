import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum MoneroTransactionSelector {
	NetworkTxHash = 'networkTxHash',
}

export default {
	entityType: EntityType.MoneroTransaction,

	label: 'Monero Transaction',
	labelPlural: 'Monero Transactions',

	selectors: [
		{
			name: MoneroTransactionSelector.NetworkTxHash,
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
			entityType: EntityType.MoneroBlock,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'version',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'unlockTime',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feeAtomicUnits',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$keyImages',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoneroKeyImage,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$stealthOutputs',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoneroStealthOutput,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

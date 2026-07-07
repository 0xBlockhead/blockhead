// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CardanoTxOutputSelector {
	TransactionOutputIndex = 'TransactionOutputIndex',
}
export default {
	entityType: EntityType.CardanoTxOutput,
	label: 'cardano transaction output',
	labelPlural: 'cardano transaction outputs',
	selectors: [
		{
			name: CardanoTxOutputSelector.TransactionOutputIndex,
			fields: [
				'$transaction',
				'outputIndex',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CardanoTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'outputIndex',
			label: 'output index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'address',
			label: 'Address',
			description: 'The address or account identifier used by the source protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$address',
			label: 'Address',
			description: 'The address or account identifier used by the source protocol.',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CardanoAddress,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lovelace',
			label: 'lovelace',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'datumHash',
			label: 'datum hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'inlineDatum',
			label: 'inline datum',
			type: EntityFieldType.Primitive,
			primitiveType: type('unknown'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'referenceScriptHash',
			label: 'reference script hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'spentByTxHash',
			label: 'spent by transaction hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'spentByInputIndex',
			label: 'spent by input index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$assets',
			label: 'assets',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoTxOutputAsset,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ElementsIssuanceSelector {
	UtxoTransactionInputIndex = 'UtxoTransactionInputIndex',
}
export default {
	entityType: EntityType.ElementsIssuance,
	label: 'Elements issuance',
	labelPlural: 'Elements issuances',
	selectors: [
		{
			name: ElementsIssuanceSelector.UtxoTransactionInputIndex,
			fields: [
				'$transaction',
				'inputIndex',
			],
		},
	],
	fields: [
		{
			name: '$transaction',
			label: 'Transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'inputIndex',
			label: 'Input index',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$asset',
			label: 'Asset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ElementsAsset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$reissuanceTokenAsset',
			label: 'Reissuance token asset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ElementsAsset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'assetEntropy',
			label: 'Asset entropy',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'assetBlindingNonce',
			label: 'Asset blinding nonce',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'issuedAmount',
			label: 'Issued amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tokenAmount',
			label: 'Token amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'isReissuance',
			label: 'Reissuance',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ElementsIssuanceSelector {
	UtxoTransactionInputIndex = 'utxoTransactionInputIndex',
	TransactionInputIndex = '$transaction+inputIndex',
}
export default {
	entityType: EntityType.ElementsIssuance,
	label: 'elements issuance',
	labelPlural: 'elements issuances',
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
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoTransaction,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'inputIndex',
			label: 'input index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$asset',
			label: 'asset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ElementsAsset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$reissuanceTokenAsset',
			label: 'reissuance token asset',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.ElementsAsset,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'assetEntropy',
			label: 'asset entropy',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'assetBlindingNonce',
			label: 'asset blinding nonce',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'issuedAmount',
			label: 'issued amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tokenAmount',
			label: 'token amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'isReissuance',
			label: 'is reissuance',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

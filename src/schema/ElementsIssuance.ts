// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ElementsIssuanceSelector {
	UtxoTransactionInputIndex = 'UtxoTransactionInputIndex',
}
export const ElementsIssuance = entity({
	entityType: EntityType.ElementsIssuance,
	labels: {
		singular: 'Elements issuance',
		plural: 'Elements issuances',
	},
})({
	$transaction: {
		label: 'Transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	inputIndex: {
		label: 'Input index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$asset: {
		label: 'Asset',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ElementsAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$reissuanceTokenAsset: {
		label: 'Reissuance token asset',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ElementsAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	assetEntropy: {
		label: 'Asset entropy',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	assetBlindingNonce: {
		label: 'Asset blinding nonce',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	issuedAmount: {
		label: 'Issued amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokenAmount: {
		label: 'Token amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isReissuance: {
		label: 'Reissuance',
		type: EntityFieldType.Primitive,
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		UtxoTransactionInputIndex: [
			'$transaction',
			'inputIndex',
		],
	},
})

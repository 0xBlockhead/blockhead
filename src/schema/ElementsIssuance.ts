// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ElementsIssuance,
	labels: {
		singular: 'Elements issuance',
		plural: 'Elements issuances',
	},
})({
	$transaction: {
		label: 'Transaction',
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	inputIndex: {
		label: 'Input index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$asset: {
		label: 'Asset',
		entityType: EntityType.ElementsAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$reissuanceTokenAsset: {
		label: 'Reissuance token asset',
		entityType: EntityType.ElementsAsset,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	assetEntropy: {
		label: 'Asset entropy',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	assetBlindingNonce: {
		label: 'Asset blinding nonce',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	issuedAmount: {
		label: 'Issued amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokenAmount: {
		label: 'Token amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isReissuance: {
		label: 'Reissuance',
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

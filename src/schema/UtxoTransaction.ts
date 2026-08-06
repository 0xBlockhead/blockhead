// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.UtxoTransaction,
	labels: {
		singular: 'UTXO transaction',
		plural: 'UTXO transactions',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	txId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		entityType: EntityType.UtxoBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lockTime: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sizeBytes: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	virtualSizeBytes: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	weightUnits: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeSats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isCoinbase: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$inputs: {
		entityType: EntityType.UtxoInput,
		cardinality: EntityFieldCardinality.Many,
	},
	$$outputs: {
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.Many,
	},
	$$zcashShieldedActions: {
		entityType: EntityType.ZcashShieldedAction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$bitcoinOrdinalInscriptions: {
		entityType: EntityType.BitcoinOrdinalInscription,
		cardinality: EntityFieldCardinality.Many,
	},
	$bitcoinRunestone: {
		entityType: EntityType.BitcoinRunestone,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkTxId: [
			'$network',
			'txId',
		],
	},
})

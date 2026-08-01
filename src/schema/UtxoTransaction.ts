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
		label: 'Network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	txId: {
		label: 'Transaction ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$block: {
		label: 'Block',
		entityType: EntityType.UtxoBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		label: 'Version',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lockTime: {
		label: 'Lock time',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sizeBytes: {
		label: 'Size',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	virtualSizeBytes: {
		label: 'Virtual size',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	weightUnits: {
		label: 'Weight',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	feeSats: {
		label: 'Fee',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	isCoinbase: {
		label: 'Coinbase',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$inputs: {
		label: 'Inputs',
		entityType: EntityType.UtxoInput,
		cardinality: EntityFieldCardinality.Many,
	},
	$$outputs: {
		label: 'Outputs',
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.Many,
	},
	$$zcashShieldedActions: {
		label: 'Zcash shielded actions',
		entityType: EntityType.ZcashShieldedAction,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkTxId: [
			'$network',
			'txId',
		],
	},
})

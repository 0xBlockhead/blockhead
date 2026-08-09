// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BitcoinRuneBalance,
	labels: {
		singular: 'Bitcoin Rune balance',
		plural: 'Bitcoin Rune balances',
	},
	description: 'Runes balance attached to a Bitcoin UTXO (txid:vout) or address view.',
})({
	$output: {
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.One,
	},
	$address: {
		entityType: EntityType.UtxoAddress,
		cardinality: EntityFieldCardinality.One,
	},
	$rune: {
		entityType: EntityType.BitcoinRune,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	amount: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	divisibility: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	symbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
})({
	selectors: {
		UtxoOutputRune: [
			'$output',
			'$rune',
		],
		UtxoAddressRune: [
			'$address',
			'$rune',
		],
	},
})

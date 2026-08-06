// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BitcoinRune,
	labels: {
		singular: 'Bitcoin Rune',
		plural: 'Bitcoin Runes',
	},
	description: 'Runes etched asset (`block:tx` rune id). Distinct from CashTokens and from the per-transaction runestone OP_RETURN message.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	runeId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	rune: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	spacedRune: {
		primitiveType: type('string'),
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
	divisibility: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	$etchingTransaction: {
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
})({
	selectors: {
		NetworkRuneId: [
			'$network',
			'runeId',
		],
	},
})

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
	number: {
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
	divisibility: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	etchingHeight: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	etchingTxIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	etchingTimestampMs: {
		primitiveType: type('number'),
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
	premine: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	supply: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	mints: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	burned: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	holders: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	transactions: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	mintable: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	remaining: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	termsAmount: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	termsCap: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	termsHeightStart: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	termsHeightEnd: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	termsOffsetStart: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	termsOffsetEnd: {
		primitiveType: type('number.integer >= 0'),
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

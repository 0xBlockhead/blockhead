// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CardanoTxOutput,
	labels: {
		singular: 'cardano transaction output',
		plural: 'cardano transaction outputs',
	},
})({
	$transaction: {
		label: 'transaction',
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	outputIndex: {
		label: 'output index',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		entityType: EntityType.CardanoAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lovelace: {
		label: 'lovelace',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	datumHash: {
		label: 'datum hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inlineDatum: {
		label: 'inline datum',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	referenceScriptHash: {
		label: 'reference script hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spentByTxHash: {
		label: 'spent by transaction hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spentByInputIndex: {
		label: 'spent by input index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$assets: {
		label: 'assets',
		entityType: EntityType.CardanoTxOutputAsset,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
})({
	selectors: {
		TransactionOutputIndex: [
			'$transaction',
			'outputIndex',
		],
	},
})

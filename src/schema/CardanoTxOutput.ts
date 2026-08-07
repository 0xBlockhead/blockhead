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
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.One,
	},
	outputIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$address: {
		entityType: EntityType.CardanoAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	lovelace: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	datumHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	inlineDatum: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	referenceScriptHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spentByTxHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	spentByInputIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$assets: {
		entityType: EntityType.CardanoTxOutputAsset,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
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

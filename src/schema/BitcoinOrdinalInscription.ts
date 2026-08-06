// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BitcoinOrdinalInscription,
	labels: {
		singular: 'Bitcoin Ordinal inscription',
		plural: 'Bitcoin Ordinal inscriptions',
	},
	description: 'Ordinals inscription envelope (reveal witness OP_FALSE OP_IF … PUSH "ord"). Identity is the reveal transaction inscription index (`{txid}i{n}`), not a generic UTXO NFT.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	inscriptionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	inscriptionIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitcoinCore_JsonRpc,
			Source.Esplora_Rest,
			Source.MempoolSpace_Rest,
			Source.UniSat_Rest,
		],
	},
	$revealTransaction: {
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitcoinCore_JsonRpc,
			Source.Esplora_Rest,
			Source.MempoolSpace_Rest,
			Source.UniSat_Rest,
		],
	},
	revealInputIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitcoinCore_JsonRpc,
			Source.Esplora_Rest,
			Source.MempoolSpace_Rest,
		],
	},
	revealWitnessIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitcoinCore_JsonRpc,
			Source.Esplora_Rest,
			Source.MempoolSpace_Rest,
		],
	},
	$contentOutput: {
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	contentType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitcoinCore_JsonRpc,
			Source.Esplora_Rest,
			Source.MempoolSpace_Rest,
			Source.UniSat_Rest,
		],
	},
	contentLength: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	bodyHex: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitcoinCore_JsonRpc,
			Source.Esplora_Rest,
			Source.MempoolSpace_Rest,
		],
	},
	contentBody: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	payloadHex: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitcoinCore_JsonRpc,
			Source.Esplora_Rest,
			Source.MempoolSpace_Rest,
		],
	},
	inscriptionNumber: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	genesisHeight: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	genesisTimestampMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	satOffset: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	$address: {
		entityType: EntityType.UtxoAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
})({
	selectors: {
		NetworkInscriptionId: [
			'$network',
			'inscriptionId',
		],
	},
})

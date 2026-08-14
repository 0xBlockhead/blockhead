// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.UtxoAddress_Timestamp,
	labels: {
		singular: 'UTXO address timestamp',
		plural: 'UTXO address observations',
	},
})({
	$address: {
		entityType: EntityType.UtxoAddress,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	balanceSats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitcoinCashNode_JsonRpc,
			Source.Blockchair_Rest,
			Source.DogecoinCore_JsonRpc,
			Source.Esplora_Rest,
			Source.LitecoinCore_JsonRpc,
			Source.MempoolSpace_Rest,
		],
	},
	fundedOutputCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockchair_Rest,
			Source.Esplora_Rest,
			Source.MempoolSpace_Rest,
		],
	},
	fundedValueSats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockchair_Rest,
			Source.Esplora_Rest,
			Source.MempoolSpace_Rest,
		],
	},
	spentOutputCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockchair_Rest,
			Source.Esplora_Rest,
			Source.MempoolSpace_Rest,
		],
	},
	spentValueSats: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockchair_Rest,
			Source.Esplora_Rest,
			Source.MempoolSpace_Rest,
		],
	},
	transactionCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockchair_Rest,
			Source.Esplora_Rest,
			Source.MempoolSpace_Rest,
		],
	},
	unspentOutputCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.BitcoinCashNode_JsonRpc,
			Source.Blockchair_Rest,
			Source.DogecoinCore_JsonRpc,
			Source.Esplora_Rest,
			Source.LitecoinCore_JsonRpc,
			Source.MempoolSpace_Rest,
		],
	},
	mempoolTransactionCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockchair_Rest,
			Source.Esplora_Rest,
			Source.MempoolSpace_Rest,
		],
	},
})({
	selectors: {
		AddressTimestampMsSource: [
			'$address',
			'timestampMs',
			'source',
		],
	},
})

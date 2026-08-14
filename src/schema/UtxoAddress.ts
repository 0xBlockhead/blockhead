// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.UtxoAddress,
	labels: {
		singular: 'UTXO address',
		plural: 'UTXO addresses',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$$timestamps: {
		entityType: EntityType.UtxoAddress_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.BitcoinCashNode_JsonRpc,
			Source.Blockchair_Rest,
			Source.DogecoinCore_JsonRpc,
			Source.Esplora_Rest,
			Source.LitecoinCore_JsonRpc,
			Source.MempoolSpace_Rest,
			Source.Zcashd_JsonRpc,
			Source.Zebra_JsonRpc,
		],
	},
	$$outputs: {
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.BitcoinCashNode_JsonRpc,
			Source.Blockchair_Rest,
			Source.DogecoinCore_JsonRpc,
			Source.Esplora_Rest,
			Source.LitecoinCore_JsonRpc,
			Source.MempoolSpace_Rest,
			Source.Zcashd_JsonRpc,
			Source.Zebra_JsonRpc,
		],
	},
	$$transactions: {
		entityType: EntityType.UtxoTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Esplora_Rest,
			Source.MempoolSpace_Rest,
		],
	},
	$$bitcoinOrdinalInscriptions: {
		entityType: EntityType.BitcoinOrdinalInscription,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
	$$bitcoinRuneBalances: {
		entityType: EntityType.BitcoinRuneBalance,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.UniSat_Rest,
		],
	},
})({
	selectors: {
		NetworkAddress: [
			'$network',
			'address',
		],
	},
})

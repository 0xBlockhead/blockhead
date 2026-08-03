// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const blockfrostRestSources = [
	Source.Blockfrost_Rest,
] as const

export default entity({
	entityType: EntityType.CardanoAddress,
	labels: {
		singular: 'cardano address',
		plural: 'cardano addresses',
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
	addressKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestSources,
	},
	paymentCredential: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stakeCredential: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$stakeCredential: {
		entityType: EntityType.CardanoStakeCredential,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestSources,
	},
	$$utxos: {
		entityType: EntityType.CardanoTxOutput,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: blockfrostRestSources,
	},
	$$assets: {
		entityType: EntityType.CardanoNativeAsset,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: blockfrostRestSources,
	},
	$$transactions: {
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: blockfrostRestSources,
	},
	$$timestamps: {
		entityType: EntityType.CardanoAddress_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: blockfrostRestSources,
	},
})({
	selectors: {
		NetworkAddress: [
			'$network',
			'address',
		],
	},
})

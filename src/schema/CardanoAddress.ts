// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CardanoAddress,
	labels: {
		singular: 'cardano address',
		plural: 'cardano addresses',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	address: {
		label: 'Address',
		description: 'The address or account identifier used by the source protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	addressKind: {
		label: 'address kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	paymentCredential: {
		label: 'payment credential',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	stakeCredential: {
		label: 'stake credential',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$stakeCredential: {
		label: 'stake credential',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoStakeCredential,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	$$utxos: {
		label: 'utxos',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoTxOutput,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	$$assets: {
		label: 'native assets',
		description: 'Native assets present across the current unspent outputs at this address.',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoNativeAsset,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoAddress_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
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

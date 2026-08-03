// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const blockfrostRestSources = [
	Source.Blockfrost_Rest,
] as const
const cardanoKoiosRestSources = [
	Source.CardanoKoios_Rest,
] as const

export default entity({
	entityType: EntityType.CardanoTransaction,
	labels: {
		singular: 'cardano transaction',
		plural: 'cardano transactions',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	blockSlot: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fee: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deposit: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sizeBytes: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validityStartSlot: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ttlSlot: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadata: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$inputs: {
		entityType: EntityType.CardanoTxInput,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: blockfrostRestSources,
	},
	$$outputs: {
		entityType: EntityType.CardanoTxOutput,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: blockfrostRestSources,
	},
	$$certificates: {
		entityType: EntityType.CardanoCertificate,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: cardanoKoiosRestSources,
	},
	$$scripts: {
		entityType: EntityType.CardanoScriptWitness,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: cardanoKoiosRestSources,
	},
	$$governanceProposals: {
		entityType: EntityType.CardanoGovernanceProposal,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: cardanoKoiosRestSources,
	},
	$$governanceVotes: {
		entityType: EntityType.CardanoGovernanceVote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: cardanoKoiosRestSources,
	},
	$$assets: {
		entityType: EntityType.CardanoNativeAsset,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: blockfrostRestSources,
	},
})({
	selectors: {
		NetworkHash: [
			'$network',
			'hash',
		],
	},
})

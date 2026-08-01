// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CardanoTransaction,
	labels: {
		singular: 'cardano transaction',
		plural: 'cardano transactions',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	blockSlot: {
		label: 'block slot',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fee: {
		label: 'fee',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deposit: {
		label: 'deposit',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sizeBytes: {
		label: 'size bytes',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validityStartSlot: {
		label: 'validity start slot',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ttlSlot: {
		label: 'ttl slot',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadata: {
		label: 'metadata',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$inputs: {
		label: 'inputs',
		entityType: EntityType.CardanoTxInput,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	$$outputs: {
		label: 'outputs',
		entityType: EntityType.CardanoTxOutput,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	$$certificates: {
		label: 'certificates',
		entityType: EntityType.CardanoCertificate,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	$$scripts: {
		label: 'scripts',
		entityType: EntityType.CardanoScriptWitness,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	$$governanceProposals: {
		label: 'governance proposals',
		entityType: EntityType.CardanoGovernanceProposal,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	$$governanceVotes: {
		label: 'governance votes',
		entityType: EntityType.CardanoGovernanceVote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	$$assets: {
		label: 'assets',
		description: 'Native assets touched by transaction inputs or outputs.',
		entityType: EntityType.CardanoNativeAsset,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
})({
	selectors: {
		NetworkHash: [
			'$network',
			'hash',
		],
	},
})

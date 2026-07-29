// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	blockSlot: {
		label: 'block slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fee: {
		label: 'fee',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	deposit: {
		label: 'deposit',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	sizeBytes: {
		label: 'size bytes',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	validityStartSlot: {
		label: 'validity start slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	ttlSlot: {
		label: 'ttl slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadata: {
		label: 'metadata',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$inputs: {
		label: 'inputs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoTxInput,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	$$outputs: {
		label: 'outputs',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoTxOutput,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	$$certificates: {
		label: 'certificates',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoCertificate,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	$$scripts: {
		label: 'scripts',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoScriptWitness,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	$$governanceProposals: {
		label: 'governance proposals',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoGovernanceProposal,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	$$governanceVotes: {
		label: 'governance votes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoGovernanceVote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	$$assets: {
		label: 'assets',
		description: 'Native assets touched by transaction inputs or outputs.',
		type: EntityFieldType.EntitiesReference,
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

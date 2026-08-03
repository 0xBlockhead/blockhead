// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CardanoGovernanceProposal,
	labels: {
		singular: 'cardano governance proposal',
		plural: 'cardano governance proposals',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	proposalTxHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	proposalIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	governanceActionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	proposalKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	$transaction: {
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	depositLovelace: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	returnAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	anchorUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	anchorHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	$previousAction: {
		entityType: EntityType.CardanoGovernanceProposal,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	policyHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	hardForkMajor: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	hardForkMinor: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	treasuryWithdrawals: {
		primitiveType: type({
			recipientNetwork: type('string'),
			recipientCredential: type('string'),
			lovelace: type('bigint'),
		}),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	committeeRemovedCredentials: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	committeeAdditions: {
		primitiveType: type({
			credential: type('string'),
			expirationEpoch: type('number'),
		}),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	committeeQuorumNumerator: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	committeeQuorumDenominator: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	constitutionAnchorUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	constitutionAnchorHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	constitutionScript: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	$$timestamps: {
		entityType: EntityType.CardanoGovernanceProposal_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	$$votes: {
		entityType: EntityType.CardanoGovernanceVote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
})({
	selectors: {
		NetworkProposalTxHashProposalIndex: [
			'$network',
			'proposalTxHash',
			'proposalIndex',
		],
	},
})

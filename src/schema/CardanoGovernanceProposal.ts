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
const blockfrostRestCardanoKoiosRestSources = [
	Source.Blockfrost_Rest,
	Source.CardanoKoios_Rest,
] as const

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
		defaultSources: blockfrostRestSources,
	},
	proposalKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: cardanoKoiosRestSources,
	},
	$transaction: {
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: cardanoKoiosRestSources,
	},
	depositLovelace: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: cardanoKoiosRestSources,
	},
	returnAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: cardanoKoiosRestSources,
	},
	anchorUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: cardanoKoiosRestSources,
	},
	anchorHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: cardanoKoiosRestSources,
	},
	$previousAction: {
		entityType: EntityType.CardanoGovernanceProposal,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestCardanoKoiosRestSources,
	},
	policyHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestCardanoKoiosRestSources,
	},
	hardForkMajor: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestCardanoKoiosRestSources,
	},
	hardForkMinor: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestCardanoKoiosRestSources,
	},
	treasuryWithdrawals: {
		primitiveType: type({
			recipientNetwork: type('string'),
			recipientCredential: type('string'),
			lovelace: type('bigint'),
		}),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: blockfrostRestCardanoKoiosRestSources,
	},
	committeeRemovedCredentials: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: blockfrostRestCardanoKoiosRestSources,
	},
	committeeAdditions: {
		primitiveType: type({
			credential: type('string'),
			expirationEpoch: type('number'),
		}),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: blockfrostRestCardanoKoiosRestSources,
	},
	committeeQuorumNumerator: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestCardanoKoiosRestSources,
	},
	committeeQuorumDenominator: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestCardanoKoiosRestSources,
	},
	constitutionAnchorUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestCardanoKoiosRestSources,
	},
	constitutionAnchorHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestCardanoKoiosRestSources,
	},
	constitutionScript: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestCardanoKoiosRestSources,
	},
	$$timestamps: {
		entityType: EntityType.CardanoGovernanceProposal_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: blockfrostRestSources,
	},
	$$votes: {
		entityType: EntityType.CardanoGovernanceVote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: blockfrostRestSources,
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

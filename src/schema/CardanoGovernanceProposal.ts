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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	proposalTxHash: {
		label: 'proposal transaction hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	proposalIndex: {
		label: 'proposal index',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	governanceActionId: {
		label: 'governance action ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	proposalKind: {
		label: 'proposal kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	$transaction: {
		label: 'transaction',
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	depositLovelace: {
		label: 'deposit lovelace',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	returnAddress: {
		label: 'return address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	anchorUrl: {
		label: 'anchor URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	anchorHash: {
		label: 'anchor hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.CardanoKoios_Rest,
		],
	},
	$previousAction: {
		label: 'previous action',
		entityType: EntityType.CardanoGovernanceProposal,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	policyHash: {
		label: 'policy hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	hardForkMajor: {
		label: 'hard fork major version',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	hardForkMinor: {
		label: 'hard fork minor version',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	treasuryWithdrawals: {
		label: 'treasury withdrawals',
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
		label: 'committee removals',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	committeeAdditions: {
		label: 'committee additions',
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
		label: 'committee quorum numerator',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	committeeQuorumDenominator: {
		label: 'committee quorum denominator',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	constitutionAnchorUrl: {
		label: 'constitution anchor URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	constitutionAnchorHash: {
		label: 'constitution anchor hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	constitutionScript: {
		label: 'constitution script',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
			Source.CardanoKoios_Rest,
		],
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.CardanoGovernanceProposal_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	$$votes: {
		label: 'votes',
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

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CardanoGovernanceVote,
	labels: {
		singular: 'cardano governance vote',
		plural: 'cardano governance votes',
	},
})({
	$proposal: {
		entityType: EntityType.CardanoGovernanceProposal,
		cardinality: EntityFieldCardinality.One,
	},
	voterKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	voterCredential: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	vote: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$drep: {
		entityType: EntityType.CardanoDRep,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$stakePool: {
		entityType: EntityType.CardanoStakePool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$transaction: {
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	voteTxHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	voteIndex: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	anchorUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	anchorHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	epoch: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slot: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ProposalVoterKindVoterCredentialVoteTxHashSource: [
			'$proposal',
			'voterKind',
			'voterCredential',
			'voteTxHash',
			'source',
		],
	},
})

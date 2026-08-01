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
		label: 'proposal',
		entityType: EntityType.CardanoGovernanceProposal,
		cardinality: EntityFieldCardinality.One,
	},
	voterKind: {
		label: 'voter kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	voterCredential: {
		label: 'voter credential',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	vote: {
		label: 'vote',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$drep: {
		label: 'drep',
		entityType: EntityType.CardanoDRep,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$stakePool: {
		label: 'stake pool',
		entityType: EntityType.CardanoStakePool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$transaction: {
		label: 'transaction',
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	voteTxHash: {
		label: 'vote transaction hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	voteIndex: {
		label: 'vote index',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	anchorUrl: {
		label: 'anchor URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	anchorHash: {
		label: 'anchor hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	epoch: {
		label: 'epoch',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slot: {
		label: 'slot',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'timestamp',
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

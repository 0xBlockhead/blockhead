// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CardanoGovernanceVoteSelector {
	ProposalVoterKindVoterCredentialVoteTxHashSource = 'ProposalVoterKindVoterCredentialVoteTxHashSource',
}
export const CardanoGovernanceVote = entity({
	entityType: EntityType.CardanoGovernanceVote,
	labels: {
		singular: 'cardano governance vote',
		plural: 'cardano governance votes',
	},
})({
	$proposal: {
		label: 'proposal',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoGovernanceProposal,
		cardinality: EntityFieldCardinality.One,
	},
	voterKind: {
		label: 'voter kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	voterCredential: {
		label: 'voter credential',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	vote: {
		label: 'vote',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$drep: {
		label: 'drep',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoDRep,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$stakePool: {
		label: 'stake pool',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoStakePool,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$transaction: {
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	voteTxHash: {
		label: 'vote transaction hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	voteIndex: {
		label: 'vote index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	anchorUrl: {
		label: 'anchor URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	anchorHash: {
		label: 'anchor hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	epoch: {
		label: 'epoch',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	slot: {
		label: 'slot',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	timestampMs: {
		label: 'timestamp',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
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

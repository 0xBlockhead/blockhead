import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CardanoGovernanceVoteSelector {
	ProposalVoterKindVoterCredentialSource = '$proposal+voterKind+voterCredential+source',
}
export default {
	entityType: EntityType.CardanoGovernanceVote,
	label: 'cardano governance vote',
	labelPlural: 'cardano governance votes',
	selectors: [
		{
			name: CardanoGovernanceVoteSelector.ProposalVoterKindVoterCredentialSource,
			fields: [
				'$proposal',
				'voterKind',
				'voterCredential',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$proposal',
			label: 'proposal',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CardanoGovernanceProposal,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'voterKind',
			label: 'voter kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'voterCredential',
			label: 'voter credential',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'vote',
			label: 'vote',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$drep',
			label: 'drep',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CardanoDRep,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$stakePool',
			label: 'stake pool',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CardanoStakePool,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CardanoTransaction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'voteTxHash',
			label: 'vote transaction hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'voteIndex',
			label: 'vote index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'anchorUrl',
			label: 'anchor URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'anchorHash',
			label: 'anchor hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'epoch',
			label: 'epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'slot',
			label: 'slot',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CosmosGovernanceProposalVoteSelector {
	ProposalVoter = '$proposal+$voter',
}
export default {
	entityType: EntityType.CosmosGovernanceProposalVote,
	label: 'Cosmos governance proposal vote',
	labelPlural: 'Cosmos governance proposal votes',
	selectors: [
		{
			name: CosmosGovernanceProposalVoteSelector.ProposalVoter,
			fields: [
				'$proposal',
				'$voter',
			],
		},
	],
	fields: [
		{
			name: '$proposal',
			label: 'proposal',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosGovernanceProposal,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$voter',
			label: 'voter',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosGovernanceProposalVote_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

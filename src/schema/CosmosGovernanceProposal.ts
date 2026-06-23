import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CosmosGovernanceProposalSelector {
	NetworkProposalId = 'networkProposalId',
}
export default {
	entityType: EntityType.CosmosGovernanceProposal,
	label: 'Cosmos governance proposal',
	labelPlural: 'Cosmos governance proposals',
	selectors: [
		{
			name: CosmosGovernanceProposalSelector.NetworkProposalId,
			fields: [
				'$network',
				'proposalId',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'proposalId',
			label: 'proposal ID',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'title',
			label: 'title',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'summary',
			label: 'summary',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'metadata',
			label: 'metadata',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$messages',
			label: 'messages',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosMessage,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$deposits',
			label: 'deposits',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosGovernanceProposalDeposit,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$votes',
			label: 'votes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosGovernanceProposalVote,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosGovernanceProposal_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$tallies',
			label: 'tallies',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosGovernanceProposalTally_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

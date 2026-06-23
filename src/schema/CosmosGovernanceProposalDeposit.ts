import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CosmosGovernanceProposalDepositSelector {
	ProposalDepositorDenom = '$proposal+$depositor+denom',
}
export default {
	entityType: EntityType.CosmosGovernanceProposalDeposit,
	label: 'Cosmos governance proposal deposit',
	labelPlural: 'Cosmos governance proposal deposits',
	selectors: [
		{
			name: CosmosGovernanceProposalDepositSelector.ProposalDepositorDenom,
			fields: [
				'$proposal',
				'$depositor',
				'denom',
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
			name: '$depositor',
			label: 'depositor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'denom',
			label: 'denom',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CosmosGovernanceProposalDeposit_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

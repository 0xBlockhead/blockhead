// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CosmosGovernanceProposal_TimestampSelector {
	ProposalTimestampMsSource = 'ProposalTimestampMsSource',
}
export default {
	entityType: EntityType.CosmosGovernanceProposal_Timestamp,
	label: 'Cosmos governance proposal timestamp',
	labelPlural: 'Cosmos governance proposal observations',
	selectors: [
		{
			name: CosmosGovernanceProposal_TimestampSelector.ProposalTimestampMsSource,
			fields: [
				'$proposal',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$proposal',
				label: 'Proposal',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CosmosGovernanceProposal,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'status',
				label: 'Status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'submitTimeMs',
				label: 'Submit time',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'depositEndTimeMs',
				label: 'Deposit end time',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'votingStartTimeMs',
				label: 'Voting start time',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'votingEndTimeMs',
				label: 'Voting end time',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'metadata',
				label: 'Metadata',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

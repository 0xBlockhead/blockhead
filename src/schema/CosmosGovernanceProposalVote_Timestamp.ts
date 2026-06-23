import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CosmosGovernanceProposalVote_TimestampSelector {
	VoteTimestampMsSource = '$vote+timestampMs+source',
}
export default {
	entityType: EntityType.CosmosGovernanceProposalVote_Timestamp,
	label: 'Cosmos governance proposal vote timestamp',
	labelPlural: 'Cosmos governance proposal vote observations',
	selectors: [
		{
			name: CosmosGovernanceProposalVote_TimestampSelector.VoteTimestampMsSource,
			fields: [
				'$vote',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$vote',
			label: 'vote',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosGovernanceProposalVote,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
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
			name: 'option',
			label: 'option',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'weight',
			label: 'weight',
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
			name: 'voteTimeMs',
			label: 'vote time ms',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

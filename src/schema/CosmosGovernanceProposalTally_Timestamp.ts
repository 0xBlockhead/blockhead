import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CosmosGovernanceProposalTally_TimestampSelector {
	ProposalTimestampMsSource = '$proposal+timestampMs+source',
}
export default {
	entityType: EntityType.CosmosGovernanceProposalTally_Timestamp,
	label: 'Cosmos governance proposal tally timestamp',
	labelPlural: 'Cosmos governance proposal tally observations',
	selectors: [
		{
			name: CosmosGovernanceProposalTally_TimestampSelector.ProposalTimestampMsSource,
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
			label: 'proposal',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosGovernanceProposal,
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
			name: 'yesCount',
			label: 'yes count',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'abstainCount',
			label: 'abstain count',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'noCount',
			label: 'no count',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'noWithVetoCount',
			label: 'no with veto count',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'turnout',
			label: 'turnout',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

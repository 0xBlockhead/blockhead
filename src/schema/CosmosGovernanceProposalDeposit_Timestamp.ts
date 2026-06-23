import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CosmosGovernanceProposalDeposit_TimestampSelector {
	DepositTimestampMsSource = '$deposit+timestampMs+source',
}
export default {
	entityType: EntityType.CosmosGovernanceProposalDeposit_Timestamp,
	label: 'Cosmos governance proposal deposit timestamp',
	labelPlural: 'Cosmos governance proposal deposit observations',
	selectors: [
		{
			name: CosmosGovernanceProposalDeposit_TimestampSelector.DepositTimestampMsSource,
			fields: [
				'$deposit',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$deposit',
			label: 'deposit',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CosmosGovernanceProposalDeposit,
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
			name: 'amount',
			label: 'amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'depositTimeMs',
			label: 'deposit time ms',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

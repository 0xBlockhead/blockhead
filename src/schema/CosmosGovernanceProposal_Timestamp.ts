// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CosmosGovernanceProposal_TimestampSelector {
	ProposalTimestampMsSource = 'ProposalTimestampMsSource',
}
export const CosmosGovernanceProposal_Timestamp = entity({
	entityType: EntityType.CosmosGovernanceProposal_Timestamp,
	label: 'Cosmos governance proposal timestamp',
	labelPlural: 'Cosmos governance proposal observations',
})({
	$proposal: {
		label: 'Proposal',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CosmosGovernanceProposal,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The source that produced this observation.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	status: {
		label: 'Status',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	submitTimeMs: {
		label: 'Submit time',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	depositEndTimeMs: {
		label: 'Deposit end time',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	votingStartTimeMs: {
		label: 'Voting start time',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	votingEndTimeMs: {
		label: 'Voting end time',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	metadata: {
		label: 'Metadata',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ProposalTimestampMsSource: [
			'$proposal',
			'timestampMs',
			'source',
		],
	},
})

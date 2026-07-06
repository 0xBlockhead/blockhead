// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CardanoGovernanceProposal_TimestampSelector {
	ProposalEpochSource = 'ProposalEpochSource',
}
export default {
	entityType: EntityType.CardanoGovernanceProposal_Timestamp,
	label: 'cardano governance proposal timestamp',
	labelPlural: 'cardano governance proposal observations',
	selectors: [
		{
			name: CardanoGovernanceProposal_TimestampSelector.ProposalEpochSource,
			fields: [
				'$proposal',
				'epoch',
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
			name: 'epoch',
			label: 'epoch',
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
			name: 'slot',
			label: 'slot',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'enactedEpoch',
			label: 'enacted epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'expiredEpoch',
			label: 'expired epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'droppedEpoch',
			label: 'dropped epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ratifiedEpoch',
			label: 'ratified epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'yesStakeLovelace',
			label: 'yes stake lovelace',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'noStakeLovelace',
			label: 'no stake lovelace',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'abstainStakeLovelace',
			label: 'abstain stake lovelace',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'drepYesStakeLovelace',
			label: 'drep yes stake lovelace',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'drepNoStakeLovelace',
			label: 'drep no stake lovelace',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'spoYesStakeLovelace',
			label: 'spo yes stake lovelace',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'spoNoStakeLovelace',
			label: 'spo no stake lovelace',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'committeeYesCount',
			label: 'committee yes count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'committeeNoCount',
			label: 'committee no count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

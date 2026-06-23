import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum CardanoGovernanceProposalSelector {
	NetworkProposalTxHashProposalIndex = '$network+proposalTxHash+proposalIndex',
}
export default {
	entityType: EntityType.CardanoGovernanceProposal,
	label: 'cardano governance proposal',
	labelPlural: 'cardano governance proposals',
	selectors: [
		{
			name: CardanoGovernanceProposalSelector.NetworkProposalTxHashProposalIndex,
			fields: [
				'$network',
				'proposalTxHash',
				'proposalIndex',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CardanoNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'proposalTxHash',
			label: 'proposal transaction hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'proposalIndex',
			label: 'proposal index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'proposalKind',
			label: 'proposal kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$transaction',
			label: 'transaction',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.CardanoTransaction,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'depositLovelace',
			label: 'deposit lovelace',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'returnAddress',
			label: 'return address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
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
			name: 'proposalPayload',
			label: 'proposal payload',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoGovernanceProposal_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$votes',
			label: 'votes',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.CardanoGovernanceVote,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

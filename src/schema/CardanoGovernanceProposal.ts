// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum CardanoGovernanceProposalSelector {
	NetworkProposalTxHashProposalIndex = 'NetworkProposalTxHashProposalIndex',
}
export const CardanoGovernanceProposal = entity({
	entityType: EntityType.CardanoGovernanceProposal,
	labels: {
		singular: 'cardano governance proposal',
		plural: 'cardano governance proposals',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	proposalTxHash: {
		label: 'proposal transaction hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	proposalIndex: {
		label: 'proposal index',
		type: EntityFieldType.Primitive,
		primitiveType: (type('number.integer >= 0')),
		cardinality: EntityFieldCardinality.One,
	},
	proposalKind: {
		label: 'proposal kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	$transaction: {
		label: 'transaction',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.CardanoTransaction,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	depositLovelace: {
		label: 'deposit lovelace',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	returnAddress: {
		label: 'return address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	anchorUrl: {
		label: 'anchor URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	anchorHash: {
		label: 'anchor hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	proposalPayload: {
		label: 'proposal payload',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoGovernanceProposal_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	$$votes: {
		label: 'votes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoGovernanceVote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
})({
	selectors: {
		NetworkProposalTxHashProposalIndex: [
			'$network',
			'proposalTxHash',
			'proposalIndex',
		],
	},
})

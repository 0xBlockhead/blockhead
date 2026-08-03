// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CardanoCommittee_Epoch,
	labels: {
		singular: 'cardano committee epoch',
		plural: 'cardano committee epochs',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	epoch: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	govActionId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	$seatingProposal: {
		entityType: EntityType.CardanoGovernanceProposal,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	dissolved: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	quorumNumerator: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	quorumDenominator: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	memberCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	members: {
		primitiveType: type({
			cc_cold_id: type('string'),
			cc_cold_hex: type('string'),
			cc_cold_has_script: type('boolean'),
			cc_hot_id: type('unknown'),
			cc_hot_hex: type('unknown'),
			cc_hot_has_script: type('unknown'),
			status: type('string'),
			expiration_epoch: type('number'),
		}),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	threshold: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$votes: {
		entityType: EntityType.CardanoGovernanceVote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
})({
	selectors: {
		NetworkEpochSource: [
			'$network',
			'epoch',
			'source',
		],
	},
})

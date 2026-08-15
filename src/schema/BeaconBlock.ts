// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconBlock,
	labels: {
		singular: 'beacon block',
		plural: 'Beacon blocks',
	},
	description: 'A signed consensus block occurrence identified by its fork root.',
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	root: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	$slot: {
		entityType: EntityType.BeaconSlot,
		cardinality: EntityFieldCardinality.One,
	},
	$proposer: {
		entityType: EntityType.BeaconValidator,
		cardinality: EntityFieldCardinality.One,
	},
	$parent: {
		entityType: EntityType.BeaconBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	version: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	stateRoot: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	bodyRoot: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	signature: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.One,
	},
	$executionBlock: {
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	rewardTotalGwei: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Beacon_Rest,
		],
	},
	rewardAttestationsGwei: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Beacon_Rest,
		],
	},
	rewardSyncAggregateGwei: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Beacon_Rest,
		],
	},
	rewardProposerSlashingsGwei: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Beacon_Rest,
		],
	},
	rewardAttesterSlashingsGwei: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Beacon_Rest,
		],
	},
	$executionPayloadBid: {
		entityType: EntityType.BeaconExecutionPayloadBid,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Beacon_Rest,
		],
	},
	$executionPayloadEnvelope: {
		entityType: EntityType.BeaconExecutionPayloadEnvelope,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Beacon_Rest,
		],
	},
	$$attestations: {
		entityType: EntityType.BeaconAttestation,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Beacon_Rest,
			Source.BeaconchaIn_Rest,
		],
	},
	$$deposits: {
		entityType: EntityType.BeaconDeposit,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Beacon_Rest,
			Source.BeaconchaIn_Rest,
		],
	},
	$$slashings: {
		entityType: EntityType.BeaconSlashing,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Beacon_Rest,
			Source.BeaconchaIn_Rest,
		],
	},
	$$timestamps: {
		entityType: EntityType.BeaconBlock_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Beacon_Rest,
		],
	},
	$$withdrawals: {
		entityType: EntityType.BeaconWithdrawal,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Beacon_Rest,
			Source.BeaconchaIn_Rest,
		],
	},
})({
	selectors: {
		NetworkRoot: [
			'$network',
			'root',
		],
	},
})

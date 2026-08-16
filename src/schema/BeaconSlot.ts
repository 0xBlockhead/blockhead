// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconSlot,
	labels: {
		singular: 'beacon slot',
		plural: 'Beacon slots',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	slot: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	epoch: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
	},
	$epoch: {
		entityType: EntityType.BeaconEpoch,
		cardinality: EntityFieldCardinality.One,
	},
	$$blocks: {
		entityType: EntityType.BeaconBlock,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Beacon_Rest,
			Source.BeaconchaIn_Rest,
		],
	},
	$$beaconCommittees: {
		entityType: EntityType.BeaconCommittee,
		cardinality: EntityFieldCardinality.Many,
	},
	$$beaconDeposits: {
		entityType: EntityType.BeaconDeposit,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Beacon_Rest,
			Source.BeaconchaIn_Rest,
		],
	},
	$$beaconAttestations: {
		entityType: EntityType.BeaconAttestation,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Beacon_Rest,
			Source.BeaconchaIn_Rest,
		],
	},
	$$beaconWithdrawals: {
		entityType: EntityType.BeaconWithdrawal,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Beacon_Rest,
			Source.BeaconchaIn_Rest,
		],
	},
	$$beaconSlashings: {
		entityType: EntityType.BeaconSlashing,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Beacon_Rest,
			Source.BeaconchaIn_Rest,
		],
	},
	$$dataColumns: {
		entityType: EntityType.BeaconDataColumn,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Beacon_Rest,
		],
	},
	$executionBlock: {
		entityType: EntityType.EvmBlock,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Beacon_Rest,
		],
	},
})({
	selectors: {
		EvmNetworkSlot: [
			'$network',
			'slot',
		],
	},
})

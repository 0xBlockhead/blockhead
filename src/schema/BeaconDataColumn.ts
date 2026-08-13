// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BeaconDataColumn,
	labels: {
		singular: 'beacon data column',
		plural: 'Beacon data columns',
	},
	description: 'A PeerDAS data column and its KZG material, keyed by its owning beacon slot and protocol column index.',
})({
	$slot: {
		entityType: EntityType.BeaconSlot,
		cardinality: EntityFieldCardinality.One,
	},
	columnIndex: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	forkVersion: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Beacon_Rest,
		],
	},
	columnCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Beacon_Rest,
		],
	},
	columns: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Beacon_Rest,
		],
	},
	kzgProofs: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Beacon_Rest,
		],
	},
	kzgCommitments: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Beacon_Rest,
		],
	},
	beaconBlockRoot: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Beacon_Rest,
		],
	},
	$$timestamps: {
		entityType: EntityType.BeaconDataColumn_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Beacon_Rest,
		],
	},
})({
	selectors: {
		SlotColumnIndex: [
			'$slot',
			'columnIndex',
		],
	},
})

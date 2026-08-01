// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BnbBeaconNetwork,
	labels: {
		singular: 'bnb beacon network',
		plural: 'bnb beacon networks',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	decommissionedAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fusionDeadlineMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$blocks: {
		entityType: EntityType.BnbBeaconBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		entityType: EntityType.BnbBeaconTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$validators: {
		entityType: EntityType.BnbValidator,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokens: {
		entityType: EntityType.BnbBeaconToken,
		cardinality: EntityFieldCardinality.Many,
	},
	$$migrationRecords: {
		entityType: EntityType.BnbBeaconTokenMigration,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		entityType: EntityType.BnbBeaconNetwork_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Network: [
			'$network',
		],
	},
})

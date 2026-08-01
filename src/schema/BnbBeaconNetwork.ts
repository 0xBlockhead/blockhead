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
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	decommissionedAtMs: {
		label: 'decommissioned AT ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fusionDeadlineMs: {
		label: 'fusion deadline ms',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$blocks: {
		label: 'blocks',
		entityType: EntityType.BnbBeaconBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		entityType: EntityType.BnbBeaconTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$validators: {
		label: 'validators',
		entityType: EntityType.BnbValidator,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokens: {
		label: 'tokens',
		entityType: EntityType.BnbBeaconToken,
		cardinality: EntityFieldCardinality.Many,
	},
	$$migrationRecords: {
		label: 'migration records',
		entityType: EntityType.BnbBeaconTokenMigration,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
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

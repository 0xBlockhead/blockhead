// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	decommissionedAtMs: {
		label: 'decommissioned AT ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fusionDeadlineMs: {
		label: 'fusion deadline ms',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$blocks: {
		label: 'blocks',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BnbBeaconBlock,
		cardinality: EntityFieldCardinality.Many,
	},
	$$transactions: {
		label: 'transactions',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BnbBeaconTransaction,
		cardinality: EntityFieldCardinality.Many,
	},
	$$validators: {
		label: 'validators',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BnbValidator,
		cardinality: EntityFieldCardinality.Many,
	},
	$$tokens: {
		label: 'tokens',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BnbBeaconToken,
		cardinality: EntityFieldCardinality.Many,
	},
	$$migrationRecords: {
		label: 'migration records',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BnbBeaconTokenMigration,
		cardinality: EntityFieldCardinality.Many,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
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

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BnbBeaconNetworkSelector {
	Network = 'Network',
}
export default {
	entityType: EntityType.BnbBeaconNetwork,
	label: 'bnb beacon network',
	labelPlural: 'bnb beacon networks',
	selectors: [
		{
			name: BnbBeaconNetworkSelector.Network,
			fields: [
				'$network',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'decommissionedAtMs',
				label: 'decommissioned AT ms',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'fusionDeadlineMs',
				label: 'fusion deadline ms',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$blocks',
				label: 'blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BnbBeaconBlock,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$transactions',
				label: 'transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BnbBeaconTransaction,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$validators',
				label: 'validators',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BnbValidator,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$tokens',
				label: 'tokens',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BnbBeaconToken,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$migrationRecords',
				label: 'migration records',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BnbBeaconTokenMigration,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BnbBeaconNetwork_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

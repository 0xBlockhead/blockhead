// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BnbBeaconTokenMigration,
	labels: {
		singular: 'bnb beacon token migration',
		plural: 'bnb beacon token migrations',
	},
})({
	$token: {
		label: 'token',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.BnbBeaconToken,
		cardinality: EntityFieldCardinality.One,
	},
	$targetNetwork: {
		label: 'target network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	targetAddress: {
		label: 'target address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	migrationKind: {
		label: 'migration kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceAddress: {
		label: 'source address',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	targetContractAddress: {
		label: 'target contract address',
		type: EntityFieldType.Primitive,
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'amount',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	eventTxHash: {
		label: 'event transaction hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.BnbBeaconTokenMigration_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		TokenTargetNetworkTargetAddress: [
			'$token',
			'$targetNetwork',
			'targetAddress',
		],
	},
})

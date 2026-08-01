// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.BnbBeaconToken,
		cardinality: EntityFieldCardinality.One,
	},
	$targetNetwork: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	targetAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	migrationKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceAddress: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	targetContractAddress: {
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	eventTxHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
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

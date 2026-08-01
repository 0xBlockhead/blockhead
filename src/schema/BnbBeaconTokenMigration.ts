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
		label: 'token',
		entityType: EntityType.BnbBeaconToken,
		cardinality: EntityFieldCardinality.One,
	},
	$targetNetwork: {
		label: 'target network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	targetAddress: {
		label: 'target address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	migrationKind: {
		label: 'migration kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	sourceAddress: {
		label: 'source address',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	targetContractAddress: {
		label: 'target contract address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	eventTxHash: {
		label: 'event transaction hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'timestamps',
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

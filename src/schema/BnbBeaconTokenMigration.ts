import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
export enum BnbBeaconTokenMigrationSelector {
	TokenTargetNetworkTargetAddress = '$token+targetNetwork+targetAddress',
}
export default {
	entityType: EntityType.BnbBeaconTokenMigration,
	label: 'bnb beacon token migration',
	labelPlural: 'bnb beacon token migrations',
	selectors: [
		{
			name: BnbBeaconTokenMigrationSelector.TokenTargetNetworkTargetAddress,
			fields: [
				'$token',
				'targetNetwork',
				'targetAddress',
			],
		},
	],
	fields: [
		{
			name: '$token',
			label: 'token',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BnbBeaconToken,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$targetNetwork',
			label: 'target network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'targetAddress',
			label: 'target address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'migrationKind',
			label: 'migration kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'sourceAddress',
			label: 'source address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'targetContractAddress',
			label: 'target contract address',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amount',
			label: 'amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'eventTxHash',
			label: 'event transaction hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BnbBeaconTokenMigration_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

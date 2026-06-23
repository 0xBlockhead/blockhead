import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BnbBeaconTokenSelector {
	NetworkSymbol = '$network+symbol',
}
export default {
	entityType: EntityType.BnbBeaconToken,
	label: 'bnb beacon token',
	labelPlural: 'bnb beacon tokens',
	selectors: [
		{
			name: BnbBeaconTokenSelector.NetworkSymbol,
			fields: [
				'$network',
				'symbol',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BnbBeaconNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'symbol',
			label: 'Symbol',
			description: 'The short ticker or symbol used for display.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'originalSymbol',
			label: 'original symbol',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tokenName',
			label: 'token name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'ownerAddress',
			label: 'owner address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tokenType',
			label: 'token type',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BnbBeaconToken_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$transfers',
			label: 'transfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BnbBeaconTokenTransfer,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$migrations',
			label: 'migrations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BnbBeaconTokenMigration,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

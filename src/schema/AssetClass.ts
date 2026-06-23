import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AssetClassSelector {
	AssetInstanceClassKindClassKey = '$assetInstance+classKind+classKey',
}
export default {
	entityType: EntityType.AssetClass,
	label: 'asset class',
	labelPlural: 'asset classes',
	description: 'A reusable asset classification used to group related asset instances and objects.',
	selectors: [
		{
			name: AssetClassSelector.AssetInstanceClassKindClassKey,
			fields: [
				'$assetInstance',
				'classKind',
				'classKey',
			],
		},
	],
	fields: [
		{
			name: '$assetInstance',
			label: 'asset instance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AssetInstance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'classKind',
			label: 'class kind',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'classKey',
			label: 'class key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'label',
			label: 'Label',
			description: 'A human-readable name for the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'slot',
			label: 'slot',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'partition',
			label: 'partition',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'series',
			label: 'series',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'maturityMs',
			label: 'maturity ms',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'valueDecimals',
			label: 'value decimals',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$objects',
			label: 'objects',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AssetObject,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$supplyLedgerStates',
			label: 'supply ledger states',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AssetSupply_LedgerCoordinate,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$supplyTimestamps',
			label: 'supply timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AssetSupply_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

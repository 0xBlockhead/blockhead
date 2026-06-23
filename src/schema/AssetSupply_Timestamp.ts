import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AssetSupply_TimestampSelector {
	AssetInstanceSupplyScopeKeyTimestampMsSource = '$assetInstance+supplyScopeKey+timestampMs+source',
}
export default {
	entityType: EntityType.AssetSupply_Timestamp,
	label: 'asset supply timestamp',
	labelPlural: 'asset supply observations',
	selectors: [
		{
			name: AssetSupply_TimestampSelector.AssetInstanceSupplyScopeKeyTimestampMsSource,
			fields: [
				'$assetInstance',
				'supplyScopeKey',
				'timestampMs',
				'source',
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
			name: 'supplyScopeKey',
			label: 'supply scope key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$class',
			label: 'class',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AssetClass,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'classKey',
			label: 'class key',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'totalSupply',
			label: 'total supply',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'circulatingSupply',
			label: 'circulating supply',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'burnedSupply',
			label: 'burned supply',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'methodology',
			label: 'methodology',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

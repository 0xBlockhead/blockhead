// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AssetSupply_TimestampSelector {
	AssetInstanceSupplyScopeKeyTimestampMsSource = 'AssetInstanceSupplyScopeKeyTimestampMsSource',
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
			label: 'Asset instance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AssetInstance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'supplyScopeKey',
			label: 'Supply scope key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$class',
			label: 'Class',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AssetClass,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'classKey',
			label: 'Class key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'totalSupply',
			label: 'Total supply',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'circulatingSupply',
			label: 'Circulating supply',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'burnedSupply',
			label: 'Burned supply',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'methodology',
			label: 'Methodology',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AssetClassSelector {
	AssetInstanceClassKindClassKey = 'AssetInstanceClassKindClassKey',
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
			label: 'Asset instance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AssetInstance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'classKind',
			label: 'Class kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'classKey',
			label: 'Class key',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'label',
			label: 'Label',
			description: 'A human-readable name for the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'slot',
			label: 'Slot',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'partition',
			label: 'Partition',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'series',
			label: 'Series',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'maturityMs',
			label: 'Maturity',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'valueDecimals',
			label: 'Value decimals',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

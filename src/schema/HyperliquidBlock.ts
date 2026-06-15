import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/Network.ts'

export enum HyperliquidBlockSelector {
	Height = 'height',
	Hash = 'hash',
}

export default {
	entityType: EntityType.HyperliquidBlock,

	label: 'Hyperliquid Block',
	labelPlural: 'Hyperliquid Blocks',

	selectors: [
		{
			name: HyperliquidBlockSelector.Height,
			fields: [
				'$network',
				'height',
			],
		},
		{
			name: HyperliquidBlockSelector.Hash,
			fields: [
				'$network',
				'hash',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'height',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.HyperliquidTransaction,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

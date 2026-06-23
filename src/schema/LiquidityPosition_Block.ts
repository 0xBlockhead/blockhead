import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum LiquidityPosition_BlockSelector {
	PositionBlockNumberSource = '$position+blockNumber+source',
}
export default {
	entityType: EntityType.LiquidityPosition_Block,
	label: 'liquidity position block',
	labelPlural: 'liquidity position blocks',
	selectors: [
		{
			name: LiquidityPosition_BlockSelector.PositionBlockNumberSource,
			fields: [
				'$position',
				'blockNumber',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$position',
			label: 'position',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LiquidityPosition,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'blockNumber',
			label: 'Block number',
			description: 'The block height or number in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
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
			name: '$owner',
			label: 'owner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'liquidity',
			label: 'liquidity',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'token0Owed',
			label: 'token0 owed',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'token1Owed',
			label: 'token1 owed',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feeGrowthInside0LastX128',
			label: 'fee growth inside0 last x128',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'feeGrowthInside1LastX128',
			label: 'fee growth inside1 last x128',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum LiquidityPosition_BlockSelector {
	PositionBlockNumberSource = 'PositionBlockNumberSource',
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
				label: 'Position',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.LiquidityPosition,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'blockNumber',
				label: 'Block number',
				description: 'The block height or number in its network.',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
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
				name: '$owner',
				label: 'Owner',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'liquidity',
				label: 'Liquidity',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'token0Owed',
				label: 'Token0 owed',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'token1Owed',
				label: 'Token1 owed',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'feeGrowthInside0LastX128',
				label: 'Fee growth inside0 last X128',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'feeGrowthInside1LastX128',
				label: 'Fee growth inside1 last X128',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

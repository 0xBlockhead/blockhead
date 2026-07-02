// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum LiquidityPositionSelector {
	EvmNetworkId = 'EvmNetworkId',
}
export default {
	entityType: EntityType.LiquidityPosition,
	label: 'liquidity position',
	labelPlural: 'liquidity positions',
	selectors: [
		{
			name: LiquidityPositionSelector.EvmNetworkId,
			fields: [
				'$network',
				'id',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'id',
				label: 'ID',
				description: 'The identifier assigned by the source domain.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$pool',
				label: 'Pool',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.LiquidityPool,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'tickLower',
				label: 'Tick lower',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'tickUpper',
				label: 'Tick upper',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'tokenId',
				label: 'Token ID',
				description: 'The token identifier within its collection or contract.',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'origin',
				label: 'Origin',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'createdAtTimestamp',
				label: 'Created',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$blocks',
				label: 'Blocks',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.LiquidityPosition_Block,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

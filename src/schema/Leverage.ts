import { type } from 'arktype'

// Concentrated-liquidity LP position accounting (Uniswap v3 NonfungiblePositionManager-style).
// “Leverage” here is not CEX margin, borrow APR, or liquidation—see LeverageView copy.
// Requires an execution RPC or subgraph resolver; same field shape as LiquidityPosition.
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/EvmNetwork.ts'

export default {
	entityType: EntityType.Leverage,

	label: 'Leverage',
	labelPlural: 'Leverage',

	id: type({
		$network: Network.id,
		id: 'string',
	}),

	fields: [
		{
			name: '$pool',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LiquidityPool,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$owner',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Actor,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'tickLower',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'tickUpper',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'liquidity',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'token0Owed',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'token1Owed',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'tokenId',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'origin',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'createdAtTimestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

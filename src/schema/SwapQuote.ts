import { type } from 'arktype'

import { EvmAddress } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const swapRouteRow = type({
	poolId: 'string',
	tokenIn: EvmAddress,
	tokenOut: EvmAddress,
	fee: 'number',
})

export default {
	entityType: EntityType.SwapQuote,

	label: 'Swap Quote',
	labelPlural: 'Swap Quotes',

	id: type({
		id: 'string',
	}),

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$tokenIn',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$tokenOut',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'amountIn',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'amountOut',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'priceImpact',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'route',
			type: EntityFieldType.Primitive,
			primitiveType: swapRouteRow.array(),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'gasEstimate',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

const swapRouteRow = type({
	poolId: 'string',
	tokenIn: 'string.hex' as type.cast<`0x${string}`>,
	tokenOut: 'string.hex' as type.cast<`0x${string}`>,
	fee: 'number',
})

export default {
	entityType: EntityType.SwapQuote,

	label: 'Swap Quote',

	id: type({
		id: 'string',
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

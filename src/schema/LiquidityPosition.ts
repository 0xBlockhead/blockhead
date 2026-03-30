import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/Network.ts'

export default {
	entityType: EntityType.LiquidityPosition,

	label: 'Liquidity Position',

	id: type({
		$network: Network.id,
		id: 'string',
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

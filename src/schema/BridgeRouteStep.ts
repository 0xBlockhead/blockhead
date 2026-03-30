import { type } from 'arktype'
import BridgeRoute from '$/schema/BridgeRoute.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.BridgeRouteStep,

	label: 'Bridge Route Step',

	id: type({
		$route: BridgeRoute.id,
		index: 'number',
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

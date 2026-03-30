import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export enum BridgeRouteTag {
	Best = 'BEST',
	Cheapest = 'CHEAPEST',
	Fastest = 'FASTEST',
	Recommended = 'RECOMMENDED',
}

export default {
	entityType: EntityType.BridgeRoute,

	label: 'Bridge Route',

	id: type({
		id: 'string',
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

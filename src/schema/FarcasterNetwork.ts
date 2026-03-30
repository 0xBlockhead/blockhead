import { type } from 'arktype'
import { Source } from '$/api/$Sources.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.FarcasterNetwork,

	label: 'Farcaster Network',

	id: type({
		scope: type.unit('FarcasterNetwork'),
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

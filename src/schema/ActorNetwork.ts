import { type } from 'arktype'
import Actor from '$/schema/Actor.ts'
import type {
	EntityDefinition,
	EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.ActorNetwork,

	label: 'Network Actor',
	labelPlural: 'Network Actors',

	id: type({
		$actor: Actor.id,
	}),

	fields: [] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

import { type } from 'arktype'
import type { EntityDefinition, EntityFieldDefinition } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.BlockheadPanelTree,

	label: 'Panel Tree',

	id: type({
		id: 'string',
	}),

	fields: [] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition


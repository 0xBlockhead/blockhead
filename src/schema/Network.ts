import { type } from 'arktype'
import type { EntityDefinition, EntityFieldDefinition } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.Network,

	label: 'Network',

	id: type({
		chainId: 'number',
	}),

	fields: [] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition


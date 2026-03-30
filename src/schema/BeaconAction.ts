import { type } from 'arktype'
import type { EntityDefinition, EntityFieldDefinition } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/Network.ts'

export default {
	entityType: EntityType.BeaconAction,

	label: 'Beacon Action',

	id: type({
		$network: Network.id,
		slot: 'number',
		index: 'number',
	}),

	fields: [] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition


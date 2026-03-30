import { type } from 'arktype'
import type { EntityDefinition, EntityFieldDefinition } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/Network.ts'

export default {
	entityType: EntityType.BeaconValidator,

	label: 'Beacon Validator',

	id: type({
		$network: Network.id,
		validatorIndex: 'number',
	}),

	fields: [] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition


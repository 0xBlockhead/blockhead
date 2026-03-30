import { type } from 'arktype'
import type { EntityDefinition, EntityFieldDefinition } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/Network.ts'

export default {
	entityType: EntityType.Actor,

	label: 'Actor',

	id: type({
		$network: Network.id,
		address: 'string.hex' as type.cast<`0x${string}`>,
		'interopAddress?': 'string',
	}),

	fields: [] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition


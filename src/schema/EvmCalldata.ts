import { type } from 'arktype'
import {
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.EvmCalldata,

	label: 'EVM Calldata',
	labelPlural: 'EVM Calldata',

	id: type({
		hex: 'string.hex' as type.cast<`0x${string}`>,
	}),

	fields: [] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

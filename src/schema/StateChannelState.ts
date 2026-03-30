import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

const stateChannelAllocationRow = type({
	destination: 'string.hex' as type.cast<`0x${string}`>,
	token: 'string.hex' as type.cast<`0x${string}`>,
	amount: 'bigint',
})

export default {
	entityType: EntityType.StateChannelState,

	label: 'State Channel State',

	id: type({
		id: 'string',
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

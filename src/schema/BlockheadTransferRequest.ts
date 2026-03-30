import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/Network.ts'

const transferAllocationRow = type({
	destination: 'string.hex' as type.cast<`0x${string}`>,
	token: 'string.hex' as type.cast<`0x${string}`>,
	amount: 'bigint',
})

export default {
	entityType: EntityType.BlockheadTransferRequest,

	label: 'Blockhead Transfer Request',

	id: type({
		id: 'string',
		$network: Network.id,
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

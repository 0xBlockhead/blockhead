import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/Network.ts'

const evmLogRow = type({
	'address?': 'string.hex' as type.cast<`0x${string}`>,
	'topics?': type.string.array(),
	'data?': 'string',
	'blockNumber?': 'string | number',
	'transactionHash?': 'string.hex' as type.cast<`0x${string}`>,
	'logIndex?': 'string | number',
})

export default {
	entityType: EntityType.EvmTransaction,

	label: 'EVM Transaction',

	id: type({
		$network: Network.id,
		txHash: 'string.hex' as type.cast<`0x${string}`>,
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

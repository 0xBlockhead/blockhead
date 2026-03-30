import { type } from 'arktype'
import BlockheadWallet from '$/schema/BlockheadWallet.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export enum BlockheadConnectionStatus {
	Disconnected = 'disconnected',
	Connecting = 'connecting',
	Connected = 'connected',
	Error = 'error',
}

export default {
	entityType: EntityType.BlockheadWalletConnection,

	label: 'Blockhead Wallet Connection',

	id: type({
		$wallet: BlockheadWallet.id,
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

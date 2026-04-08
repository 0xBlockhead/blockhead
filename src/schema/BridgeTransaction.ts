import { type } from 'arktype'
import Actor from '$/schema/Actor.ts'
import type { EntityDefinition, EntityFieldDefinition } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import EvmTransaction from '$/schema/EvmTransaction.ts'

export default {
	entityType: EntityType.BridgeTransaction,

	label: 'Bridge Transaction',
	labelPlural: 'Bridge Transactions',

	id: type({
		$account: Actor.id,
		$sourceTx: EvmTransaction.id,
		createdAt: 'number',
	}),

	fields: [] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

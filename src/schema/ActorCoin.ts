import { type } from 'arktype'
import Actor from '$/schema/Actor.ts'
import CoinInstance from '$/schema/CoinInstance.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'

export default {
	entityType: EntityType.ActorCoin,

	label: 'Balance',

	id: type({
		$actor: Actor.id,
		$coinInstance: CoinInstance.id,
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

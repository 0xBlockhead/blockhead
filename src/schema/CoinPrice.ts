import { type } from 'arktype'
import Coin from '$/schema/Coin.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/Network.ts'

export default {
	entityType: EntityType.CoinPrice,

	label: 'Coin Price',

	id: type({
		$coin: Coin.id,
		'feedKey?': 'string',
		'$network?': Network.id,
	}),

	fields: [
		
	], as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

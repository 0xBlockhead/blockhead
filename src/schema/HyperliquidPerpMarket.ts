import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/Network.ts'

export default {
	entityType: EntityType.HyperliquidPerpMarket,

	label: 'Hyperliquid Perp Market',
	labelPlural: 'Hyperliquid Perp Markets',

	id: type({
		$network: Network.id,
		coin: 'string',
	}),

	fields: [
		{
			name: 'maxLeverage',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'onlyIsolated',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

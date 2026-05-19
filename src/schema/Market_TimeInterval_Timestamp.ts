import { type } from 'arktype'
import { MarketTimeIntervalUnit } from '$/constants/Market.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Market from '$/schema/Market.ts'

export default {
	entityType: EntityType.Market_TimeInterval_Timestamp,

	label: 'OHLC interval',
	labelPlural: 'OHLC intervals',

	id: type({
		$market: Market.id,
		timeInterval: type({
			unit: type.valueOf(MarketTimeIntervalUnit),
			value: 'number',
		}),
		timestampNs: 'bigint',
	}),

	fields: [
		{
			name: 'open',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'high',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'low',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'close',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

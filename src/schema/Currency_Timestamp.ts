import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import Currency from '$/schema/Currency.ts'

export default {
	entityType: EntityType.Currency_Timestamp,

	label: 'Currency snapshot',
	labelPlural: 'Currency snapshots',

	id: type({
		$currency: Currency.id,
		timestampMs: 'number',
	}),

	fields: [
		{
			name: 'marketCap',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [Source.Constants_Internal],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

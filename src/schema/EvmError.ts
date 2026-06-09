import { type } from 'arktype'

import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export default {
	entityType: EntityType.EvmError,

	label: 'EVM Error',
	labelPlural: 'EVM Errors',

	id: type({
		hex: ZeroExHex,
	}),

	fields: [
		{
			name: 'signatures',
			type: EntityFieldType.Primitive,
			primitiveType: type('string[]'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Openchain_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

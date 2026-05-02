import { type } from 'arktype'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

export default {
	entityType: EntityType.EvmSelector,

	label: 'EVM Selector',
	labelPlural: 'EVM Selectors',

	id: type({
		hex: 'string.hex' as type.cast<`0x${string}`>,
	}),

	fields: [
		{
			name: 'signatures',
			type: EntityFieldType.Primitive,
			primitiveType: type('string[]'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [Source.Openchain_Rest],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

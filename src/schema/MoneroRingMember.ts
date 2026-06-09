import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Ring from '$/schema/MoneroRing.ts'

export default {
	entityType: EntityType.MoneroRingMember,

	label: 'Monero Ring Member',
	labelPlural: 'Monero Ring Members',

	id: type({
		$ring: Ring.id,
		memberIndex: 'number',
	}),

	fields: [
		{
			name: 'globalOutputIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

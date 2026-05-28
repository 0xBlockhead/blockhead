import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import KeyImage from '$/schema/MoneroKeyImage.ts'

export default {
	entityType: EntityType.MoneroRing,

	label: 'Monero Ring',
	labelPlural: 'Monero Rings',

	id: type({
		$keyImage: KeyImage.id,
	}),

	fields: [
		{
			name: '$$members',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoneroRingMember,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

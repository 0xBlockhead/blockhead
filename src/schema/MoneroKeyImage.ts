import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Transaction from '$/schema/MoneroTransaction.ts'

export default {
	entityType: EntityType.MoneroKeyImage,

	label: 'Monero Key Image',
	labelPlural: 'Monero Key Images',

	id: type({
		$transaction: Transaction.id,
		inputIndex: 'number',
		keyImage: 'string',
	}),

	fields: [
		{
			name: '$ring',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.MoneroRing,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

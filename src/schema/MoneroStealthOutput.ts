import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Transaction from '$/schema/MoneroTransaction.ts'

export default {
	entityType: EntityType.MoneroStealthOutput,

	label: 'Monero Stealth Output',
	labelPlural: 'Monero Stealth Outputs',

	id: type({
		$transaction: Transaction.id,
		outputIndex: 'number',
	}),

	fields: [
		{
			name: 'publicKey',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

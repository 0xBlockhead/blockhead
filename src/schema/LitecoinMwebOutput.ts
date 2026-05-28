import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Transaction from '$/schema/LitecoinMwebTransaction.ts'

export default {
	entityType: EntityType.LitecoinMwebOutput,

	label: 'Litecoin MWEB Output',
	labelPlural: 'Litecoin MWEB Outputs',

	id: type({
		$transaction: Transaction.id,
		outputIndex: 'number',
	}),

	fields: [
		{
			name: 'commitment',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'senderPubkey',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

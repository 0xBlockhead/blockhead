import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Transaction from '$/schema/LitecoinMwebTransaction.ts'

export default {
	entityType: EntityType.LitecoinMwebPegOut,

	label: 'Litecoin MWEB Peg-out',
	labelPlural: 'Litecoin MWEB Peg-outs',

	id: type({
		$transaction: Transaction.id,
		pegOutIndex: 'number',
	}),

	fields: [
		{
			name: '$transparentOutput',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoOutput,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amountLitoshis',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

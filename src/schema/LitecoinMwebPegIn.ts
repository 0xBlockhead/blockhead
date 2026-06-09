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
	entityType: EntityType.LitecoinMwebPegIn,

	label: 'Litecoin MWEB Peg-in',
	labelPlural: 'Litecoin MWEB Peg-ins',

	id: type({
		$transaction: Transaction.id,
		pegInIndex: 'number',
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

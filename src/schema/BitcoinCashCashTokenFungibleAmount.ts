import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import UtxoOutput from '$/schema/UtxoOutput.ts'

export default {
	entityType: EntityType.BitcoinCashCashTokenFungibleAmount,

	label: 'Bitcoin Cash CashToken Fungible Amount',
	labelPlural: 'Bitcoin Cash CashToken Fungible Amounts',

	id: type({
		$output: UtxoOutput.id,
	}),

	fields: [
		{
			name: '$category',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BitcoinCashCashTokenCategory,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

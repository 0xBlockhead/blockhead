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
	entityType: EntityType.BitcoinCashCashTokenCommitment,

	label: 'Bitcoin Cash CashToken Commitment',
	labelPlural: 'Bitcoin Cash CashToken Commitments',

	id: type({
		$output: UtxoOutput.id,
	}),

	fields: [
		{
			name: 'commitmentHex',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

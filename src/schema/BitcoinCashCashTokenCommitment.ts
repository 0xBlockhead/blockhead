import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import UtxoOutput from '$/schema/UtxoOutput.ts'

export enum BitcoinCashCashTokenCommitmentSelector {
	UtxoOutput = 'utxoOutput',
}

export default {
	entityType: EntityType.BitcoinCashCashTokenCommitment,

	label: 'Bitcoin Cash CashToken Commitment',
	labelPlural: 'Bitcoin Cash CashToken Commitments',

	selectors: [
		{
			name: BitcoinCashCashTokenCommitmentSelector.UtxoOutput,
			fields: [
				'$output',
			],
		},
	],

	fields: [
		{
			name: '$output',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoOutput,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'commitmentHex',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

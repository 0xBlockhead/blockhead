// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum BitcoinCashCashTokenCommitmentSelector {
	UtxoOutput = 'UtxoOutput',
}
export default {
	entityType: EntityType.BitcoinCashCashTokenCommitment,
	label: 'Bitcoin Cash CashToken commitment',
	labelPlural: 'Bitcoin Cash CashToken commitments',
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
			label: 'Output',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoOutput,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'commitmentHex',
			label: 'Commitment hex',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.BitcoinCashNode_JsonRpc,
			],
		},
	],
} as const satisfies EntityDefinition

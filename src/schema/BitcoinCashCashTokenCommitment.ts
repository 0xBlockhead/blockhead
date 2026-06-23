import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BitcoinCashCashTokenCommitmentSelector {
	UtxoOutput = 'utxoOutput',
	Output = '$output',
}
export default {
	entityType: EntityType.BitcoinCashCashTokenCommitment,
	label: 'Bitcoin cash cash token commitment',
	labelPlural: 'Bitcoin cash cash token commitments',
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
			label: 'output',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.UtxoOutput,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'commitmentHex',
			label: 'commitment hex',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum BitcoinCashCashTokenCommitmentSelector {
	UtxoOutput = 'UtxoOutput',
}
export const BitcoinCashCashTokenCommitment = entity({
	entityType: EntityType.BitcoinCashCashTokenCommitment,
	labels: {
		singular: 'Bitcoin Cash CashToken commitment',
		plural: 'Bitcoin Cash CashToken commitments',
	},
})({
	$output: {
		label: 'Output',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.One,
	},
	commitmentHex: {
		label: 'Commitment hex',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.BitcoinCashNode_JsonRpc,
		],
	},
})({
	selectors: {
		UtxoOutput: [
			'$output',
		],
	},
})

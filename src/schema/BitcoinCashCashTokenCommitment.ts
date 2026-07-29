// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
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

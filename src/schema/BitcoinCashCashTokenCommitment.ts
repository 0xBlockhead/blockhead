// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
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
		entityType: EntityType.UtxoOutput,
		cardinality: EntityFieldCardinality.One,
	},
	commitmentHex: {
		label: 'Commitment hex',
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

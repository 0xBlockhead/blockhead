// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.EvmContractSourceBundle,
	labels: {
		singular: 'EVM contract source bundle',
		plural: 'EVM contract source bundles',
	},
})({
	$contract: {
		label: 'Contract',
		entityType: EntityType.EvmContract,
		cardinality: EntityFieldCardinality.One,
	},
	files: {
		label: 'Files',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
	},
})({
	selectors: {
		EvmContract: [
			'$contract',
		],
	},
})

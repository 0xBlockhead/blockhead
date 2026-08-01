// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ZcashShieldedPoolBlockState,
	labels: {
		singular: 'zcash shielded pool block state',
		plural: 'zcash shielded pool block states',
	},
})({
	$block: {
		label: 'block',
		entityType: EntityType.UtxoBlock,
		cardinality: EntityFieldCardinality.One,
	},
	$pool: {
		label: 'pool',
		entityType: EntityType.ZcashShieldedPool,
		cardinality: EntityFieldCardinality.One,
	},
	saplingTree: {
		label: 'Sapling tree',
		primitiveType: type({
			finalRoot: type('string'),
			finalState: type('string'),
		}),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	orchardTree: {
		label: 'Orchard tree',
		primitiveType: type({
			finalRoot: type('string'),
			finalState: type('string'),
		}),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		BlockPool: [
			'$block',
			'$pool',
		],
	},
})

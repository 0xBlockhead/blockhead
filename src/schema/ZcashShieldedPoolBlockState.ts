// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.EntityReference,
		entityType: EntityType.UtxoBlock,
		cardinality: EntityFieldCardinality.One,
	},
	$pool: {
		label: 'pool',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.ZcashShieldedPool,
		cardinality: EntityFieldCardinality.One,
	},
	saplingTree: {
		label: 'Sapling tree',
		type: EntityFieldType.Primitive,
		primitiveType: type({
			finalRoot: type('string'),
			finalState: type('string'),
		}),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	orchardTree: {
		label: 'Orchard tree',
		type: EntityFieldType.Primitive,
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

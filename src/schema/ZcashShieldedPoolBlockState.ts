// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPool.ts'
import { type } from 'arktype'

export enum ZcashShieldedPoolBlockStateSelector {
	BlockPool = 'BlockPool',
}
export const ZcashShieldedPoolBlockState = entity({
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
	pool: {
		label: 'pool',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(ZcashShieldedPoolKind)),
		cardinality: EntityFieldCardinality.One,
	},
	finalRoot: {
		label: 'final root',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blockCommitments: {
		label: 'block commitments',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		BlockPool: [
			'$block',
			'pool',
		],
	},
})

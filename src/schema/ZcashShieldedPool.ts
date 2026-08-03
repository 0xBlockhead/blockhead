// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPoolKind.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.ZcashShieldedPool,
	labels: {
		singular: 'Zcash shielded pool',
		plural: 'Zcash shielded pools',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	pool: {
		primitiveType: type.enumerated(...Object.values(ZcashShieldedPoolKind)),
		cardinality: EntityFieldCardinality.One,
	},
	activationNetworkUpgrade: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	noteProtocol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
})({
	selectors: {
		NetworkPool: [
			'$network',
			'pool',
		],
	},
})

// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	pool: {
		label: 'Pool',
		type: EntityFieldType.Primitive,
		primitiveType: type.enumerated(...Object.values(ZcashShieldedPoolKind)),
		cardinality: EntityFieldCardinality.One,
	},
	activationNetworkUpgrade: {
		label: 'Activation network upgrade',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Constants_Internal,
		],
	},
	noteProtocol: {
		label: 'Note protocol',
		type: EntityFieldType.Primitive,
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

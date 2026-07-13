// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZcashShieldedPoolKind {
	Sapling = 'sapling',
	Orchard = 'orchard',
}
export enum ZcashShieldedPoolSelector {
	NetworkPool = 'NetworkPool',
}
export const ZcashShieldedPool = entity({
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
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	noteProtocol: {
		label: 'Note protocol',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkPool: [
			'$network',
			'pool',
		],
	},
})

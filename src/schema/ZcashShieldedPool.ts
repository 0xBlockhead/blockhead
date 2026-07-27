// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum ZcashShieldedPoolKind {
	Sprout = 'sprout',
	Sapling = 'sapling',
	Orchard = 'orchard',
}

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

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum ZcashShieldedPoolKind {
	Sapling = 'sapling',
	Orchard = 'orchard',
}
export enum ZcashShieldedPoolSelector {
	NetworkPool = 'NetworkPool',
}
export default {
	entityType: EntityType.ZcashShieldedPool,
	label: 'Zcash shielded pool',
	labelPlural: 'Zcash shielded pools',
	selectors: [
		{
			name: ZcashShieldedPoolSelector.NetworkPool,
			fields: [
				'$network',
				'pool',
			],
		},
	],
	fields: [
		{
			name: '$network',
			label: 'Network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'pool',
			label: 'Pool',
			type: EntityFieldType.Primitive,
			primitiveType: type.enumerated(...Object.values(ZcashShieldedPoolKind)),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'activationNetworkUpgrade',
			label: 'Activation network upgrade',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'noteProtocol',
			label: 'Note protocol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

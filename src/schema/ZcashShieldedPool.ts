import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import Network from '$/schema/Network.ts'

export enum ZcashShieldedPoolSelector {
	NetworkPool = 'networkPool',
}


export enum ZcashShieldedPoolKind {
	Sapling = 'sapling',
	Orchard = 'orchard',
}

export default {
	entityType: EntityType.ZcashShieldedPool,

	label: 'Zcash Sapling/Orchard Pool',
	labelPlural: 'Zcash Sapling/Orchard Pools',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'pool',
			type: EntityFieldType.Primitive,
			primitiveType: type.valueOf(ZcashShieldedPoolKind),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'activationNetworkUpgrade',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'noteProtocol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

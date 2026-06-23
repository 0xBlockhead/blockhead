import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum ZcashShieldedPoolKind {
	Sapling = 'sapling',
	Orchard = 'orchard',
}
export enum ZcashShieldedPoolSelector {
	NetworkPool = 'networkPool',
}
export default {
	entityType: EntityType.ZcashShieldedPool,
	label: 'zcash shielded pool',
	labelPlural: 'zcash shielded pools',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'pool',
			label: 'pool',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'activationNetworkUpgrade',
			label: 'activation network upgrade',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'noteProtocol',
			label: 'note protocol',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

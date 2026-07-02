// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum PolkadotPalletSelector {
	NetworkPalletName = 'NetworkPalletName',
}
export default {
	entityType: EntityType.PolkadotPallet,
	label: 'Polkadot pallet',
	labelPlural: 'Polkadot pallets',
	selectors: [
		{
			name: PolkadotPalletSelector.NetworkPalletName,
			fields: [
				'$network',
				'palletName',
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
				name: 'palletName',
				label: 'Pallet name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'index',
				label: 'Index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

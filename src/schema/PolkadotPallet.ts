// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum PolkadotPalletSelector {
	NetworkPalletName = 'NetworkPalletName',
}
export const PolkadotPallet = entity({
	entityType: EntityType.PolkadotPallet,
	labels: {
		singular: 'Polkadot pallet',
		plural: 'Polkadot pallets',
	},
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	palletName: {
		label: 'Pallet name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	index: {
		label: 'Index',
		type: EntityFieldType.Primitive,
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NetworkPalletName: [
			'$network',
			'palletName',
		],
	},
})

import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum PolkadotPalletSelector {
	NetworkPalletName = 'networkPalletName',
}
export default {
	entityType: EntityType.PolkadotPallet,
	label: 'polkadot pallet',
	labelPlural: 'polkadot pallets',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Network,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'palletName',
			label: 'pallet name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'index',
			label: 'index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

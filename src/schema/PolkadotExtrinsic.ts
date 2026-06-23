import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum PolkadotExtrinsicSelector {
	PolkadotBlockExtrinsicIndex = 'polkadotBlockExtrinsicIndex',
	BlockExtrinsicIndex = '$block+extrinsicIndex',
}
export default {
	entityType: EntityType.PolkadotExtrinsic,
	label: 'polkadot extrinsic',
	labelPlural: 'polkadot extrinsics',
	selectors: [
		{
			name: PolkadotExtrinsicSelector.PolkadotBlockExtrinsicIndex,
			fields: [
				'$block',
				'extrinsicIndex',
			],
		},
	],
	fields: [
		{
			name: '$block',
			label: 'block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotBlock,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'extrinsicIndex',
			label: 'extrinsic index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			label: 'Hash',
			description: 'The hash that identifies this object in its protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$signer',
			label: 'signer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$pallet',
			label: 'pallet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotPallet,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'callName',
			label: 'call name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'success',
			label: 'success',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

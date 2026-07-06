// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum PolkadotExtrinsicSelector {
	BlockIndexInBlock = 'BlockIndexInBlock',
}
export default {
	entityType: EntityType.PolkadotExtrinsic,
	label: 'Polkadot extrinsic',
	labelPlural: 'Polkadot extrinsics',
	selectors: [
		{
			name: PolkadotExtrinsicSelector.BlockIndexInBlock,
			fields: [
				'$block',
				'indexInBlock',
			],
		},
	],
	fields: [
		{
			name: '$block',
			label: 'Block',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotBlock,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'indexInBlock',
			label: 'Index in block',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			label: 'Hash',
			description: 'The hash that identifies this object in its protocol.',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$signer',
			label: 'Signer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$pallet',
			label: 'Pallet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotPallet,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'callName',
			label: 'Call name',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'success',
			label: 'Success',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum PolkadotExtrinsicSelector {
	PolkadotBlockExtrinsicIndex = 'polkadotBlockExtrinsicIndex',
}

export default {
	entityType: EntityType.PolkadotExtrinsic,

	label: 'Polkadot Extrinsic',
	labelPlural: 'Polkadot Extrinsics',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotBlock,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'extrinsicIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$signer',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$pallet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotPallet,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'callName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'success',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

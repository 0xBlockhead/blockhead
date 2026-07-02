// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum PolkadotEventSelector {
	BlockIndexInBlock = 'BlockIndexInBlock',
}
export default {
	entityType: EntityType.PolkadotEvent,
	label: 'Polkadot event',
	labelPlural: 'Polkadot events',
	selectors: [
		{
			name: PolkadotEventSelector.BlockIndexInBlock,
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
				name: '$extrinsic',
				label: 'Extrinsic',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.PolkadotExtrinsic,
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
				name: 'eventName',
				label: 'Event name',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition

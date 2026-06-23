import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum PolkadotEventSelector {
	PolkadotBlockEventIndex = 'polkadotBlockEventIndex',
	BlockEventIndex = '$block+eventIndex',
}
export default {
	entityType: EntityType.PolkadotEvent,
	label: 'polkadot event',
	labelPlural: 'polkadot events',
	selectors: [
		{
			name: PolkadotEventSelector.PolkadotBlockEventIndex,
			fields: [
				'$block',
				'eventIndex',
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
			name: 'eventIndex',
			label: 'event index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$extrinsic',
			label: 'extrinsic',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotExtrinsic,
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
			name: 'eventName',
			label: 'event name',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition

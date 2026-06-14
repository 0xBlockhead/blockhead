import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

export enum PolkadotEventSelector {
	PolkadotBlockEventIndex = 'polkadotBlockEventIndex',
}

export default {
	entityType: EntityType.PolkadotEvent,

	label: 'Polkadot Event',
	labelPlural: 'Polkadot Events',

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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotBlock,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'eventIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$extrinsic',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotExtrinsic,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$pallet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.PolkadotPallet,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'eventName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

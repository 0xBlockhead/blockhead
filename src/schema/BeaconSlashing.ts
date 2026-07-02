// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BeaconSlashingSelector {
	EvmNetworkSlotKindIndexInSlot = 'EvmNetworkSlotKindIndexInSlot',
}
export default {
	entityType: EntityType.BeaconSlashing,
	label: 'beacon slashing',
	labelPlural: 'Beacon slashings',
	selectors: [
		{
			name: BeaconSlashingSelector.EvmNetworkSlotKindIndexInSlot,
			fields: [
				'$network',
				'slot',
				'kind',
				'indexInSlot',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'slot',
				label: 'Slot',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'kind',
				label: 'Kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'indexInSlot',
				label: 'Index in slot',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition

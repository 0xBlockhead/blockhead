// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BeaconCommitteeSelector {
	EvmNetworkSlotIndexInSlot = 'EvmNetworkSlotIndexInSlot',
}
export default {
	entityType: EntityType.BeaconCommittee,
	label: 'beacon committee',
	labelPlural: 'Beacon committees',
	selectors: [
		{
			name: BeaconCommitteeSelector.EvmNetworkSlotIndexInSlot,
			fields: [
				'$network',
				'slot',
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
				name: 'indexInSlot',
				label: 'Index in slot',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'validatorIndices',
				label: 'Validator indices',
				type: EntityFieldType.Primitive,
				primitiveType: type('number').array(),
				cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition

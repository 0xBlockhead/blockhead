// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BeaconAttestationSelector {
	EvmNetworkSlotIndexInSlot = 'EvmNetworkSlotIndexInSlot',
}
export default {
	entityType: EntityType.BeaconAttestation,
	label: 'beacon attestation',
	labelPlural: 'Beacon attestations',
	selectors: [
		{
			name: BeaconAttestationSelector.EvmNetworkSlotIndexInSlot,
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
				name: 'committeeIndex',
				label: 'Committee index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'aggregationBits',
				label: 'Aggregation bits',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

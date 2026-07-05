// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BeaconSlotSelector {
	EvmNetworkSlot = 'EvmNetworkSlot',
}
export default {
	entityType: EntityType.BeaconSlot,
	label: 'beacon slot',
	labelPlural: 'Beacon slots',
	selectors: [
		{
			name: BeaconSlotSelector.EvmNetworkSlot,
			fields: [
				'$network',
				'slot',
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
				name: 'epoch',
				label: 'Epoch',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$epoch',
				label: 'Epoch',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BeaconEpoch,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'proposerIndex',
				label: 'Proposer index',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'root',
				label: 'Root',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'parentRoot',
				label: 'Parent root',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'stateRoot',
				label: 'State root',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'bodyRoot',
				label: 'Body root',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'canonical',
				label: 'Canonical',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'signature',
				label: 'Signature',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$beaconCommittees',
				label: 'Beacon committees',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BeaconCommittee,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$beaconAttestations',
				label: 'Beacon attestations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BeaconAttestation,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$beaconWithdrawals',
				label: 'Beacon withdrawals',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BeaconWithdrawal,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$$beaconSlashings',
				label: 'Beacon slashings',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BeaconSlashing,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

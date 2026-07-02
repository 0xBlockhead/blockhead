// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BeaconEpochSelector {
	EvmNetworkEpoch = 'EvmNetworkEpoch',
}
export default {
	entityType: EntityType.BeaconEpoch,
	label: 'beacon epoch',
	labelPlural: 'Beacon epochs',
	selectors: [
		{
			name: BeaconEpochSelector.EvmNetworkEpoch,
			fields: [
				'$network',
				'epoch',
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
				name: 'epoch',
				label: 'Epoch',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'startSlot',
				label: 'Start slot',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'endSlot',
				label: 'End slot',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'slotCount',
				label: 'Slot count',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$$beaconSlots',
				label: 'Beacon slots',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BeaconSlot,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: 'finalized',
				label: 'Finalized',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'globalParticipationRate',
				label: 'Global participation rate',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'validatorsCount',
				label: 'Validators',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'attestationsCount',
				label: 'Attestations',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'attesterSlashingsCount',
				label: 'Attester slashings',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'proposerSlashingsCount',
				label: 'Proposer slashings',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'withdrawalsCount',
				label: 'Withdrawals',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

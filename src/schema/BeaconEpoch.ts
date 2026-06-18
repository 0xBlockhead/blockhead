import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	NonNegativeInteger,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum BeaconEpochSelector {
	EvmNetworkEpoch = 'evmNetworkEpoch',
}

export default {
	entityType: EntityType.BeaconEpoch,

	label: 'Beacon epoch',
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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'epoch',
			type: EntityFieldType.Primitive,
			primitiveType: NonNegativeInteger,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'startSlot',
			type: EntityFieldType.Primitive,
			primitiveType: NonNegativeInteger,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'endSlot',
			type: EntityFieldType.Primitive,
			primitiveType: NonNegativeInteger,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'slotCount',
			type: EntityFieldType.Primitive,
			primitiveType: NonNegativeInteger,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		// Intrinsic: slots are contained by exactly one epoch.
		{
			name: '$$beaconSlots',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconSlot,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'finalized',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.BeaconchaIn_Rest,
			],
		},
		{
			name: 'globalParticipationRate',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.BeaconchaIn_Rest,
			],
		},
		{
			name: 'validatorsCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.BeaconchaIn_Rest,
			],
		},
		{
			name: 'attestationsCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.BeaconchaIn_Rest,
			],
		},
		{
			name: 'attesterSlashingsCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.BeaconchaIn_Rest,
			],
		},
		{
			name: 'proposerSlashingsCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.BeaconchaIn_Rest,
			],
		},
		{
			name: 'withdrawalsCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.BeaconchaIn_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

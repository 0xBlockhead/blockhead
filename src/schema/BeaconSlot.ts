import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'

export enum BeaconSlotSelector {
	EvmNetworkSlot = 'evmNetworkSlot',
}

export default {
	entityType: EntityType.BeaconSlot,

	label: 'Beacon slot',
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
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'slot',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'proposerIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'root',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'parentRoot',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'stateRoot',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'bodyRoot',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'canonical',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: 'signature',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		// Intrinsic: committees and block body rows belong to this slot.
		{
			name: '$$beaconCommittees',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconCommittee,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: '$$beaconAttestations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconAttestation,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: '$$beaconWithdrawals',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconWithdrawal,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
		{
			name: '$$beaconSlashings',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconSlashing,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Beacon_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

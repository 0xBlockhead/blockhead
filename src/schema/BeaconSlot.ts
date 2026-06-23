import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BeaconSlotSelector {
	EvmNetworkSlot = 'evmNetworkSlot',
	NetworkSlot = '$network+slot',
}
export default {
	entityType: EntityType.BeaconSlot,
	label: 'beacon slot',
	labelPlural: 'beacon slots',
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
			label: 'network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'slot',
			label: 'slot',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'epoch',
			label: 'epoch',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'proposerIndex',
			label: 'proposer index',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'root',
			label: 'root',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'parentRoot',
			label: 'parent root',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'stateRoot',
			label: 'state root',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'bodyRoot',
			label: 'body root',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'canonical',
			label: 'canonical',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'signature',
			label: 'signature',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$beaconCommittees',
			label: 'beacon committees',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconCommittee,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$beaconAttestations',
			label: 'beacon attestations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconAttestation,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$beaconWithdrawals',
			label: 'beacon withdrawals',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconWithdrawal,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$beaconSlashings',
			label: 'beacon slashings',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.BeaconSlashing,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

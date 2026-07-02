// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BeaconValidatorSelector {
	NetworkIndexInNetwork = 'NetworkIndexInNetwork',
	NetworkPubkey = 'NetworkPubkey',
}
export default {
	entityType: EntityType.BeaconValidator,
	label: 'beacon validator',
	labelPlural: 'Beacon validators',
	selectors: [
		{
			name: BeaconValidatorSelector.NetworkIndexInNetwork,
			fields: [
				'$network',
				'indexInNetwork',
			],
		},
		{
			name: BeaconValidatorSelector.NetworkPubkey,
			fields: [
				'$network',
				'pubkey',
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
				name: 'indexInNetwork',
				label: 'Index in network',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'pubkey',
				label: 'Public key',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'balanceGwei',
				label: 'Balance',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'effectiveBalanceGwei',
				label: 'Effective balance',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'status',
				label: 'Status',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'slashed',
				label: 'Slashed',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'Timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BeaconValidator_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

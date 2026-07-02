// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum BeaconValidator_TimestampSelector {
	ValidatorSlotSource = 'ValidatorSlotSource',
}
export default {
	entityType: EntityType.BeaconValidator_Timestamp,
	label: 'beacon validator timestamp',
	labelPlural: 'Beacon validator observations',
	selectors: [
		{
			name: BeaconValidator_TimestampSelector.ValidatorSlotSource,
			fields: [
				'$validator',
				'slot',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$validator',
				label: 'Validator',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.BeaconValidator,
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
				name: 'source',
				label: 'Source',
				description: 'The source that produced this observation.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'timestampMs',
				label: 'Timestamp',
				description: 'The observation time in Unix milliseconds.',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
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
				name: 'activationEligibilityEpoch',
				label: 'Activation eligibility epoch',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'activationEpoch',
				label: 'Activation epoch',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'exitEpoch',
				label: 'Exit epoch',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'withdrawableEpoch',
				label: 'Withdrawable epoch',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'withdrawalCredentials',
				label: 'Withdrawal credentials',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'finalized',
				label: 'Finalized',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'executionOptimistic',
				label: 'Execution optimistic',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

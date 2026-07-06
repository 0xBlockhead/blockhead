// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IcpCanister_TimestampSelector {
	CanisterTimestampMsSource = 'CanisterTimestampMsSource',
}
export default {
	entityType: EntityType.IcpCanister_Timestamp,
	label: 'icp canister timestamp',
	labelPlural: 'icp canister observations',
	selectors: [
		{
			name: IcpCanister_TimestampSelector.CanisterTimestampMsSource,
			fields: [
				'$canister',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$canister',
			label: 'canister',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.IcpCanister,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
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
			name: '$subnet',
			label: 'subnet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.IcpSubnet,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'subnetId',
			label: 'subnet ID',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'canisterKind',
			label: 'canister kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'candidInterfaceHash',
			label: 'candid interface hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'moduleHash',
			label: 'module hash',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'controllers',
			label: 'controllers',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: 'cyclesBalance',
			label: 'cycles balance',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'memorySizeBytes',
			label: 'memory size bytes',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'freezingThresholdSeconds',
			label: 'freezing threshold seconds',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'idleCyclesBurnedPerDay',
			label: 'idle cycles burned per day',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'canisterVersion',
			label: 'canister version',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'reservedCycles',
			label: 'reserved cycles',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum IcpCanisterMethod_TimestampSelector {
	MethodTimestampMsSource = 'MethodTimestampMsSource',
}
export default {
	entityType: EntityType.IcpCanisterMethod_Timestamp,
	label: 'icp canister method timestamp',
	labelPlural: 'icp canister method observations',
	selectors: [
		{
			name: IcpCanisterMethod_TimestampSelector.MethodTimestampMsSource,
			fields: [
				'$method',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$method',
			label: 'method',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.IcpCanisterMethod,
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
			name: 'candidSignature',
			label: 'candid signature',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'certifiedResponseSupported',
			label: 'certified response supported',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'requestCount',
			label: 'request count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

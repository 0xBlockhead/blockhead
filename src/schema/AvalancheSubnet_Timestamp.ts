// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AvalancheSubnet_TimestampSelector {
	SubnetTimestampMsSource = 'SubnetTimestampMsSource',
}
export default {
	entityType: EntityType.AvalancheSubnet_Timestamp,
	label: 'avalanche subnet timestamp',
	labelPlural: 'avalanche subnet observations',
	selectors: [
		{
			name: AvalancheSubnet_TimestampSelector.SubnetTimestampMsSource,
			fields: [
				'$subnet',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$subnet',
			label: 'subnet',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AvalancheSubnet,
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
			name: 'validatorCount',
			label: 'validator count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'delegatorCount',
			label: 'delegator count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'totalStakeNavax',
			label: 'total stake navax',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'chainCount',
			label: 'chain count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'pendingValidatorCount',
			label: 'pending validator count',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

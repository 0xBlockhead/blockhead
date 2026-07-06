// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum NetworkUpgrade_TimestampSelector {
	UpgradeTimestampMsSource = 'UpgradeTimestampMsSource',
}
export default {
	entityType: EntityType.NetworkUpgrade_Timestamp,
	label: 'network upgrade observation',
	labelPlural: 'network upgrade observations',
	selectors: [
		{
			name: NetworkUpgrade_TimestampSelector.UpgradeTimestampMsSource,
			fields: [
				'$upgrade',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$upgrade',
			label: 'Upgrade',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NetworkUpgrade,
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
			name: 'status',
			label: 'Status',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activationHeight',
			label: 'Activation height',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activationTimestampMs',
			label: 'Activation timestamp',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

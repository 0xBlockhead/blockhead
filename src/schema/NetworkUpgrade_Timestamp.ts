import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum NetworkUpgrade_TimestampSelector {
	UpgradeTimestampMsSource = '$upgrade+timestampMs+source',
}
export default {
	entityType: EntityType.NetworkUpgrade_Timestamp,
	label: 'network upgrade timestamp',
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
			label: 'upgrade',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.NetworkUpgrade,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'timestampMs',
			label: 'Timestamp',
			description: 'The observation time in Unix milliseconds.',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'source',
			label: 'Source',
			description: 'The source that produced this observation.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activationHeight',
			label: 'activation height',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'activationTimestampMs',
			label: 'activation timestamp ms',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

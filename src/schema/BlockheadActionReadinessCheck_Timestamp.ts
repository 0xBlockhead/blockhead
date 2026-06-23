import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadActionReadinessCheck_TimestampSelector {
	ReadinessCheckTimestampMsSource = '$readinessCheck+timestampMs+source',
}
export default {
	entityType: EntityType.BlockheadActionReadinessCheck_Timestamp,
	label: 'blockhead action readiness check timestamp',
	labelPlural: 'blockhead action readiness check observations',
	selectors: [
		{
			name: BlockheadActionReadinessCheck_TimestampSelector.ReadinessCheckTimestampMsSource,
			fields: [
				'$readinessCheck',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$readinessCheck',
			label: 'readiness check',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadActionReadinessCheck,
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
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'observedAmount',
			label: 'observed amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'requiredAmount',
			label: 'required amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'deficitAmount',
			label: 'deficit amount',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'observedCapabilityStatus',
			label: 'observed capability status',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sourcePayloadHash',
			label: 'source payload hash',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'error',
			label: 'error',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

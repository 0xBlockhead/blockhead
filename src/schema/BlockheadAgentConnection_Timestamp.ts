import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadAgentConnection_TimestampSelector {
	ConnectionTimestampMsSource = '$connection+timestampMs+source',
}
export default {
	entityType: EntityType.BlockheadAgentConnection_Timestamp,
	label: 'blockhead agent connection timestamp',
	labelPlural: 'blockhead agent connection observations',
	selectors: [
		{
			name: BlockheadAgentConnection_TimestampSelector.ConnectionTimestampMsSource,
			fields: [
				'$connection',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$connection',
			label: 'connection',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadAgentConnection,
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
			name: 'health',
			label: 'health',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'latencyMs',
			label: 'latency ms',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'statusCode',
			label: 'status code',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
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

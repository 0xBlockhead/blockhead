import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum AvailAppId_TimestampSelector {
	AppIdTimestampMsSource = '$appId+timestampMs+source',
}
export default {
	entityType: EntityType.AvailAppId_Timestamp,
	label: 'avail app ID timestamp',
	labelPlural: 'avail app ID observations',
	selectors: [
		{
			name: AvailAppId_TimestampSelector.AppIdTimestampMsSource,
			fields: [
				'$appId',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$appId',
			label: 'app ID',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.AvailAppId,
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
			name: 'blockNumber',
			label: 'Block number',
			description: 'The block height or number in its network.',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'dataSubmissionCount',
			label: 'data submission count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sourceWindowSubmissionCount',
			label: 'source window submission count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

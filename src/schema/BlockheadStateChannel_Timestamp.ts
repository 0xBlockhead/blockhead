import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum BlockheadStateChannel_TimestampSelector {
	ChannelTimestampMsSource = '$channel+timestampMs+source',
}
export default {
	entityType: EntityType.BlockheadStateChannel_Timestamp,
	label: 'blockhead state channel timestamp',
	labelPlural: 'blockhead state channel observations',
	selectors: [
		{
			name: BlockheadStateChannel_TimestampSelector.ChannelTimestampMsSource,
			fields: [
				'$channel',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$channel',
			label: 'channel',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.BlockheadStateChannel,
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
			name: 'totalDeposited',
			label: 'total deposited',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'balance0',
			label: 'balance0',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'balance1',
			label: 'balance1',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'turnNum',
			label: 'turn num',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'status',
			label: 'status',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
	],
} as const satisfies EntityDefinition

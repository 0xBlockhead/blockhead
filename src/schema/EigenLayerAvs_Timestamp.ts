import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum EigenLayerAvs_TimestampSelector {
	AvsTimestampMsSource = '$avs+timestampMs+source',
}
export default {
	entityType: EntityType.EigenLayerAvs_Timestamp,
	label: 'eigen layer avs timestamp',
	labelPlural: 'eigen layer avs observations',
	selectors: [
		{
			name: EigenLayerAvs_TimestampSelector.AvsTimestampMsSource,
			fields: [
				'$avs',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$avs',
			label: 'avs',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EigenLayerAvs,
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
			name: 'operatorCount',
			label: 'operator count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'strategyCount',
			label: 'strategy count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'registrationStatus',
			label: 'registration status',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

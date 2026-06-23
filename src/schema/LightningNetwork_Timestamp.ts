import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum LightningNetwork_TimestampSelector {
	LightningNetworkTimestampMsSource = '$lightningNetwork+timestampMs+source',
}
export default {
	entityType: EntityType.LightningNetwork_Timestamp,
	label: 'Lightning network timestamp',
	labelPlural: 'Lightning network observations',
	selectors: [
		{
			name: LightningNetwork_TimestampSelector.LightningNetworkTimestampMsSource,
			fields: [
				'$lightningNetwork',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
			name: '$lightningNetwork',
			label: 'Lightning network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.LightningNetwork,
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
			name: 'nodeCount',
			label: 'node count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'channelCount',
			label: 'channel count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'totalCapacitySats',
			label: 'total capacity sats',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'torNodeCount',
			label: 'tor node count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'clearnetNodeCount',
			label: 'clearnet node count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'unannouncedNodeCount',
			label: 'unannounced node count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'averageCapacitySats',
			label: 'average capacity sats',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'medianCapacitySats',
			label: 'median capacity sats',
			type: EntityFieldType.Primitive,
			primitiveType: type("bigint"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'averageFeeRatePpm',
			label: 'average fee rate ppm',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'medianFeeRatePpm',
			label: 'median fee rate ppm',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

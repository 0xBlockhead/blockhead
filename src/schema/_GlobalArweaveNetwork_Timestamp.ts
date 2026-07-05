// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum _GlobalArweaveNetwork_TimestampSelector {
	HubTimestampMsSource = 'HubTimestampMsSource',
}
export default {
	entityType: EntityType._GlobalArweaveNetwork_Timestamp,
	label: 'global Arweave network timestamp',
	labelPlural: 'global Arweave network observations',
	selectors: [
		{
			name: _GlobalArweaveNetwork_TimestampSelector.HubTimestampMsSource,
			fields: [
				'$hub',
				'timestampMs',
				'source',
			],
		},
	],
	fields: [
		{
				name: '$hub',
				label: 'Hub',
				type: EntityFieldType.EntityReference,
				entityType: EntityType._GlobalArweaveNetwork,
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
				name: 'configuredAccessEndpointCount',
				label: 'Configured access endpoints',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'reachableAccessEndpointCount',
				label: 'Reachable access endpoints',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'sourceReportedLatestHeight',
				label: 'Source-reported latest height',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'sourceWindowBlockCount',
				label: 'Source-window blocks',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'sourceWindowTransactionCount',
				label: 'Source-window transactions',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'localCatalogExampleCount',
				label: 'Local catalog examples',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'reachable',
				label: 'Reachable',
				type: EntityFieldType.Primitive,
				primitiveType: type('boolean'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

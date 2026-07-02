// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum _GlobalSwarmAccess_TimestampSelector {
	HubTimestampMsSource = 'HubTimestampMsSource',
}
export default {
	entityType: EntityType._GlobalSwarmAccess_Timestamp,
	label: 'global Swarm access timestamp',
	labelPlural: 'global Swarm access observations',
	selectors: [
		{
			name: _GlobalSwarmAccess_TimestampSelector.HubTimestampMsSource,
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
				entityType: EntityType._GlobalSwarmAccess,
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
				name: 'sourceWindowResourceCount',
				label: 'Source window resources',
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

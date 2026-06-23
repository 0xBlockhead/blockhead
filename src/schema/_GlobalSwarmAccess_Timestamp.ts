import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum _GlobalSwarmAccess_TimestampSelector {
	HubTimestampMsSource = '$hub+timestampMs+source',
}
export default {
	entityType: EntityType._GlobalSwarmAccess_Timestamp,
	label: 'global swarm access timestamp',
	labelPlural: 'global swarm access observations',
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
			label: 'hub',
			type: EntityFieldType.EntityReference,
			entityType: EntityType._GlobalSwarmAccess,
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
			name: 'configuredAccessEndpointCount',
			label: 'configured access endpoint count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'reachableAccessEndpointCount',
			label: 'reachable access endpoint count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'sourceWindowResourceCount',
			label: 'source window resource count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'localCatalogExampleCount',
			label: 'local catalog example count',
			type: EntityFieldType.Primitive,
			primitiveType: type("number"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'reachable',
			label: 'reachable',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
	],
} as const satisfies EntityDefinition

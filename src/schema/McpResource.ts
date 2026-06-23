import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum McpResourceSelector {
	ServerUri = '$server+uri',
}
export default {
	entityType: EntityType.McpResource,
	label: 'mcp resource',
	labelPlural: 'mcp resources',
	selectors: [
		{
			name: McpResourceSelector.ServerUri,
			fields: [
				'$server',
				'uri',
			],
		},
	],
	fields: [
		{
			name: '$server',
			label: 'server',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.McpServer,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'uri',
			label: 'URI',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'name',
			label: 'Name',
			description: 'The human-readable name of the subject.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'title',
			label: 'title',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'description',
			label: 'Description',
			description: 'A human-readable description from the source domain.',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'mimeType',
			label: 'mime type',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'annotations',
			label: 'annotations',
			type: EntityFieldType.Primitive,
			primitiveType: type("unknown"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'subscribed',
			label: 'subscribed',
			type: EntityFieldType.Primitive,
			primitiveType: type("boolean"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$contentTimestamps',
			label: 'content timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.McpResourceContent_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

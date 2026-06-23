import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
export enum McpResourceTemplateSelector {
	ServerUriTemplate = '$server+uriTemplate',
}
export default {
	entityType: EntityType.McpResourceTemplate,
	label: 'mcp resource template',
	labelPlural: 'mcp resource templates',
	selectors: [
		{
			name: McpResourceTemplateSelector.ServerUriTemplate,
			fields: [
				'$server',
				'uriTemplate',
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
			name: 'uriTemplate',
			label: 'URI template',
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
	],
} as const satisfies EntityDefinition

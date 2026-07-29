// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.McpResourceTemplate,
	labels: {
		singular: 'mcp resource template',
		plural: 'mcp resource templates',
	},
})({
	$server: {
		label: 'server',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.McpServer,
		cardinality: EntityFieldCardinality.One,
	},
	uriTemplate: {
		label: 'URI template',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	title: {
		label: 'title',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mimeType: {
		label: 'mime type',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	annotations: {
		label: 'annotations',
		type: EntityFieldType.Primitive,
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ServerUriTemplate: [
			'$server',
			'uriTemplate',
		],
	},
})

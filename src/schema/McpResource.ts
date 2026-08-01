// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.McpResource,
	labels: {
		singular: 'mcp resource',
		plural: 'mcp resources',
	},
})({
	$server: {
		label: 'server',
		entityType: EntityType.McpServer,
		cardinality: EntityFieldCardinality.One,
	},
	uri: {
		label: 'URI',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		description: 'The human-readable name of the subject.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	title: {
		label: 'title',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		description: 'A human-readable description from the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mimeType: {
		label: 'mime type',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	annotations: {
		label: 'annotations',
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	subscribed: {
		label: 'subscribed',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$contentTimestamps: {
		label: 'content timestamps',
		entityType: EntityType.McpResourceContent_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		ServerUri: [
			'$server',
			'uri',
		],
	},
})

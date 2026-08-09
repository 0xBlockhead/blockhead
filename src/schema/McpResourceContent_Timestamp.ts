// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.McpResourceContent_Timestamp,
	labels: {
		singular: 'mcp resource content timestamp',
		plural: 'mcp resource content observations',
	},
})({
	$resource: {
		entityType: EntityType.McpResource,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	contentKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	text: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blobHashAlgorithm: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	blobHash: {
		primitiveType: ZeroExHex,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	uri: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	mimeType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	size: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	annotations: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	error: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ResourceTimestampMsSource: [
			'$resource',
			'timestampMs',
			'source',
		],
	},
})

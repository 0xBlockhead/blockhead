// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { MediaTransport } from '$/schema/MediaTransport.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.Media,
	labels: {
		singular: 'Media',
		plural: 'media',
	},
})({
	url: {
		label: 'URL',
		description: 'The URL for the source-domain resource.',
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	type: {
		label: 'Type',
		description: 'The source-domain type or category.',
		primitiveType: type.enumerated(...Object.values(MediaType)),
		cardinality: EntityFieldCardinality.One,
	},
	transport: {
		label: 'Transport',
		primitiveType: type.enumerated(...Object.values(MediaTransport)),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
		label: 'Hash',
		description: 'The hash that identifies this object in its protocol.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		Url: [
			'url',
		],
	},
})

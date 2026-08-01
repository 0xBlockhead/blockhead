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
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	type: {
		primitiveType: type.enumerated(...Object.values(MediaType)),
		cardinality: EntityFieldCardinality.One,
	},
	transport: {
		primitiveType: type.enumerated(...Object.values(MediaTransport)),
		cardinality: EntityFieldCardinality.One,
	},
	hash: {
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

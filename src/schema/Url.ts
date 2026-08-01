// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'

export default entity({
	entityType: EntityType.Url,
	labels: {
		singular: 'URL',
		plural: 'URLs',
	},
	description: 'A web URL that is modeled as a referenced resource rather than an inline string.',
})({
	url: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	$$previewTimestamps: {
		entityType: EntityType.UrlPreview_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		Url: [
			'url',
		],
	},
})

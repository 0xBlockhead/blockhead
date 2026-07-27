// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.YoutubeNetwork,
	labels: {
		singular: 'YouTube Data API',
		plural: 'YouTube Data API',
	},
})({
	scope: {
		label: 'Scope',
		description: 'The fixed scope value that identifies this compatibility protocol row.',
		type: EntityFieldType.Primitive,
		primitiveType: type.unit('YoutubeNetwork'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		label: 'Protocol',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	homeUrl: {
		label: 'Home',
		type: EntityFieldType.Primitive,
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	docsUrl: {
		label: 'Documentation',
		type: EntityFieldType.Primitive,
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})

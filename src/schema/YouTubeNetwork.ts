// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export enum YoutubeNetworkSelector {
	Scope = 'Scope',
}
export const YoutubeNetwork = entity({
	entityType: EntityType.YoutubeNetwork,
	label: 'YouTube Data API',
	labelPlural: 'YouTube Data API',
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
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.One,
	},
	docsUrl: {
		label: 'Documentation',
		type: EntityFieldType.Primitive,
		primitiveType: (UrlString),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.GitForgeReleaseLink,
	labels: {
		singular: 'Git forge release link',
		plural: 'Git forge release links',
	},
})({
	$release: {
		entityType: EntityType.GitForgeRelease,
		cardinality: EntityFieldCardinality.One,
	},
	linkId: {
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	url: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.One,
	},
	linkType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	directAssetUrl: {
		primitiveType: UrlString,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		ReleaseLinkId: [
			'$release',
			'linkId',
		],
	},
})

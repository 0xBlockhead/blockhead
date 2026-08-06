// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XNetwork,
	labels: {
		singular: 'X',
		plural: 'X',
	},
	description: 'X profiles and posts surfaced through declared public HTTP sources.',
})({
	scope: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	homeUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	docsUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registryName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	relationshipModel: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$xUsers: {
		entityType: EntityType.XUser,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.X_Rest,
			Source.X_FxEmbed_Rest,
		],
	},
	$$xPosts: {
		entityType: EntityType.XPost,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.X_Rest,
			Source.X_FxEmbed_Rest,
		],
	},
})({
	selectors: {
		Scope: [
			'scope',
		],
	},
})

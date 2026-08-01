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
		label: 'Scope',
		description: 'The fixed scope value that identifies this hub row.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		label: 'Protocol',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	homeUrl: {
		label: 'Home URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	docsUrl: {
		label: 'Docs URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registryName: {
		label: 'Registry name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	relationshipModel: {
		label: 'Connection model',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$xUsers: {
		label: 'Users',
		entityType: EntityType.XUser,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.X_FxEmbed_Rest,
		],
	},
	$$xPosts: {
		label: 'Posts',
		entityType: EntityType.XPost,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
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

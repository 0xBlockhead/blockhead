// Generated from APP.ts. Do not edit by hand.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityFieldType } from '$/schema/EntityFieldType.ts'
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
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	protocolName: {
		label: 'Protocol',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	homeUrl: {
		label: 'Home URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	docsUrl: {
		label: 'Docs URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	registryName: {
		label: 'Registry name',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	relationshipModel: {
		label: 'Connection model',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$xUsers: {
		label: 'Users',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.XUser,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.X_FxEmbed_Rest,
		],
	},
	$$xPosts: {
		label: 'Posts',
		type: EntityFieldType.EntitiesReference,
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

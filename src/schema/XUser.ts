// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const xRestXFxEmbedRestSources = [
	Source.X_Rest,
	Source.X_FxEmbed_Rest,
] as const

export default entity({
	entityType: EntityType.XUser,
	labels: {
		singular: 'X user',
		plural: 'X users',
	},
})({
	id: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	username: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verified: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	location: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	websiteUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$profileBanner: {
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		entityType: EntityType.XUser_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: xRestXFxEmbedRestSources,
	},
	$$posts: {
		entityType: EntityType.XPost,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: xRestXFxEmbedRestSources,
	},
})({
	selectors: {
		Id: [
			'id',
		],
		Username: [
			'username',
		],
	},
})

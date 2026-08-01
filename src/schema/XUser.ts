// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.XUser,
	labels: {
		singular: 'X user',
		plural: 'X users',
	},
})({
	id: {
		label: 'ID',
		description: 'The identifier assigned by the source domain.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	username: {
		label: 'Username',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		label: 'Name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	verified: {
		label: 'Verified',
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	createdAt: {
		label: 'Created',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	location: {
		label: 'Location',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	websiteUrl: {
		label: 'Website URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		label: 'Icon',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$profileBanner: {
		label: 'Profile banner',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Observations',
		entityType: EntityType.XUser_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.X_Rest,
			Source.X_FxEmbed_Rest,
		],
	},
	$$posts: {
		label: 'Posts',
		entityType: EntityType.XPost,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.X_Rest,
			Source.X_FxEmbed_Rest,
		],
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

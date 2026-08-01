// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.AtprotoActor_Timestamp,
	labels: {
		singular: 'AT Protocol account observation',
		plural: 'AT Protocol account observations',
	},
})({
	$actor: {
		label: 'Account',
		entityType: EntityType.AtprotoActor,
		cardinality: EntityFieldCardinality.One,
	},
	timestampMs: {
		label: 'Timestamp',
		description: 'The observation time in Unix milliseconds.',
		primitiveType: type('number.integer >= 0'),
		cardinality: EntityFieldCardinality.One,
	},
	source: {
		label: 'Source',
		description: 'The appview source that produced this immutable profile observation.',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	handle: {
		label: 'Observed handle',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	displayName: {
		label: 'Display name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	description: {
		label: 'Description',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	indexedAt: {
		label: 'Indexed',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$icon: {
		label: 'Avatar',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$banner: {
		label: 'Banner',
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	followersCount: {
		label: 'Followers',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	followsCount: {
		label: 'Following',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	postsCount: {
		label: 'Posts',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		AtprotoActorTimestampMsSource: [
			'$actor',
			'timestampMs',
			'source',
		],
	},
})

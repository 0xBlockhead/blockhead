// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SnapshotSpace,
	labels: {
		singular: 'Snapshot space',
		plural: 'Snapshot spaces',
	},
	description: 'A Snapshot Hub space (DAO) identified by its Hub space id (often an ENS name).',
})({
	spaceId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	name: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	about: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	avatar: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	$avatar: {
		entityType: EntityType.Media,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	symbol: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	proposalsCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	votesCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	followersCount: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	createdAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	$$proposals: {
		entityType: EntityType.SnapshotProposal,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
})({
	selectors: {
		SpaceId: [
			'spaceId',
		],
	},
})

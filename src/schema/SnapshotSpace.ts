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
	cover: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	website: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	twitter: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	github: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	farcaster: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	coingecko: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	discussions: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	terms: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	location: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	domain: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	private: {
		primitiveType: type('boolean'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	strategies: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	categories: {
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	delegationType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	delegationContract: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	delegationNetwork: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	delegationApi: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	treasuries: {
		primitiveType: type('unknown'),
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
	$$admins: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	$$members: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	$$moderators: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.Many,
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

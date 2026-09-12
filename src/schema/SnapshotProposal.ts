// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SnapshotProposal,
	labels: {
		singular: 'Snapshot proposal',
		plural: 'Snapshot proposals',
	},
	description: 'An off-chain Snapshot Hub proposal identified by its Hub proposal id.',
})({
	proposalId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$space: {
		entityType: EntityType.SnapshotSpace,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	$authorAccount: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	author: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	ipfs: {
		primitiveType: type('string'),
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
	strategies: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	title: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	body: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	discussion: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	type: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	state: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	choices: {
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	labels: {
		primitiveType: type('string').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	startAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	endAtMs: {
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
	updatedAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	quorum: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	quorumType: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	privacy: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	snapshotBlock: {
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
	scores: {
		primitiveType: type('number').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	scoresByStrategy: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	scoresState: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	scoresTotal: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	scoresTotalValue: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	scoresUpdatedAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	link: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	app: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	$$votes: {
		entityType: EntityType.SnapshotVote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
})({
	selectors: {
		ProposalId: [
			'proposalId',
		],
	},
})

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.SnapshotVote,
	labels: {
		singular: 'Snapshot vote',
		plural: 'Snapshot votes',
	},
	description: 'An off-chain Snapshot Hub vote identified by its Hub vote id.',
})({
	voteId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	ipfs: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	$space: {
		entityType: EntityType.SnapshotSpace,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	$proposal: {
		entityType: EntityType.SnapshotProposal,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	voter: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	choice: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	reason: {
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
	votingPower: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	votingPowerByStrategy: {
		primitiveType: type('number').array(),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	votingPowerState: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	votingPowerValue: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	metadata: {
		primitiveType: type('unknown'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
	createdAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.SnapshotHub_Graphql,
		],
	},
})({
	selectors: {
		VoteId: [
			'voteId',
		],
	},
})

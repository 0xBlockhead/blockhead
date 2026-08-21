// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.TallyProposal,
	labels: {
		singular: 'Tally proposal',
		plural: 'Tally proposals',
	},
	description: 'An onchain governance proposal indexed by Tally.',
})({
	proposalId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	onchainId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Tally,
		],
	},
	status: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Tally,
		],
	},
	$governor: {
		entityType: EntityType.TallyGovernor,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Tally,
		],
	},
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
		defaultSources: [
			Source.Tally,
		],
	},
	$proposer: {
		entityType: EntityType.EvmNetworkAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Tally,
		],
	},
	title: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Tally,
		],
	},
	description: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Tally,
		],
	},
	organizationName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Tally,
		],
	},
	quorum: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Tally,
		],
	},
	voteStats: {
		primitiveType: type({
			type: type('string'),
			votesCount: type('string'),
			votersCount: type('number'),
			percent: type('number'),
		}),
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Tally,
		],
	},
	startAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Tally,
		],
	},
	endAtMs: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Tally,
		],
	},
	discourseUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Tally,
		],
	},
	snapshotUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Tally,
		],
	},
	$$executableCalls: {
		entityType: EntityType.TallyProposalExecutableCall,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Tally,
		],
	},
})({
	selectors: {
		ProposalId: [
			'proposalId',
		],
	},
})

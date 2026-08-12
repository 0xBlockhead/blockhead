// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadAlgorandParticipationKey,
	labels: {
		singular: 'blockhead algorand participation key',
		plural: 'blockhead algorand participation keys',
	},
})({
	nodeId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	participationId: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$account: {
		entityType: EntityType.AlgorandAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
	$network: {
		entityType: EntityType.AlgorandNetwork,
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
	firstValidRound: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
	lastValidRound: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
	keyDilution: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
	selectionKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
	votingKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
	stateProofKey: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
	effectiveFirstRound: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
	effectiveLastRound: {
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Nodely,
		],
	},
	lastSyncedAt: {
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		NodeIdParticipationId: [
			'nodeId',
			'participationId',
		],
	},
})

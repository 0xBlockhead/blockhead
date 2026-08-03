// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

const blockfrostRestSources = [
	Source.Blockfrost_Rest,
] as const

export default entity({
	entityType: EntityType.CardanoDRep,
	labels: {
		singular: 'cardano d rep',
		plural: 'cardano d reps',
	},
})({
	$network: {
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	drepCredential: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	credentialKind: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestSources,
	},
	displayName: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestSources,
	},
	anchorUrl: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestSources,
	},
	anchorHash: {
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: blockfrostRestSources,
	},
	$$timestamps: {
		entityType: EntityType.CardanoDRep_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$votes: {
		entityType: EntityType.CardanoGovernanceVote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: blockfrostRestSources,
	},
})({
	selectors: {
		NetworkDrepCredential: [
			'$network',
			'drepCredential',
		],
	},
})

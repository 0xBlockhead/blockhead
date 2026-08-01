// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.CardanoDRep,
	labels: {
		singular: 'cardano d rep',
		plural: 'cardano d reps',
	},
})({
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	drepCredential: {
		label: 'drep credential',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	credentialKind: {
		label: 'credential kind',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	displayName: {
		label: 'display name',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	anchorUrl: {
		label: 'anchor URL',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	anchorHash: {
		label: 'anchor hash',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	$$timestamps: {
		label: 'timestamps',
		entityType: EntityType.CardanoDRep_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$votes: {
		label: 'votes',
		entityType: EntityType.CardanoGovernanceVote,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
})({
	selectors: {
		NetworkDrepCredential: [
			'$network',
			'drepCredential',
		],
	},
})

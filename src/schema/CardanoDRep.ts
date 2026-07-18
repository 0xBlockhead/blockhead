// Generated from APP.ts. Do not edit by hand.

import { entity, facet } from '$/schema/$schema.ts'
import { EntityFieldCardinality, EntityFieldType } from '$/schema/EntityField.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum CardanoDRepSelector {
	NetworkDrepCredential = 'NetworkDrepCredential',
}
export const CardanoDRep = entity({
	entityType: EntityType.CardanoDRep,
	labels: {
		singular: 'cardano d rep',
		plural: 'cardano d reps',
	},
})({
	$network: {
		label: 'network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	drepCredential: {
		label: 'drep credential',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	credentialKind: {
		label: 'credential kind',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	anchorUrl: {
		label: 'anchor URL',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	anchorHash: {
		label: 'anchor hash',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoDRep_Timestamp,
		cardinality: EntityFieldCardinality.Many,
		defaultSources: [
			Source.Blockfrost_Rest,
		],
	},
	$$votes: {
		label: 'votes',
		type: EntityFieldType.EntitiesReference,
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

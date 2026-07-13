// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
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
		entityType: EntityType.CardanoNetwork,
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
	},
	$$timestamps: {
		label: 'timestamps',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoDRep_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
	$$votes: {
		label: 'votes',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.CardanoGovernanceVote,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkDrepCredential: [
			'$network',
			'drepCredential',
		],
	},
})

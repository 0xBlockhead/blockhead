// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CardanoDRepSelector {
	NetworkDrepCredential = 'NetworkDrepCredential',
}
export default {
	entityType: EntityType.CardanoDRep,
	label: 'cardano d rep',
	labelPlural: 'cardano d reps',
	selectors: [
		{
			name: CardanoDRepSelector.NetworkDrepCredential,
			fields: [
				'$network',
				'drepCredential',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CardanoNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'drepCredential',
				label: 'drep credential',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'credentialKind',
				label: 'credential kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CardanoDRep_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$votes',
				label: 'votes',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CardanoGovernanceVote,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

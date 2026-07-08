// Generated from APP.ts. Do not edit by hand.

import { entity, EntityFieldCardinality, EntityFieldType, facet } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum PolkadotReferendumSelector {
	NetworkReferendumId = 'NetworkReferendumId',
}
export const PolkadotReferendum = entity({
	entityType: EntityType.PolkadotReferendum,
	label: 'Polkadot referendum',
	labelPlural: 'Polkadot referendums',
})({
	$network: {
		label: 'Network',
		type: EntityFieldType.EntityReference,
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.One,
	},
	referendumId: {
		label: 'Referendum ID',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	track: {
		label: 'Track',
		type: EntityFieldType.Primitive,
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	submittedAtBlockNumber: {
		label: 'Submitted at block number',
		type: EntityFieldType.Primitive,
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$$timestamps: {
		label: 'Lifecycle observations',
		type: EntityFieldType.EntitiesReference,
		entityType: EntityType.PolkadotReferendum_Timestamp,
		cardinality: EntityFieldCardinality.Many,
	},
})({
	selectors: {
		NetworkReferendumId: [
			'$network',
			'referendumId',
		],
	},
})

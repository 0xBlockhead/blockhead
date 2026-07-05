// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum PolkadotReferendumSelector {
	NetworkReferendumId = 'NetworkReferendumId',
}
export default {
	entityType: EntityType.PolkadotReferendum,
	label: 'Polkadot referendum',
	labelPlural: 'Polkadot referendums',
	selectors: [
		{
			name: PolkadotReferendumSelector.NetworkReferendumId,
			fields: [
				'$network',
				'referendumId',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'Network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'referendumId',
				label: 'Referendum ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'track',
				label: 'Track',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'submittedAtBlockNumber',
				label: 'Submitted at block number',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$timestamps',
				label: 'Lifecycle observations',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.PolkadotReferendum_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

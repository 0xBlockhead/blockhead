// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosBakerSelector {
	NetworkAddress = 'NetworkAddress',
}
export default {
	entityType: EntityType.TezosBaker,
	label: 'tezos baker',
	labelPlural: 'tezos bakers',
	selectors: [
		{
			name: TezosBakerSelector.NetworkAddress,
			fields: [
				'$network',
				'address',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TezosNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'address',
				label: 'Address',
				description: 'The address or account identifier used by the source protocol.',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$account',
				label: 'account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.TezosAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$cycleTimestamps',
				label: 'cycle timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.TezosBaker_Cycle_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.TezosBaker_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

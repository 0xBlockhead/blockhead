// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum TezosAccountSelector {
	NetworkAddress = 'NetworkAddress',
}
export default {
	entityType: EntityType.TezosAccount,
	label: 'tezos account',
	labelPlural: 'tezos accounts',
	selectors: [
		{
			name: TezosAccountSelector.NetworkAddress,
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
			name: 'accountKind',
			label: 'account kind',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$$operations',
			label: 'operations',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosOperation,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$tokenBalanceTimestamps',
			label: 'token balance timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosTokenBalance_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$tokenTransfers',
			label: 'token transfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosTokenTransfer,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.TezosAccount_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

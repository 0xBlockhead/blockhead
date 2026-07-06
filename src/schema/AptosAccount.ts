// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AptosAccountSelector {
	NetworkAddress = 'NetworkAddress',
}
export default {
	entityType: EntityType.AptosAccount,
	label: 'aptos account',
	labelPlural: 'aptos accounts',
	selectors: [
		{
			name: AptosAccountSelector.NetworkAddress,
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
			entityType: EntityType.AptosNetwork,
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
			name: '$$timestamps',
			label: 'timestamps',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AptosAccount_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$balances',
			label: 'balances',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AptosCoinBalance_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$resources',
			label: 'resources',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AptosAccountResource,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$modules',
			label: 'modules',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.MoveModule,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.AptosTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

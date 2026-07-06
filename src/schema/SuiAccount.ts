// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum SuiAccountSelector {
	NetworkAddress = 'NetworkAddress',
}
export default {
	entityType: EntityType.SuiAccount,
	label: 'sui account',
	labelPlural: 'sui accounts',
	selectors: [
		{
			name: SuiAccountSelector.NetworkAddress,
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
			entityType: EntityType.SuiNetwork,
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
			name: '$balances',
			label: 'balances',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SuiCoinBalance_Timestamp,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$objects',
			label: 'objects',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SuiObject,
			cardinality: EntityFieldCardinality.Many,
		},
		{
			name: '$transactions',
			label: 'transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.SuiTransaction,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

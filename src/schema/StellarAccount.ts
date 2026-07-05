// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum StellarAccountSelector {
	NetworkAccountId = 'NetworkAccountId',
}
export default {
	entityType: EntityType.StellarAccount,
	label: 'stellar account',
	labelPlural: 'stellar accounts',
	selectors: [
		{
			name: StellarAccountSelector.NetworkAccountId,
			fields: [
				'$network',
				'accountId',
			],
		},
	],
	fields: [
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.StellarNetwork,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'accountId',
				label: 'account ID',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$trustlines',
				label: 'trustlines',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.StellarTrustline,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$offers',
				label: 'offers',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.StellarOffer,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$trades',
				label: 'trades',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.StellarTrade,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$transactions',
				label: 'transactions',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.StellarTransaction,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$signers',
				label: 'signers',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.StellarAccountSigner,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.StellarAccount_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

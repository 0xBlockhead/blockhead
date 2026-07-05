// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum CardanoAddressSelector {
	NetworkAddress = 'NetworkAddress',
}
export default {
	entityType: EntityType.CardanoAddress,
	label: 'cardano address',
	labelPlural: 'cardano addresses',
	selectors: [
		{
			name: CardanoAddressSelector.NetworkAddress,
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
				entityType: EntityType.CardanoNetwork,
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
				name: 'addressKind',
				label: 'address kind',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'paymentCredential',
				label: 'payment credential',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'stakeCredential',
				label: 'stake credential',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$stakeCredential',
				label: 'stake credential',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.CardanoStakeCredential,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$utxos',
				label: 'utxos',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CardanoTxOutput,
				cardinality: EntityFieldCardinality.Many,
		},
		{
				name: '$timestamps',
				label: 'timestamps',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.CardanoAddress_Timestamp,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

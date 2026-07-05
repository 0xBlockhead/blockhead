// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { type } from 'arktype'

export enum AccountSelector {
	Caip10 = 'Caip10',
}
export default {
	entityType: EntityType.Account,
	label: 'account',
	labelPlural: 'accounts',
	description: 'A cross-chain account identity expressed with CAIP namespace, reference, and address fields.',
	selectors: [
		{
			name: AccountSelector.Caip10,
			fields: [
				'caip10',
			],
		},
	],
	fields: [
		{
				name: 'caip10',
				label: 'CAIP-10',
				description: 'The account identifier in CAIP-10 namespace, reference, and address form.',
				type: EntityFieldType.Primitive,
				primitiveType: type({ 'namespace': type('string'), 'reference': type('string'), 'accountAddress': type('string') }),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$network',
				label: 'network',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Network,
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
				name: 'canonicalAddress',
				label: 'canonical address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$evmAccount',
				label: 'EVM account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$evmNetworkAccount',
				label: 'EVM network account',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmNetworkAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'nativeAccountSelector',
				label: 'native account selector',
				type: EntityFieldType.Primitive,
				primitiveType: type('unknown'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$walletAccounts',
				label: 'wallet accounts',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.BlockheadWalletAccount,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

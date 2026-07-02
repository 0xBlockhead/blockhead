// Generated from APP.ts. Do not edit by hand.

import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export enum EvmAccountSelector {
	Address = 'Address',
	AddressInteropAddress = 'AddressInteropAddress',
}
export default {
	entityType: EntityType.EvmAccount,
	label: 'EVM account',
	labelPlural: 'EVM accounts',
	description: 'An account address in the EVM address space, independent of any one chain.',
	selectors: [
		{
			name: EvmAccountSelector.Address,
			fields: [
				'address',
			],
		},
		{
			name: EvmAccountSelector.AddressInteropAddress,
			fields: [
				'address',
				'interopAddress',
			],
		},
	],
	fields: [
		{
				name: 'address',
				label: 'Address',
				description: 'The address or account identifier used by the source protocol.',
				type: EntityFieldType.Primitive,
				primitiveType: (EvmAddress),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'interopAddress',
				label: 'Interop address',
				type: EntityFieldType.Primitive,
				primitiveType: type('string'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$primaryName',
				label: 'Primary name',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EnsName,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'avatarUrl',
				label: 'Avatar URL',
				type: EntityFieldType.Primitive,
				primitiveType: (UrlString),
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$avatar',
				label: 'Avatar',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.Media,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$$ensNamesOwned',
				label: 'ENS names owned',
				type: EntityFieldType.EntitiesReference,
				entityType: EntityType.EnsName,
				cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

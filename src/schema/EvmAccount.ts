import { type } from 'arktype'
import {
	EntityFieldCardinality,
	EntityFieldType,
	type EntityDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
export enum EvmAccountSelector {
	Address = 'address',
	AddressInteropAddress = 'addressInteropAddress',
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
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'interopAddress',
			label: 'interop address',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$primaryName',
			label: 'primary name',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EnsName,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'avatarUrl',
			label: 'avatar URL',
			type: EntityFieldType.Primitive,
			primitiveType: type("string"),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$avatar',
			label: 'avatar',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$ensNamesOwned',
			label: 'ENS names owned',
			labelPlural: 'ENS names ownedses',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EnsName,
			cardinality: EntityFieldCardinality.Many,
		},
	],
} as const satisfies EntityDefinition

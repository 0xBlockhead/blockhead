import { type } from 'arktype'

import { EvmAddress } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum EvmAccountSelector {
	Address = 'address',
	AddressInteropAddress = 'addressInteropAddress',
}

export default {
	entityType: EntityType.EvmAccount,

	label: 'EVM account',
	labelPlural: 'EVM accounts',

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
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'interopAddress',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$primaryName',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EnsName,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: '$icon',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.Media,
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Voltaire_JsonRpc,
			],
		},
		{
			name: '$$ensNamesOwned',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EnsName,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.TheGraph_Graphql,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

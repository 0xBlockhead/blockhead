import { type } from 'arktype'

import {
	EntityFieldType,
	EntityFieldCardinality,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { Source } from '$/sources/Source.ts'

export enum Erc4337AccountFactorySelector {
	EvmNetworkAddress = 'evmNetworkAddress',
}

export default {
	entityType: EntityType.Erc4337AccountFactory,

	label: 'ERC-4337 account factory',
	labelPlural: 'ERC-4337 account factories',

	selectors: [
		{
			name: Erc4337AccountFactorySelector.EvmNetworkAddress,
			fields: [
				'$network',
				'address',
			],
		},
	],

	fields: [
		{
			name: '$network',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmNetwork,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'address',
			type: EntityFieldType.Primitive,
			primitiveType: EvmAddress,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'userOperationsCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
		{
			name: '$contract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.One,
			defaultSources: [
				Source.Blockscout_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

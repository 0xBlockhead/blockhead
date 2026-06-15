import { type } from 'arktype'

import { EvmTokenStandard } from '$/constants/Evm.ts'
import { ZeroExHex } from '$/schema/ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	conditionalOn,
	type EntityDefinition,
	type EntityFieldDefinition,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

export enum EvmTokenTransferSelector {
	EvmNetworkTxHashLogIndexTransferIndex = 'evmNetworkTxHashLogIndexTransferIndex',
}


const evmTokenTransferDiscriminatorFields = [
	{
		name: 'standard',
		type: EntityFieldType.Primitive,
		primitiveType: type.valueOf(EvmTokenStandard),
		cardinality: EntityFieldCardinality.One,
	},
] as const satisfies readonly EntityFieldDefinition[]

export default {
	entityType: EntityType.EvmTokenTransfer,

	label: 'Token transfer',
	labelPlural: 'Token transfers',

	selectors: [
		{
			name: EvmTokenTransferSelector.EvmNetworkTxHashLogIndexTransferIndex,
			fields: [
				'$network',
				'txHash',
				'logIndex',
				'transferIndex',
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
		...evmTokenTransferDiscriminatorFields,
		{
			name: 'txHash',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'logIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transferIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: '$from',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$to',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$tokenContract',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmContract,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$coinInstance',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmCoinInstance,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'amount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'tokenId',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			when: conditionalOn(
				evmTokenTransferDiscriminatorFields,
				'standard',
				[
					EvmTokenStandard.Erc721,
					EvmTokenStandard.Erc1155,
				],
			),
		},
		{
			name: 'tokenSymbol',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
			],
		},
		{
			name: 'tokenName',
			type: EntityFieldType.Primitive,
			primitiveType: type('string'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
			],
		},
		{
			name: 'tokenDecimals',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
			],
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

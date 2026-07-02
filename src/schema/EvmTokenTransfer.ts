// Generated from APP.ts. Do not edit by hand.

import { EvmTokenStandard } from '$/constants/Evm.ts'
import { EntityFieldCardinality, EntityFieldType, type EntityDefinition } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { type } from 'arktype'

export enum EvmTokenTransferSelector {
	LogIndexInLog = 'LogIndexInLog',
}
export default {
	entityType: EntityType.EvmTokenTransfer,
	label: 'Token transfer',
	labelPlural: 'token transfers',
	selectors: [
		{
			name: EvmTokenTransferSelector.LogIndexInLog,
			fields: [
				'$log',
				'indexInLog',
			],
		},
	],
	fields: [
		{
				name: '$log',
				label: 'Log',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmLog,
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'standard',
				type: EntityFieldType.Primitive,
				primitiveType: type.enumerated(...Object.values(EvmTokenStandard)),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'indexInLog',
				label: 'Index in log',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: '$from',
				label: 'From',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$to',
				label: 'To',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmAccount,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$tokenContract',
				label: 'Token contract',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmContract,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: '$coinInstance',
				label: 'Token',
				type: EntityFieldType.EntityReference,
				entityType: EntityType.EvmCoinInstance,
				cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
				name: 'amount',
				label: 'Amount',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.One,
		},
		{
				name: 'tokenId',
				label: 'Token ID',
				description: 'The token identifier within its collection or contract.',
				type: EntityFieldType.Primitive,
				primitiveType: type('bigint'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				when: {
					fieldName: 'standard',
					values: [
						'ERC-721',
						'ERC-1155',
					],
				},
		},
		{
				name: 'tokenSymbol',
				label: 'Token symbol',
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
				label: 'Token name',
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
				label: 'Token decimals',
				type: EntityFieldType.Primitive,
				primitiveType: type('number'),
				cardinality: EntityFieldCardinality.ZeroOrOne,
				defaultSources: [
					Source.Blockscout_Rest,
					Source.Etherscan_Rest,
				],
		},
	],
} as const satisfies EntityDefinition

import { type } from 'arktype'

import { EvmTokenStandard } from '$/constants/Evm.ts'
import { ZeroExHex, lowercaseHexIdentityValue } from '$/schema/$ZeroExHex.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
	conditionalFieldGroup,
	type EntityDefinition,
	type EntityFieldEntry,
	type EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import Network from '$/schema/EvmNetwork.ts'
import { Source } from '$/sources/$Source.ts'

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

	id: type({
		$network: Network.id,
		txHash: ZeroExHex,
		logIndex: 'number',
		transferIndex: 'number',
	}),

	identities: [
		{
			name: 'txHashLogTransferIndex',
			fields: [
				{
					name: '$network',
				},
				{
					name: 'txHash',
					normalize: lowercaseHexIdentityValue,
				},
				{
					name: 'logIndex',
				},
				{
					name: 'transferIndex',
				},
			],
		},
	],

	fields: [
		...evmTokenTransferDiscriminatorFields,
		{
			name: 'txHash',
			type: EntityFieldType.Primitive,
			primitiveType: ZeroExHex,
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'logIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transferIndex',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
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
		conditionalFieldGroup(
			evmTokenTransferDiscriminatorFields,
			'standard',
			[
				EvmTokenStandard.Erc721,
				EvmTokenStandard.Erc1155,
			],
			[
				{
					name: 'tokenId',
					type: EntityFieldType.Primitive,
					primitiveType: type('bigint'),
					cardinality: EntityFieldCardinality.ZeroOrOne,
				},
			],
		),
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
	] as const satisfies readonly EntityFieldEntry[],
} as const satisfies EntityDefinition

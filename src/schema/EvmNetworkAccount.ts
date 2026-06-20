import { type } from 'arktype'

import { EvmAddress } from '$/schema/ZeroExHex.ts'
import type {
	EntityDefinition,
	EntityFieldDefinition,
} from '$/schema/$schema.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import EvmAccount from '$/schema/EvmAccount.ts'
import { Source } from '$/sources/Source.ts'

export enum EvmNetworkAccountSelector {
	EvmNetworkEvmAccount = 'evmNetworkEvmAccount',
}


const contractPositionProtocol = type({
	key: 'string',
	name: 'string',
	'logo_url?': UrlString,
})

const contractPositionPool = type({
	address: EvmAddress,
	'name?': 'string',
})

const contractPositionChain = type({
	$network: type({
		caip2: type({
			namespace: 'string',
			reference: 'string',
		}),
	}),
	value: 'number',
	valuePercentile: 'number',
	'totalCostBasis?': 'number',
	'totalClosedPnl?': 'number',
	'totalOpenPnl?': 'number',
})

export default {
	entityType: EntityType.EvmNetworkAccount,

	label: 'EVM network account',
	labelPlural: 'EVM network accounts',

	selectors: [
		{
			name: EvmNetworkAccountSelector.EvmNetworkEvmAccount,
			fields: [
				'$network',
				'$actor',
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
			name: '$actor',
			type: EntityFieldType.EntityReference,
			entityType: EntityType.EvmAccount,
			cardinality: EntityFieldCardinality.One,
		},
		{
			name: 'transactionCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'firstTransactionAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'lastTransactionAt',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'tokenTransferCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'isContract',
			type: EntityFieldType.Primitive,
			primitiveType: type('boolean'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
			defaultSources: [
				Source.Blockscout_Rest,
				Source.ZeroGChain_JsonRpc,
			],
		},
		{
			name: 'nftCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: '$$transactions',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmTransaction,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: '$$tokenTransfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmTokenTransfer,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
			],
		},
		{
			name: '$$internalTransfers',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmInternalTransfer,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Blockscout_Rest,
				Source.Etherscan_Rest,
			],
		},
		{
			name: '$$ownedCoins',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmNetworkActorCoinBalance,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Allium_Rest,
			],
		},
		// ERC-20 Approval allowance rows (owner × token × spender). No list indexer wired yet—Blockscout token transfers omit Approval events; Voltaire resolves scalar allowance when the id is known.
		{
			name: '$$erc20TokenAllowances',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.EvmActorCoinAllowance,
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
		{
			name: 'contractPositions',
			type: EntityFieldType.Primitive,
			primitiveType: type({
				name: 'string',
				protocol: contractPositionProtocol,
				'pool?': contractPositionPool,
				value: 'number',
				'totalCostBasis?': 'number',
				'totalClosedPnl?': 'number',
				'totalOpenPnl?': 'number',
				'chains?': contractPositionChain.array(),
			}),
			cardinality: EntityFieldCardinality.ZeroOrMany,
		},
	] as const satisfies readonly EntityFieldDefinition[],
} as const satisfies EntityDefinition

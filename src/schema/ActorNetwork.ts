import { type } from 'arktype'

import { EvmAddress } from '$/schema/$ZeroExHex.ts'
import type {
	EntityDefinition,
	EntityFieldDefinition,
} from '$/schema/$EntityDefinition.ts'
import {
	EntityFieldType,
	EntityFieldCardinality,
} from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { UrlString } from '$/schema/$Url.ts'
import Actor from '$/schema/Actor.ts'
import Network from '$/schema/Network.ts'
import { Source } from '$/sources/$Source.ts'

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
	$network: Network.id,
	value: 'number',
	valuePercentile: 'number',
	'totalCostBasis?': 'number',
	'totalClosedPnl?': 'number',
	'totalOpenPnl?': 'number',
})

export default {
	entityType: EntityType.ActorNetwork,

	label: 'Network Actor',
	labelPlural: 'Network Actors',

	id: type({
		$network: Network.id,
		$actor: Actor.id,
	}),

	fields: [
		{
			name: 'transactionsCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('bigint'),
			cardinality: EntityFieldCardinality.ZeroOrOne,
		},
		{
			name: 'transactionCount',
			type: EntityFieldType.Primitive,
			primitiveType: type('number'),
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
			name: '$$ownedCoins',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ActorCoin,
			cardinality: EntityFieldCardinality.ZeroOrMany,
			defaultSources: [
				Source.Allium_Rest,
			],
		},
		{
			name: '$$erc20TokenAllowances',
			type: EntityFieldType.EntitiesReference,
			entityType: EntityType.ActorCoinAllowance,
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

// Generated from APP.ts.

import { entity } from '$/schema/$schema.ts'
import { EntityFieldCardinality } from '$/schema/EntityFieldCardinality.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { type } from 'arktype'

export default entity({
	entityType: EntityType.BlockheadTransferIntent,
	labels: {
		singular: 'blockhead transfer intent',
		plural: 'blockhead transfer intents',
	},
})({
	sessionId: {
		label: 'session ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	actionId: {
		label: 'action ID',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.One,
	},
	$sessionAction: {
		label: 'session action',
		entityType: EntityType.BlockheadSessionAction,
		cardinality: EntityFieldCardinality.One,
	},
	fromCaip10: {
		label: 'from CAIP-10',
		primitiveType: type({
			namespace: type('string'),
			reference: type('string'),
			accountAddress: type('string'),
		}),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toCaip10: {
		label: 'to CAIP-10',
		primitiveType: type({
			namespace: type('string'),
			reference: type('string'),
			accountAddress: type('string'),
		}),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	networkCaip2: {
		label: 'network CAIP-2',
		primitiveType: type({
			namespace: type('string'),
			reference: type('string'),
		}),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	assetCaip19: {
		label: 'asset CAIP-19',
		primitiveType: type('string'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	fromAddress: {
		label: 'from address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	toAddress: {
		label: 'to address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	chainId: {
		label: 'Chain ID',
		primitiveType: type('number'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	tokenAddress: {
		label: 'token address',
		primitiveType: EvmAddress,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$fromAccount: {
		label: 'from account',
		entityType: EntityType.Account,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$toAccount: {
		label: 'to account',
		entityType: EntityType.Account,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$from: {
		label: 'from',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$to: {
		label: 'to',
		entityType: EntityType.EvmAccount,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$network: {
		label: 'network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$evmNetwork: {
		label: 'EVM network',
		entityType: EntityType.Network,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	$token: {
		label: 'token',
		entityType: EntityType.EvmCoinInstance,
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
	amount: {
		label: 'amount',
		primitiveType: type('bigint'),
		cardinality: EntityFieldCardinality.ZeroOrOne,
	},
})({
	selectors: {
		SessionIdActionId: [
			'sessionId',
			'actionId',
		],
	},
})

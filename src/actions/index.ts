import { type } from 'arktype'

import { WalletCapability } from '$/constants/Wallet.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'


// Types/constants

export enum ActionType {
	Swap = 'Swap',
	Bridge = 'Bridge',
	Transfer = 'Transfer',
}

export const zeroAddress = '0x0000000000000000000000000000000000000000' as const

export const actionTypeDefinitions = [
	{
		type: ActionType.Swap,
		label: 'Swap',
		icon: '🔄',
		intentEntityType: EntityType.BlockheadSwapIntent,
		acceptedEntityPlacementPairs: [
			{
				source: {
					entityType: EntityType.EvmNetworkActorCoinBalance,
					placement: 'From',
				},
				target: {
					entityType: EntityType.EvmCoinInstance,
					placement: 'To',
				},
			},
			{
				source: {
					entityType: EntityType.EvmNetworkActorCoinBalance,
					placement: 'From',
				},
				target: {
					entityType: EntityType.EvmNetworkActorCoinBalance,
					placement: 'To',
				},
			},
		],
		protocolOptions: [
			{
				id: 'ZeroEx',
				label: '0x',
			},
			{
				id: 'OneInch',
				label: '1inch',
			},
			{
				id: 'ParaSwap',
				label: 'ParaSwap',
			},
		],
		requiresQuote: true,
		requiresSimulation: true,
		requiredWalletCapability: WalletCapability.SendTransaction,
		requiredWalletMethod: 'eth_sendTransaction',
		params: type({
			chainId: type('number.integer > 0').default(1),
			tokenIn: EvmAddress.default(zeroAddress),
			tokenOut: EvmAddress.default(zeroAddress),
			amount: type('bigint').default(0n),
			slippage: type('0 <= number < 1').default(0.005),
		}).onUndeclaredKey('reject'),
	},
	{
		type: ActionType.Bridge,
		label: 'Bridge',
		icon: '🌉',
		intentEntityType: EntityType.BlockheadBridgeIntent,
		acceptedEntityPlacementPairs: [
			{
				source: {
					entityType: EntityType.EvmNetworkActorCoinBalance,
					placement: 'From',
				},
				target: {
					entityType: EntityType.EvmNetworkAccount,
					placement: 'To',
				},
			},
			{
				source: {
					entityType: EntityType.EvmNetworkActorCoinBalance,
					placement: 'From',
				},
				target: {
					entityType: EntityType.EvmNetworkActorCoinBalance,
					placement: 'To',
				},
			},
		],
		protocolOptions: [
			{
				id: 'LiFi',
				label: 'LI.FI',
			},
		],
		requiresQuote: true,
		requiresSimulation: true,
		requiredWalletCapability: WalletCapability.SendTransaction,
		requiredWalletMethod: 'eth_sendTransaction',
		params: type({
			fromChainId: type('number.integer > 0').default(1),
			toChainId: type('number.integer > 0').default(10),
			tokenAddress: EvmAddress.default(zeroAddress),
			amount: type('bigint').default(0n),
			slippage: type('0 <= number < 1').default(0.005),
		}).onUndeclaredKey('reject'),
	},
	{
		type: ActionType.Transfer,
		label: 'Transfer',
		icon: '💸',
		intentEntityType: EntityType.BlockheadTransferIntent,
		acceptedEntityPlacementPairs: [
			{
				source: {
					entityType: EntityType.EvmNetworkAccount,
					placement: 'From',
				},
				target: {
					entityType: EntityType.EvmNetworkAccount,
					placement: 'To',
				},
			},
			{
				source: {
					entityType: EntityType.EvmNetworkActorCoinBalance,
					placement: 'From',
				},
				target: {
					entityType: EntityType.EvmNetworkActorCoinBalance,
					placement: 'To',
				},
			},
		],
		protocolOptions: [
			{
				id: 'DirectWalletTransfer',
				label: 'Direct wallet transfer',
			},
		],
		requiresQuote: false,
		requiresSimulation: true,
		requiredWalletCapability: WalletCapability.SendTransaction,
		requiredWalletMethod: 'eth_sendTransaction',
		params: type({
			fromActor: EvmAddress.default(zeroAddress),
			toActor: EvmAddress.default(zeroAddress),
			chainId: type('number.integer > 0').default(1),
			tokenAddress: EvmAddress.default(zeroAddress),
			amount: type('bigint').default(0n),
		}).onUndeclaredKey('reject'),
	},
] as const

export const actionTypeDefinitionByActionType = Object.fromEntries(
	actionTypeDefinitions.map((definition) => [
		definition.type,
		definition,
	])
)

export type ActionTypeDefinition = (typeof actionTypeDefinitions)[number]

export type ActionParamsByActionType = {
	[_ActionType in ActionType]: Extract<
		ActionTypeDefinition,
		{ type: _ActionType }
	>['params']['infer']
}

export type ActionProtocolByActionType = {
	[_ActionType in ActionType]: Extract<
		ActionTypeDefinition,
		{ type: _ActionType }
	>['protocolOptions'][number]['id']
}

export type Action<_ActionType extends ActionType = ActionType> = {
	[_Type in _ActionType]: {
		type: _Type
		params: ActionParamsByActionType[_Type]
	}
}[_ActionType]

export const actionContent = type.or(
	type({ type: "'Transfer'", params: actionTypeDefinitions[2].params }).onUndeclaredKey('reject'),
	type({ type: "'Swap'", params: actionTypeDefinitions[0].params }).onUndeclaredKey('reject'),
	type({ type: "'Bridge'", params: actionTypeDefinitions[1].params }).onUndeclaredKey('reject')
)

export type ActionContent = typeof actionContent.infer

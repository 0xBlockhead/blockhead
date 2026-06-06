import { type } from 'arktype'

import { EvmAddress } from '$/schema/$ZeroExHex.ts'


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
		params: type({
			chainId: type('number.integer').default(1),
			tokenIn: EvmAddress.default(zeroAddress),
			tokenOut: EvmAddress.default(zeroAddress),
			amount: type('bigint').default(0n),
			slippage: type('number').default(0.005),
		}),
	},
	{
		type: ActionType.Bridge,
		label: 'Bridge',
		icon: '🌉',
		params: type({
			fromChainId: type('number.integer').or('null').default(1),
			toChainId: type('number.integer').or('null').default(10),
			tokenAddress: EvmAddress.default(zeroAddress),
			amount: type('bigint').default(0n),
			slippage: type('number').default(0.005),
		}),
	},
	{
		type: ActionType.Transfer,
		label: 'Transfer',
		icon: '💸',
		params: type({
			fromActor: EvmAddress.default(zeroAddress),
			toActor: EvmAddress.default(zeroAddress),
			chainId: type('number.integer').default(1),
			tokenAddress: EvmAddress.default(zeroAddress),
			amount: type('bigint').default(0n),
		}),
	},
] as const

export const actionTypeDefinitionByActionType = Object.fromEntries(
	actionTypeDefinitions.map((definition) => [
		definition.type,
		definition,
	]),
)

export type Action = {
	type: ActionType
	params: Record<string, unknown>
}

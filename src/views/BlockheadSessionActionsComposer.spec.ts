import { readFileSync } from 'node:fs'

import { compile } from 'svelte/compiler'
import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import {
	type Action,
	ActionType,
	actionTypeDefinitionByActionType,
	actionTypeDefinitions,
	zeroAddress,
} from '$/constants/actions.ts'
import { WalletCapability } from '$/constants/Wallet.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { stringify } from 'devalue'
import {
	sessionTransferSource,
	sessionTransferSourceFromSerialized,
} from './BlockheadSessionActionsComposer.svelte'

vi.mock('$/routes/+layout.svelte', () => ({
	getAppClient: () => {
		throw new Error('getAppClient is outside the receiver contract test')
	},
}))


const source = readFileSync(
	new URL('./BlockheadSessionActionsComposer.svelte', import.meta.url),
	'utf8'
)


describe('BlockheadSessionActionsComposer contract', () => {
	it('derives the exact intent, placement, protocol, and execution requirements from one action table', () => {
		expect(actionTypeDefinitions.map((definition) => ({
			type: definition.type,
			intentEntityType: definition.intentEntityType,
			placementPairs: definition.acceptedEntityPlacementPairs.map((pair) => (
				`${pair.source.placement}:${pair.source.entityType}->${pair.target.placement}:${pair.target.entityType}`
			)),
			protocols: definition.protocolOptions.map((protocol) => protocol.id),
			requiresQuote: definition.requiresQuote,
			requiresSimulation: definition.requiresSimulation,
			requiredWalletCapability: definition.requiredWalletCapability,
			requiredWalletMethod: definition.requiredWalletMethod,
		}))).toEqual([
			{
				type: ActionType.Swap,
				intentEntityType: EntityType.BlockheadSwapIntent,
				placementPairs: [
					'From:EvmNetworkActorCoinBalance->To:EvmCoinInstance',
					'From:EvmNetworkActorCoinBalance->To:EvmNetworkActorCoinBalance',
				],
				protocols: [
					'ZeroEx',
					'OneInch',
					'ParaSwap',
				],
				requiresQuote: true,
				requiresSimulation: true,
				requiredWalletCapability: WalletCapability.SendTransaction,
				requiredWalletMethod: 'eth_sendTransaction',
			},
			{
				type: ActionType.Bridge,
				intentEntityType: EntityType.BlockheadBridgeIntent,
				placementPairs: [
					'From:EvmNetworkActorCoinBalance->To:EvmNetworkAccount',
					'From:EvmNetworkActorCoinBalance->To:EvmNetworkActorCoinBalance',
				],
				protocols: ['LiFi'],
				requiresQuote: true,
				requiresSimulation: true,
				requiredWalletCapability: WalletCapability.SendTransaction,
				requiredWalletMethod: 'eth_sendTransaction',
			},
			{
				type: ActionType.Transfer,
				intentEntityType: EntityType.BlockheadTransferIntent,
				placementPairs: [
					'From:EvmNetworkAccount->To:EvmNetworkAccount',
					'From:EvmNetworkActorCoinBalance->To:EvmNetworkActorCoinBalance',
				],
				protocols: ['DirectWalletTransfer'],
				requiresQuote: false,
				requiresSimulation: true,
				requiredWalletCapability: WalletCapability.SendTransaction,
				requiredWalletMethod: 'eth_sendTransaction',
			},
		])

		for (const definition of actionTypeDefinitions)
			expect(actionTypeDefinitionByActionType[definition.type]).toBe(definition)
	})

	it('validates exact discriminated action params instead of a generic JSON payload', () => {
		expect(actionTypeDefinitionByActionType[ActionType.Swap].params.assert({})).toEqual({
			chainId: 1,
			tokenIn: zeroAddress,
			tokenOut: zeroAddress,
			amount: 0n,
			slippage: 0.005,
		})
		expect(actionTypeDefinitionByActionType[ActionType.Bridge].params.assert({})).toEqual({
			fromChainId: 1,
			toChainId: 10,
			tokenAddress: zeroAddress,
			amount: 0n,
			slippage: 0.005,
		})
		const action = {
			type: ActionType.Transfer,
			params: actionTypeDefinitionByActionType[ActionType.Transfer].params.assert({}),
		} satisfies Action
		expect(action.params).toEqual({
			fromActor: zeroAddress,
			toActor: zeroAddress,
			chainId: 1,
			tokenAddress: zeroAddress,
			amount: 0n,
		})

		expect(() => actionTypeDefinitionByActionType[ActionType.Swap].params.assert({
			chainId: 0,
		})).toThrow()
		expect(() => actionTypeDefinitionByActionType[ActionType.Bridge].params.assert({
			slippage: 1,
		})).toThrow()
		expect(() => actionTypeDefinitionByActionType[ActionType.Swap].params.assert({
			fromActor: zeroAddress,
		})).toThrow()
		expect(() => actionTypeDefinitionByActionType[ActionType.Bridge].params.assert({
			tokenIn: zeroAddress,
		})).toThrow()
		expect(() => actionTypeDefinitionByActionType[ActionType.Transfer].params.assert({
			slippage: 0.005,
		})).toThrow()
	})

	it.each([
		{
			name: 'valid EVM account payload',
			result: sessionTransferSourceFromSerialized(stringify({
				entityType: EntityType.EvmNetworkAccount,
				entitySelector: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: '1',
						},
					},
					$actor: {
						address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
					},
				},
			})),
			expected: {
				fromActor: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
				chainId: '1',
			},
		},
		{
			name: 'malformed payload',
			result: sessionTransferSourceFromSerialized('not devalue'),
			expected: {
				error: 'That drop payload is invalid or expired. Try an account card again.',
			},
		},
		{
			name: 'unsupported entity payload',
			result: sessionTransferSource(EntityType.Network, {
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			}),
			expected: {
				error: 'Only EVM account cards can start transfer drafts.',
			},
		},
	])('classifies $name without mutating a session', ({ result, expected }) => {
		expect(result).toEqual(expected)
	})

	it('compiles the handwritten draft editor without Svelte warnings', () => {
		expect(compile(source, {
			filename: 'BlockheadSessionActionsComposer.svelte',
			generate: 'client',
		}).warnings).toEqual([])
	})

	it('uses one validated draft lifecycle for both create and identity-preserving edit', () => {
		expect(source.match(/const confirmDraft =/g)).toHaveLength(1)
		expect(source.match(/writeLocalBlockheadSessionAction\(/g)).toHaveLength(1)
		expect(source.match(/updateLocalBlockheadSessionActionType\(/g)).toHaveLength(1)
		expect(source).toContain('editingActionSelector')
		expect(source).toContain('Draft values are invalid. Correct them before saving.')
		expect(source).not.toMatch(/(?:execute|broadcast|finality) action/i)
	})

	it.each([
		['cancel', 'onclick={cancelDraft}'],
		['confirm', 'writeLocalBlockheadSessionAction('],
	])('routes %s through the shared draft lifecycle', (_, contract) => {
		expect(source).toContain(contract)
	})
})

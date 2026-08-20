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
	zeroAddress,
} from '$/constants/actions.ts'
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


describe('BlockheadSessionActionsComposer contract', () => {
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

})

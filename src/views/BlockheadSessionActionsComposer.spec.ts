import {
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { EntityType } from '$/schema/EntityType.ts'
import { stringify } from 'devalue'
import {
	sessionTransferSource,
	sessionTransferSourceFromSerialized,
} from './BlockheadSessionActionsComposer.svelte'

vi.mock('$/routes/applicationClient.ts', () => ({
	getAppClient: () => {
		throw new Error('getAppClient is outside the receiver contract test')
	},
}))


describe('BlockheadSessionActionsComposer contract', () => {
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

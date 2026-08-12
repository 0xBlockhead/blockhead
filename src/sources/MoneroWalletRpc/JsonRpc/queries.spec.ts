import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import bindings from '$/sources/MoneroWalletRpc/bindings.ts'
import { Source } from '$/sources/Source.ts'


const { jsonRpc2 } = vi.hoisted(() => ({
	jsonRpc2: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({ jsonRpc2 }))

const {
	getAccounts,
	getAddress,
	getBalance,
	getHeight,
} = await import('$/sources/MoneroWalletRpc/JsonRpc/queries.ts')
const binding = bindings[Source.MoneroWalletRpc_JsonRpc][0]

describe('Monero wallet RPC reads', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('requests strict wallet, account, subaddress, and height observations', async () => {
		jsonRpc2
			.mockResolvedValueOnce({
				subaddress_accounts: [{
					account_index: 0,
					base_address: '48primary',
				}],
			})
			.mockResolvedValueOnce({
				balance: 12,
				unlocked_balance: 10,
			})
			.mockResolvedValueOnce({
				address: '48primary',
				addresses: [{
					address: '48primary',
					address_index: 0,
				}],
			})
			.mockResolvedValueOnce({ height: 100 })

		await expect(getAccounts(binding)).resolves.toMatchObject({
			subaddress_accounts: [{ account_index: 0 }],
		})
		await expect(getBalance(binding)).resolves.toMatchObject({ balance: 12 })
		await expect(getAddress(binding, 0)).resolves.toMatchObject({ address: '48primary' })
		await expect(getHeight(binding)).resolves.toEqual({ height: 100 })
		expect(jsonRpc2).toHaveBeenNthCalledWith(1, binding, 'get_accounts', {
			strict_balances: true,
		})
		expect(jsonRpc2).toHaveBeenNthCalledWith(2, binding, 'get_balance', {
			all_accounts: true,
			strict: true,
		})
	})

	it('fails closed on malformed local wallet data', async () => {
		jsonRpc2.mockResolvedValue({
			balance: -1,
			unlocked_balance: 0,
		})

		await expect(getBalance(binding)).rejects.toThrow('invalid get_balance response envelope')
	})
})

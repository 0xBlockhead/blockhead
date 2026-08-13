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
	getKeyStatus,
	getOutputs,
	getTransfers,
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
		await expect(getAddress(0, binding)).resolves.toMatchObject({ address: '48primary' })
		await expect(getHeight(binding)).resolves.toEqual({ height: 100 })
		expect(jsonRpc2).toHaveBeenNthCalledWith(1, binding, 'get_accounts', {
			strict_balances: true,
		})
		expect(jsonRpc2).toHaveBeenNthCalledWith(2, binding, 'get_balance', {
			all_accounts: true,
			strict: true,
		})
	})

	it('reads native output and transfer lifecycle rows without requesting mutation authority', async () => {
		jsonRpc2
			.mockResolvedValueOnce({
				outputs: [{
					amount: 12,
					amount_index: 0,
					txid: 'a'.repeat(64),
					subaddr_index: {
						major: 2,
						minor: 3,
					},
					spent: false,
				}],
			})
			.mockResolvedValueOnce({
				in: [{
					amount: 12,
					txid: 'a'.repeat(64),
					subaddr_index: {
						major: 2,
						minor: 3,
					},
				}],
			})

		await expect(getOutputs(binding)).resolves.toMatchObject({
			outputs: [{
				amount_index: 0,
				subaddr_index: {
					major: 2,
					minor: 3,
				},
			}],
		})
		await expect(getTransfers(binding)).resolves.toMatchObject({
			in: [{
				txid: 'a'.repeat(64),
				subaddr_index: {
					major: 2,
					minor: 3,
				},
			}],
		})
		expect(jsonRpc2).toHaveBeenNthCalledWith(1, binding, 'get_outputs', {
			all: true,
		})
		expect(jsonRpc2).toHaveBeenNthCalledWith(2, binding, 'get_transfers', {
			in: true,
			out: true,
			pending: true,
			failed: true,
			pool: true,
		})
	})

	it('projects wallet key capability without exposing private key material', async () => {
		jsonRpc2
			.mockResolvedValueOnce({ key: 'a'.repeat(64) })
			.mockResolvedValueOnce({ key: '0'.repeat(64) })

		const keyStatus = await getKeyStatus(binding)
		expect(keyStatus).toEqual({
			viewKeyFingerprint: expect.stringMatching(/^[0-9a-f]{64}$/),
			spendKeyAvailable: false,
		})
		expect(keyStatus.viewKeyFingerprint).not.toContain('a'.repeat(32))
		expect(jsonRpc2).toHaveBeenNthCalledWith(1, binding, 'query_key', {
			key_type: 'view_key',
		})
		expect(jsonRpc2).toHaveBeenNthCalledWith(2, binding, 'query_key', {
			key_type: 'spend_key',
		})
	})

	it('fails closed on malformed wallet key material', async () => {
		jsonRpc2.mockResolvedValue({ key: 'not-a-private-key' })

		await expect(getKeyStatus(binding)).rejects.toThrow('invalid wallet key response')
	})

	it('fails closed on malformed local wallet data', async () => {
		jsonRpc2.mockResolvedValue({
			balance: -1,
			unlocked_balance: 0,
		})

		await expect(getBalance(binding)).rejects.toThrow('invalid get_balance response envelope')
	})

	it('fails closed when wallet RPC flattens a subaddress index', async () => {
		jsonRpc2.mockResolvedValue({
			outputs: [{
				amount: 12,
				amount_index: 0,
				txid: 'a'.repeat(64),
				subaddr_index: 3,
			}],
		})

		await expect(getOutputs(binding)).rejects.toThrow('invalid get_outputs response envelope')
	})

	it('rejects duplicate local output identities', async () => {
		jsonRpc2.mockResolvedValue({
			outputs: [
				{
					amount: 12,
					amount_index: 0,
					txid: 'a'.repeat(64),
				},
				{
					amount: 13,
					amount_index: 0,
					txid: 'a'.repeat(64),
				},
			],
		})

		await expect(getOutputs(binding)).rejects.toThrow('duplicate output identity')
	})
})

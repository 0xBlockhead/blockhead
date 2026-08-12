import { beforeEach, expect, it, vi } from 'vitest'

const jsonRpc2 = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const { getWalletObservation } = await import('$/sources/Zcashd/WalletJsonRpc/queries.ts')

beforeEach(() => {
	vi.clearAllMocks()
})

it('materializes exact confirmed, total, transparent and private wallet balances', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
			transparent: '1.00000001',
			private: '2.5',
			total: '3.50000001',
		})
		.mockResolvedValueOnce({
			transparent: '1',
			private: '2',
			total: '3',
		})
		.mockResolvedValueOnce(3_000_000)

	await expect(getWalletObservation()).resolves.toEqual({
		balanceZatoshis: 350_000_001n,
		verifiedBalanceZatoshis: 300_000_000n,
		unshieldedBalanceZatoshis: 100_000_001n,
		privateBalanceZatoshis: 250_000_000n,
		chainTipHeight: 3_000_000n,
	})
	expect(jsonRpc2.mock.calls.map(([, method, parameters]) => [method, parameters])).toEqual([
		['z_gettotalbalance', [0, true]],
		['z_gettotalbalance', [1, true]],
		['getblockcount', []],
	])
})

it('fails closed when the provider balance components disagree', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
			transparent: '1',
			private: '2',
			total: '4',
		})
		.mockResolvedValueOnce({
			transparent: '1',
			private: '2',
			total: '3',
		})
		.mockResolvedValueOnce(1)

	await expect(getWalletObservation()).rejects.toThrow('total balance does not equal')
})

it('rejects lossy and over-precise amount strings', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
			transparent: '0.000000001',
			private: '0',
			total: '0',
		})
		.mockResolvedValueOnce({
			transparent: '0',
			private: '0',
			total: '0',
		})
		.mockResolvedValueOnce(1)

	await expect(getWalletObservation()).rejects.toThrow('invalid total balance response envelope')
})

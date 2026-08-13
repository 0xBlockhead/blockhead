import { beforeEach, expect, it, vi } from 'vitest'

const jsonRpc2 = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const {
	getWalletNotes,
	getWalletObservation,
} = await import('$/sources/Zcashd/WalletJsonRpc/queries.ts')

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

it('joins shielded wallet notes to their native transaction commitments', async () => {
	vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
	const saplingTransactionId = 'a'.repeat(64)
	const orchardTransactionId = 'b'.repeat(64)
	const saplingCommitment = 'c'.repeat(64)
	const orchardCommitment = 'd'.repeat(64)
	jsonRpc2
		.mockResolvedValueOnce(100)
		.mockResolvedValueOnce([
			{
				txid: saplingTransactionId,
				pool: 'sapling',
				outindex: 0,
				confirmations: 11,
				spendable: true,
				account: 0,
				address: 'zs1recipient',
				amount: 1.25,
				memo: '6869',
				memoStr: 'hi',
				change: false,
			},
			{
				txid: orchardTransactionId,
				pool: 'orchard',
				outindex: 0,
				confirmations: 0,
				spendable: false,
				amount: 0.00000001,
				memo: '',
				change: true,
			},
		])
		.mockResolvedValueOnce(100)
		.mockResolvedValueOnce({
			txid: saplingTransactionId,
			hash: saplingTransactionId,
			version: 5,
			locktime: 0,
			expiryheight: 0,
			size: 1,
			vin: [],
			vout: [],
			vShieldedOutput: [{
				cv: 'value-commitment',
				cmu: saplingCommitment,
				ephemeralKey: 'ephemeral-key',
				encCiphertext: 'encrypted',
				outCiphertext: 'outgoing',
				proof: 'proof',
			}],
		})
		.mockResolvedValueOnce({
			txid: orchardTransactionId,
			hash: orchardTransactionId,
			version: 5,
			locktime: 0,
			expiryheight: 0,
			size: 1,
			vin: [],
			vout: [],
			orchard: {
				actions: [{
					cv: 'value-commitment',
					nullifier: 'nullifier',
					cmx: orchardCommitment,
					ephemeralKey: 'ephemeral-key',
				}],
				flags: 0,
				valueBalance: 0,
				anchor: 'anchor',
				proof: 'proof',
				bindingSig: 'signature',
			},
		})

	await expect(getWalletNotes(2)).resolves.toEqual([
		expect.objectContaining({
			txid: saplingTransactionId,
			pool: 'sapling',
			noteCommitment: saplingCommitment,
			valueZatoshis: 125_000_000n,
			receivedAtHeight: 90n,
			observedAtMs: 1_700_000_000_000,
		}),
		expect.objectContaining({
			txid: orchardTransactionId,
			pool: 'orchard',
			noteCommitment: orchardCommitment,
			valueZatoshis: 1n,
			observedAtMs: 1_700_000_000_000,
		}),
	])
	expect(jsonRpc2.mock.calls.map(([, method, parameters]) => [method, parameters])).toEqual([
		['getblockcount', []],
		['z_listunspent', [0, 9_999_999, true, []]],
		['getblockcount', []],
		['getrawtransaction', [saplingTransactionId, 1]],
		['getrawtransaction', [orchardTransactionId, 1]],
	])
})

it('fails closed when note coordinates do not match the transaction', async () => {
	jsonRpc2
		.mockResolvedValueOnce(100)
		.mockResolvedValueOnce([{
			txid: 'a'.repeat(64),
			pool: 'sapling',
			outindex: 1,
			confirmations: 1,
			spendable: true,
			amount: 1,
			memo: '',
			change: false,
		}])
		.mockResolvedValueOnce(100)
		.mockResolvedValueOnce({
			txid: 'a'.repeat(64),
			hash: 'a'.repeat(64),
			version: 5,
			locktime: 0,
			expiryheight: 0,
			size: 1,
			vin: [],
			vout: [],
			vShieldedOutput: [],
		})

	await expect(getWalletNotes(1)).rejects.toThrow('note output coordinate is absent')
})

it('rejects note snapshots observed across different chain tips', async () => {
	jsonRpc2
		.mockResolvedValueOnce(100)
		.mockResolvedValueOnce([])
		.mockResolvedValueOnce(101)

	await expect(getWalletNotes(1)).rejects.toThrow('chain tip changed during note observation')
})

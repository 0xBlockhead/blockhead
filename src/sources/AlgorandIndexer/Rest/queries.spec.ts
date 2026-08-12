import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Source } from '$/sources/Source.ts'

const { getJson } = vi.hoisted(() => ({
	getJson: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const {
	getAccount,
	getAccountApplications,
	getAccountAssets,
	getAccountTransactions,
	getApplicationAccounts,
	getApplication,
	getAsset,
	getAssetBalances,
	getBlock,
	getHealth,
	getTransaction,
	listApplicationBoxes,
	listTransactions,
} = await import('$/sources/AlgorandIndexer/Rest/queries.ts')

const account = 'A'.repeat(58)
const otherAccount = `${'B'.repeat(57)}A`

describe('Algorand Indexer transport', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('loads bounded lossless-safe asset pages with opaque continuation', async () => {
		getJson.mockResolvedValueOnce({
			assets: [{
				amount: Number.MAX_SAFE_INTEGER,
				'asset-id': 42,
				'is-frozen': false,
			}],
			'current-round': 100,
			'next-token': 'opaque+next',
		})

		await expect(getAccountAssets({
			address: account,
			limit: 25,
			next: 'opaque+current',
		})).resolves.toMatchObject({
			'next-token': 'opaque+next',
		})
		expect(getJson).toHaveBeenCalledWith(
			expect.objectContaining({
				source: Source.Nodely,
				target: {
					kind: 'NetworkSlug',
					key: 'algorand',
				},
			}),
			`/v2/accounts/${account}/assets?limit=25&next=opaque%2Bcurrent&include-all=true`
		)
	})

	it('loads a subject-matched lossless account observation', async () => {
		getJson.mockResolvedValueOnce({
			account: {
				address: account,
				amount: 9_000_000,
				'pending-rewards': 2,
				'reward-base': 3,
				status: 'Online',
			},
			'current-round': 100,
		})

		await expect(getAccount(account)).resolves.toMatchObject({
			account: {
				address: account,
			},
			'current-round': 100,
		})
		expect(getJson).toHaveBeenCalledWith(
			expect.objectContaining({
				source: Source.Nodely,
			}),
			`/v2/accounts/${account}`
		)
	})

	it('accepts direct and nested account transactions while rejecting foreign rows', async () => {
		getJson.mockResolvedValueOnce({
			'current-round': 100,
			transactions: [{
				id: 'transaction-id',
				sender: otherAccount,
				fee: 1_000,
				'tx-type': 'pay',
				'inner-txns': [{
					id: 'inner-id',
					sender: account,
					fee: 1_000,
					'tx-type': 'pay',
				}],
			}],
		})
		await expect(getAccountTransactions({
			address: account,
			limit: 25,
		})).resolves.toMatchObject({
			transactions: [{
				id: 'transaction-id',
			}],
		})

		getJson.mockResolvedValueOnce({
			'current-round': 100,
			transactions: [{
				id: 'foreign-id',
				sender: otherAccount,
				fee: 1_000,
				'tx-type': 'pay',
			}],
		})
		await expect(getAccountTransactions({
			address: account,
			limit: 25,
		})).rejects.toThrow('foreign account row')
	})

	it('fail-closes malformed asset / application / block / transaction envelopes', async () => {
		getJson.mockResolvedValueOnce({
			asset: {
				index: 5,
				params: {
					creator: account,
					decimals: 0,
					total: 100,
				},
			},
			'current-round': 1,
		})
		await expect(getAsset(5n)).resolves.toMatchObject({
			asset: {
				index: 5,
			},
		})

		getJson.mockResolvedValueOnce({
			application: {
				id: 9,
				params: {
					creator: account,
					'global-state': [{
						key: 'x',
					}],
				},
			},
			'current-round': 2,
		})
		await expect(getApplication(9n)).resolves.toMatchObject({
			application: {
				id: 9,
			},
		})

		getJson.mockResolvedValueOnce({
			round: 10,
			timestamp: 1_700_000_000,
			proposer: account,
			'genesis-hash': 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=',
		})
		await expect(getBlock(10n)).resolves.toMatchObject({
			round: 10,
		})

		getJson.mockResolvedValueOnce({
			'current-round': 11,
			transaction: {
				id: 'TXID',
				sender: account,
				fee: 1000,
				'tx-type': 'pay',
			},
		})
		await expect(getTransaction('TXID')).resolves.toMatchObject({
			transaction: {
				id: 'TXID',
			},
		})

		getJson.mockResolvedValueOnce({
			asset: {
				index: 5,
				params: {
					creator: 'not-an-address',
					decimals: 0,
					total: 1,
				},
			},
			'current-round': 1,
		})
		await expect(getAsset(5n)).rejects.toThrow('invalid asset envelope')
	})

	it('rejects duplicate transaction identities within a subject-matched block', async () => {
		getJson.mockResolvedValueOnce({
			round: 10,
			timestamp: 1_700_000_000,
			transactions: [
				{
					id: 'duplicate-transaction',
					sender: account,
					fee: 1_000,
					'tx-type': 'pay',
				},
				{
					id: 'duplicate-transaction',
					sender: account,
					fee: 1_000,
					'tx-type': 'pay',
				},
			],
		})

		await expect(getBlock(10n)).rejects.toThrow('duplicate block transaction ID')
	})

	it('pages network transactions, asset balances, bidirectional local state, and boxes', async () => {
		getJson.mockResolvedValueOnce({
			'current-round': 100,
			'next-token': 'n1',
			transactions: [{
				id: 'network-tx',
				sender: account,
				fee: 1000,
				'tx-type': 'pay',
			}],
		})
		await expect(listTransactions({
			limit: 10,
		})).resolves.toMatchObject({
			'next-token': 'n1',
		})

		getJson.mockResolvedValueOnce({
			balances: [{
				address: account,
				amount: 1,
				'is-frozen': false,
			}],
			'current-round': 100,
		})
		await expect(getAssetBalances({
			assetId: 5n,
			limit: 10,
		})).resolves.toMatchObject({
			balances: [{
				address: account,
			}],
		})

		getJson.mockResolvedValueOnce({
			'apps-local-states': [{
				id: 7,
				deleted: false,
				'key-value': [],
			}],
			'current-round': 100,
		})
		await expect(getAccountApplications({
			address: account,
			limit: 10,
		})).resolves.toMatchObject({
			'apps-local-states': [{
				id: 7,
			}],
		})

		getJson.mockResolvedValueOnce({
			accounts: [{
				address: account,
				'apps-local-state': [{
					id: 7,
					deleted: false,
					'key-value': [],
				}],
			}],
			'current-round': 100,
			'next-token': 'application-account-next',
		})
		await expect(getApplicationAccounts({
			applicationId: 7n,
			limit: 10,
		})).resolves.toMatchObject({
			accounts: [{
				address: account,
			}],
		})
		expect(getJson).toHaveBeenLastCalledWith(
			expect.anything(),
			'/v2/accounts?limit=10&application-id=7&include-all=true'
		)

		getJson.mockResolvedValueOnce({
			'application-id': 7,
			boxes: [{
				name: 'Ym94',
			}],
		})
		await expect(listApplicationBoxes({
			applicationId: 7n,
			limit: 10,
		})).resolves.toMatchObject({
			boxes: [{
				name: 'Ym94',
			}],
		})

		getJson.mockResolvedValueOnce({
			round: 63821708,
			message: 'ok',
		})
		await expect(getHealth()).resolves.toMatchObject({
			round: 63821708,
		})
	})

	it('rejects lossy uint64 values and stalled continuations', async () => {
		getJson.mockResolvedValueOnce({
			assets: [{
				amount: Number.MAX_SAFE_INTEGER + 1,
				'asset-id': 42,
				'is-frozen': false,
			}],
			'current-round': 100,
		})
		await expect(getAccountAssets({
			address: account,
			limit: 25,
		})).rejects.toThrow('invalid asset holdings page envelope')

		getJson.mockResolvedValueOnce({
			'current-round': 100,
			'next-token': 'same',
			transactions: [],
		})
		await expect(getAccountTransactions({
			address: account,
			limit: 25,
			next: 'same',
		})).rejects.toThrow('did not advance')

		getJson.mockResolvedValueOnce({
			accounts: [{
				address: account,
				'apps-local-state': [{
					id: 8,
				}],
			}],
			'current-round': 100,
		})
		await expect(getApplicationAccounts({
			applicationId: 7n,
			limit: 25,
		})).rejects.toThrow('omits requested local state')
	})

	it('bounds pages and avoids transport for zero cardinality', async () => {
		await expect(getAccountAssets({
			address: account,
			limit: 0,
		})).resolves.toMatchObject({
			assets: [],
		})
		await expect(getAccountTransactions({
			address: account,
			limit: 1_001,
		})).rejects.toThrow('0 through 1000')
		expect(getJson).not.toHaveBeenCalled()
	})

	it('rejects noncanonical address bits and mismatched account identity', async () => {
		await expect(getAccount(
			`${'A'.repeat(57)}B`
		)).rejects.toThrow('invalid account address')

		getJson.mockResolvedValueOnce({
			account: {
				address: otherAccount,
				amount: 0,
			},
			'current-round': 100,
		})
		await expect(getAccount(account)).rejects.toThrow('does not match the subject')
	})
})

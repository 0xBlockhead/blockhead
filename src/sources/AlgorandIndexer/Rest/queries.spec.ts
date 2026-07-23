import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Source } from '$/sources/Source.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'

const { getJson } = vi.hoisted(() => ({
	getJson: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/HttpRest/client.ts', () => ({
	getJson,
}))

const {
	getAccount,
	getAccountAssets,
	getAccountTransactions,
} = await import('$/sources/AlgorandIndexer/Rest/queries.ts')

const binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => (
		candidate.source === Source.Nodely_AlgorandIndexer_Rest
		&& candidate.target.kind === 'NetworkSlug'
		&& candidate.target.key === 'algorand'
	))

if (binding == null)
	throw new Error('Nodely_AlgorandIndexer_Rest spec missing canonical source binding')

const account = 'A'.repeat(58)
const otherAccount = `${'B'.repeat(57)}A`

describe('Algorand Indexer account portfolio transport', () => {
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

		await expect(getAccountAssets(binding, {
			address: account,
			limit: 25,
			next: 'opaque+current',
		})).resolves.toMatchObject({
			'next-token': 'opaque+next',
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
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

		await expect(getAccount(binding, account)).resolves.toMatchObject({
			account: {
				address: account,
			},
			'current-round': 100,
		})
		expect(getJson).toHaveBeenCalledWith(
			binding,
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
				'inner-txns': [{
					id: 'inner-id',
					sender: account,
					fee: 1_000,
				}],
			}],
		})
		await expect(getAccountTransactions(binding, {
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
			}],
		})
		await expect(getAccountTransactions(binding, {
			address: account,
			limit: 25,
		})).rejects.toThrow('foreign account row')
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
		await expect(getAccountAssets(binding, {
			address: account,
			limit: 25,
		})).rejects.toThrow('exceeds lossless JSON integer range')

		getJson.mockResolvedValueOnce({
			'current-round': 100,
			'next-token': 'same',
			transactions: [],
		})
		await expect(getAccountTransactions(binding, {
			address: account,
			limit: 25,
			next: 'same',
		})).rejects.toThrow('did not advance')
	})

	it('bounds pages and avoids transport for zero cardinality', async () => {
		await expect(getAccountAssets(binding, {
			address: account,
			limit: 0,
		})).resolves.toMatchObject({
			assets: [],
		})
		await expect(getAccountTransactions(binding, {
			address: account,
			limit: 1_001,
		})).rejects.toThrow('0 through 1000')
		expect(getJson).not.toHaveBeenCalled()
	})

	it('rejects noncanonical address bits and mismatched account identity', async () => {
		await expect(getAccount(
			binding,
			`${'A'.repeat(57)}B`
		)).rejects.toThrow('invalid account address')

		getJson.mockResolvedValueOnce({
			account: {
				address: otherAccount,
				amount: 0,
			},
			'current-round': 100,
		})
		await expect(getAccount(binding, account)).rejects.toThrow('does not match the subject')
	})

	it('rejects generic placeholder and foreign Nodely bindings', async () => {
		const [genericBinding, foreignBinding] = [
			Source.AlgorandIndexer_Rest,
			Source.Nodely_Algod_Rest,
		].map((source) => sourceProviderDefinitions
			.flatMap((provider) => provider.bindings)
			.find((candidate) => candidate.source === source))

		if (genericBinding == null || foreignBinding == null)
			throw new Error('Algorand Indexer spec missing adversarial bindings')

		await expect(getAccount(genericBinding, account)).rejects.toThrow(
			'Nodely_AlgorandIndexer_Rest: expected canonical Algorand binding'
		)
		await expect(getAccount(foreignBinding, account)).rejects.toThrow(
			'Nodely_AlgorandIndexer_Rest: expected canonical Algorand binding'
		)
		expect(getJson).not.toHaveBeenCalled()
	})
})

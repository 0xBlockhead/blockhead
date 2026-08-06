import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	getAccount,
	getBigMap,
	getBlock,
	getContract,
	getCurrentStatistics,
	getHead,
	getToken,
	listAccountOperations,
	listAccountTokenBalances,
	listBlocks,
	listOperationsByHash,
	listTokens,
} from '$/sources/Tzkt/Rest/queries.ts'
import { sourceGetJson } from '$/sources/_runtime/http.ts'

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://api.tzkt.io/',
	sourceGetJson: vi.fn(),
}))

const sourceGetJsonMock = vi.mocked(sourceGetJson)

const account = {
	address: 'tz1account',
	type: 'user',
	balance: 1_000_000,
	firstLevel: 1,
	lastLevel: 10,
	firstActivity: '2024-01-01T00:00:00Z',
	lastActivity: '2024-01-02T00:00:00Z',
}

const block = {
	level: 1,
	timestamp: '2024-01-01T00:00:00Z',
	hash: 'BLockHash',
	cycle: 0,
	protocol: 'PsProtocol',
	baker: {
		address: 'tz1baker',
	},
}

const operation = {
	type: 'transaction',
	id: 1,
	level: 1,
	timestamp: '2024-01-01T00:00:00Z',
	hash: 'opHash',
	sender: {
		address: account.address,
	},
	target: {
		address: 'KT1contract',
	},
	status: 'applied',
	amount: 1,
}

const token = {
	id: 9,
	contract: {
		address: 'KT1token',
	},
	tokenId: '0',
	standard: 'fa2',
	metadata: {
		name: 'Example',
		decimals: '0',
	},
}

describe('TzKT REST fail-closed envelopes', () => {
	beforeEach(() => {
		sourceGetJsonMock.mockReset()
	})

	it('asserts account, block, head, and statistics envelopes', async () => {
		sourceGetJsonMock
			.mockResolvedValueOnce(account)
			.mockResolvedValueOnce(block)
			.mockResolvedValueOnce({
				chain: 'main',
				chainId: 'NetXdQprcVkpa',
				cycle: 1,
				level: 10,
				hash: 'BHead',
				protocol: 'PsProtocol',
				timestamp: '2024-01-02T00:00:00Z',
				synced: true,
			})
			.mockResolvedValueOnce({
				level: 10,
				timestamp: '2024-01-02T00:00:00Z',
				totalSupply: 1_000_000_000,
			})

		await expect(getAccount({ address: account.address })).resolves.toEqual(account)
		await expect(getBlock({ level: 1 })).resolves.toEqual(block)
		await expect(getHead()).resolves.toMatchObject({
			level: 10,
			synced: true,
		})
		await expect(getCurrentStatistics()).resolves.toMatchObject({
			totalSupply: 1_000_000_000,
		})
	})

	it('asserts contract, token, and operation list envelopes', async () => {
		sourceGetJsonMock
			.mockResolvedValueOnce({
				address: 'KT1contract',
				kind: 'smart_contract',
				balance: 0,
			})
			.mockResolvedValueOnce([token])
			.mockResolvedValueOnce([token])
			.mockResolvedValueOnce([operation])
			.mockResolvedValueOnce([operation])

		await expect(getContract({ address: 'KT1contract' })).resolves.toMatchObject({
			address: 'KT1contract',
		})
		await expect(getToken({
			contractAddress: 'KT1token',
			tokenId: 0,
		})).resolves.toEqual(token)
		await expect(listTokens({
			offset: 0,
			limit: 1,
		})).resolves.toEqual([token])
		await expect(listAccountOperations({
			address: account.address,
			offset: 0,
			limit: 1,
		})).resolves.toEqual([operation])
		await expect(listOperationsByHash({
			operationHash: 'opHash',
		})).resolves.toEqual([operation])
	})

	it('asserts bigmap and token-balance envelopes', async () => {
		sourceGetJsonMock
			.mockResolvedValueOnce({
				ptr: 1,
				contract: {
					address: 'KT1contract',
				},
				path: 'store',
				active: true,
				firstLevel: 1,
				lastLevel: 2,
				totalKeys: 1,
				activeKeys: 1,
				updates: 1,
			})
			.mockResolvedValueOnce([{
				id: 1,
				account: {
					address: account.address,
				},
				token,
				balance: '3',
				firstLevel: 1,
				lastLevel: 2,
				transfersCount: 1,
			}])
			.mockResolvedValueOnce([block])

		await expect(getBigMap({ bigMapId: 1 })).resolves.toMatchObject({
			ptr: 1,
			path: 'store',
		})
		await expect(listAccountTokenBalances({
			address: account.address,
			offset: 0,
			limit: 1,
		})).resolves.toHaveLength(1)
		await expect(listBlocks({
			offset: 0,
			limit: 1,
		})).resolves.toEqual([block])
	})

	it('fails closed on malformed envelopes and foreign account operations', async () => {
		sourceGetJsonMock.mockResolvedValueOnce({
			address: account.address,
			type: 'user',
			balance: -1,
			firstLevel: 1,
			lastLevel: 1,
			firstActivity: '2024-01-01T00:00:00Z',
			lastActivity: '2024-01-01T00:00:00Z',
		})
		await expect(getAccount({ address: account.address })).rejects.toThrow('invalid account response envelope')

		sourceGetJsonMock.mockResolvedValueOnce([{
			...operation,
			sender: {
				address: 'tz1foreign',
			},
			target: {
				address: 'KT1foreign',
			},
		}])
		await expect(listAccountOperations({
			address: account.address,
			offset: 0,
			limit: 1,
		})).rejects.toThrow('foreign row')

		sourceGetJsonMock.mockResolvedValueOnce({
			level: 1,
			timestamp: '2024-01-01T00:00:00Z',
			hash: '',
		})
		await expect(getBlock({ level: 1 })).rejects.toThrow('invalid block response envelope')
	})

	it('rejects empty addresses and invalid pages before transport', async () => {
		await expect(getAccount({ address: '' })).rejects.toThrow('must not be empty')
		await expect(listBlocks({
			offset: -1,
			limit: 1,
		})).rejects.toThrow('nonnegative safe integer')
		expect(sourceGetJsonMock).not.toHaveBeenCalled()
	})
})

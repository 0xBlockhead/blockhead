import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	getAccount,
	getBigMap,
	getBlock,
	getContract,
	getCoherentCurrentNetworkSnapshot,
	getCurrentStatistics,
	getDelegate,
	getHead,
	getToken,
	listAccountOperations,
	listAccountTokenBalances,
	listBlocks,
	listDelegates,
	listEntrypoints,
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
	firstActivity: 1,
	lastActivity: 10,
	firstActivityTime: '2024-01-01T00:00:00Z',
	lastActivityTime: '2024-01-02T00:00:00Z',
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

const delegate = {
	address: 'tz1baker',
	consensusAddress: 'tz1consensus',
	active: true,
	stakedBalance: 9_007_199_254_740_000,
	delegatedBalance: 7_000_000,
	ownDelegatedBalance: 2_000_000,
	votingPower: 9_007_199_254_740_001,
	lastActivity: 10,
	lastActivityTime: '2024-01-02T00:00:00Z',
}

const head = {
	chain: 'mainnet',
	chainId: 'NetXdQprcVkpaWU',
	cycle: 800,
	level: 5_000_000,
	hash: 'BLhead',
	protocol: 'PsPROTOCOL',
	timestamp: '2026-07-16T12:34:56Z',
	synced: true,
}

const statistics = {
	level: head.level,
	timestamp: head.timestamp,
	totalSupply: 1_000_000_000,
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

	it('rejects an account response for a different requested address', async () => {
		sourceGetJsonMock.mockResolvedValueOnce({
			...account,
			address: 'tz1different',
		})

		await expect(getAccount({ address: account.address })).rejects.toThrow(
			'TzKT account response does not match the subject'
		)
	})

	it('returns a coherent current network snapshot without retrying', async () => {
		sourceGetJsonMock
			.mockResolvedValueOnce(head)
			.mockResolvedValueOnce(statistics)
			.mockResolvedValueOnce(head)

		await expect(getCoherentCurrentNetworkSnapshot()).resolves.toEqual({
			head,
			statistics,
		})
		expect(sourceGetJsonMock).toHaveBeenCalledTimes(3)
	})

	it('retries a moving current network snapshot and fails after three races', async () => {
		const nextHead = {
			...head,
			level: head.level + 1,
			hash: 'BLnext',
		}
		const nextStatistics = {
			...statistics,
			level: nextHead.level,
		}
		sourceGetJsonMock
			.mockResolvedValueOnce(head)
			.mockResolvedValueOnce(nextStatistics)
			.mockResolvedValueOnce(nextHead)
			.mockResolvedValueOnce(nextHead)
			.mockResolvedValueOnce(nextStatistics)
			.mockResolvedValueOnce(nextHead)

		await expect(getCoherentCurrentNetworkSnapshot()).resolves.toEqual({
			head: nextHead,
			statistics: nextStatistics,
		})

		sourceGetJsonMock.mockReset()
		for (let attempt = 0; attempt < 3; attempt += 1)
			sourceGetJsonMock
				.mockResolvedValueOnce(head)
				.mockResolvedValueOnce(nextStatistics)
				.mockResolvedValueOnce(nextHead)

		await expect(getCoherentCurrentNetworkSnapshot()).rejects.toThrow(
			'current head and statistics did not reach a coherent level'
		)
		expect(sourceGetJsonMock).toHaveBeenCalledTimes(9)
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

	it('uses delegate detail and ranked baker list endpoints', async () => {
		sourceGetJsonMock
			.mockResolvedValueOnce(delegate)
			.mockResolvedValueOnce([delegate])

		await expect(getDelegate({ address: delegate.address })).resolves.toEqual(delegate)
		await expect(listDelegates({
			offset: 0,
			limit: 1,
		})).resolves.toEqual([delegate])
		expect(sourceGetJsonMock).toHaveBeenNthCalledWith(
			1,
			expect.anything(),
			'https://api.tzkt.io/v1/delegates/tz1baker'
		)
		expect(sourceGetJsonMock).toHaveBeenNthCalledWith(
			2,
			expect.anything(),
			'https://api.tzkt.io/v1/delegates?offset=0&limit=1&sort.desc=stakingBalance'
		)
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

	it('asserts contract entrypoint envelopes', async () => {
		sourceGetJsonMock.mockResolvedValueOnce([{
			name: 'transfer',
			jsonParameters: {
				prim: 'pair',
			},
			michelineParameters: {
				annots: [
					'%transfer',
				],
			},
		}])

		await expect(listEntrypoints({
			address: 'KT1contract',
		})).resolves.toEqual([{
			name: 'transfer',
			jsonParameters: {
				prim: 'pair',
			},
			michelineParameters: {
				annots: [
					'%transfer',
				],
			},
		}])
		expect(sourceGetJsonMock).toHaveBeenCalledWith(
			expect.anything(),
			'https://api.tzkt.io/v1/contracts/KT1contract/entrypoints?json=true&micheline=true'
		)
	})

	it('fails closed on malformed envelopes and foreign account operations', async () => {
		sourceGetJsonMock.mockResolvedValueOnce({
			address: account.address,
			type: 'user',
			balance: -1,
			firstLevel: 1,
			lastLevel: 1,
			firstActivity: 1,
			lastActivity: 1,
			firstActivityTime: '2024-01-01T00:00:00Z',
			lastActivityTime: '2024-01-01T00:00:00Z',
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

	it('rejects duplicate block hashes from a page', async () => {
		sourceGetJsonMock.mockResolvedValueOnce([
			block,
			block,
		])

		await expect(listBlocks({
			offset: 0,
			limit: 2,
		})).rejects.toThrow('TzKT blocks returned duplicate hashes')
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

	it('asserts listAccounts / listOperations / getBlockByHash envelopes', async () => {
		const {
			getBlockByHash,
			listAccounts,
			listOperations,
		} = await import('$/sources/Tzkt/Rest/queries.ts')

		sourceGetJsonMock
			.mockResolvedValueOnce([account])
			.mockResolvedValueOnce([operation])
			.mockResolvedValueOnce(block)

		await expect(listAccounts({
			offset: 0,
			limit: 1,
		})).resolves.toEqual([account])
		await expect(listOperations({
			offset: 0,
			limit: 1,
		})).resolves.toEqual([operation])
		await expect(getBlockByHash({
			hash: block.hash,
		})).resolves.toEqual(block)
	})

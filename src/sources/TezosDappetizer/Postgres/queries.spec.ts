import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	getBlockByHash,
	getBlockByLevel,
	getContract,
	getToken,
	listBlocks,
	listContracts,
	setTezosDappetizerSqlExecutor,
} from '$/sources/TezosDappetizer/Postgres/queries.ts'


const sqlExecutor = vi.fn()

describe('TezosDappetizer Postgres fail-closed envelopes', () => {
	beforeEach(() => {
		sqlExecutor.mockReset()
		setTezosDappetizerSqlExecutor(sqlExecutor)
	})

	it('asserts block / contract / token envelopes', async () => {
		sqlExecutor
			.mockResolvedValueOnce([
				{
					hash: 'BLockHash',
					predecessor: 'BPred',
					level: 1,
					timestamp: '2024-01-01T00:00:00Z',
				},
			])
			.mockResolvedValueOnce([
				{
					hash: 'BLockHash',
					predecessor: 'BPred',
					level: 1,
					timestamp: new Date('2024-01-01T00:00:00Z'),
				},
			])
			.mockResolvedValueOnce([
				{
					address: 'KT1contract',
					name: null,
					description: null,
					firstOperationGroupHash: 'opGroup',
					firstBlockHash: 'BLockHash',
				},
			])
			.mockResolvedValueOnce([
				{
					id: '0',
					contractAddress: 'KT1token',
					name: 'Example',
					symbol: 'EX',
					decimals: 0,
					firstOperationGroupHash: 'opGroup',
					firstBlockHash: 'BLockHash',
				},
			])

		await expect(getBlockByLevel({
			level: 1,
		})).resolves.toMatchObject({
			hash: 'BLockHash',
			level: 1,
		})
		await expect(getBlockByHash({
			hash: 'BLockHash',
		})).resolves.toMatchObject({
			level: 1,
		})
		await expect(getContract({
			address: 'KT1contract',
		})).resolves.toMatchObject({
			address: 'KT1contract',
		})
		await expect(getToken({
			contractAddress: 'KT1token',
			tokenId: 0n,
		})).resolves.toMatchObject({
			contractAddress: 'KT1token',
		})
	})

	it('rejects malformed block rows and page bounds', async () => {
		sqlExecutor.mockResolvedValueOnce([
			{
				hash: '',
				predecessor: 'BPred',
				level: 1,
				timestamp: '2024-01-01T00:00:00Z',
			},
		])

		await expect(getBlockByLevel({
			level: 1,
		})).rejects.toThrow('TezosDappetizer_Postgres: invalid block response envelope')

		await expect(listBlocks({
			offset: -1,
			limit: 10,
		})).rejects.toThrow('TezosDappetizer_Postgres: blocks offset must be a nonnegative safe integer')

		await expect(listContracts({
			offset: 0,
			limit: 0,
		})).rejects.toThrow('TezosDappetizer_Postgres: contracts limit must be a safe integer from 1 through 1000')
	})

	it('requires a configured SQL executor', async () => {
		setTezosDappetizerSqlExecutor(undefined)
		await expect(getBlockByLevel({
			level: 1,
		})).rejects.toThrow('TezosDappetizer_Postgres: SQL executor not configured')
	})
})

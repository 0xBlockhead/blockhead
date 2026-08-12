import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	getBlockByHash,
	getBlockByLevel,
	getContract,
	getToken,
	getTokenTransferAction,
	listBlocks,
	listContracts,
	listTokenBalances,
	listTokenTransferActions,
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

	it('returns only exact token-owned balances and transfers', async () => {
		const balance = {
			ownerAddress: 'tz1owner',
			amount: '42',
			operationGroupHash: 'opBalance',
			tokenId: '7',
			tokenContractAddress: 'KT1token',
			validFromBlockHash: 'BLockHash',
			validUntilBlockHash: null,
			level: 5,
			timestamp: '2024-01-01T00:00:00Z',
		}
		const transfer = {
			order: 3,
			type: 'transfer',
			operationGroupHash: 'opTransfer',
			amount: '42',
			fromAddress: 'tz1from',
			toAddress: 'tz1to',
			ownerAddress: null,
			blockHash: 'BLockHash',
			tokenId: '7',
			tokenContractAddress: 'KT1token',
			level: 5,
			timestamp: '2024-01-01T00:00:00Z',
		}
		sqlExecutor
			.mockResolvedValueOnce([balance])
			.mockResolvedValueOnce([transfer])
			.mockResolvedValueOnce([transfer])

		await expect(listTokenBalances({
			contractAddress: 'KT1token',
			tokenId: 7n,
			offset: 2,
			limit: 3,
		})).resolves.toEqual([balance])
		await expect(listTokenTransferActions({
			contractAddress: 'KT1token',
			tokenId: 7n,
			offset: 2,
			limit: 3,
		})).resolves.toEqual([transfer])
		await expect(getTokenTransferAction({
			transferId: 'opTransfer:3',
		})).resolves.toEqual(transfer)

		expect(sqlExecutor).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining('balance.token_contract_address = $1'),
			[
				'KT1token',
				'7',
				2,
				3,
			]
		)
		expect(sqlExecutor).toHaveBeenNthCalledWith(
			2,
			expect.stringContaining('action.token_contract_address = $1'),
			[
				'KT1token',
				'7',
				2,
				3,
			]
		)
		expect(sqlExecutor).toHaveBeenNthCalledWith(
			3,
			expect.stringContaining('action.operation_group_hash = $1'),
			[
				'opTransfer',
				3,
			]
		)
	})

	it('rejects token and transfer identity mismatches', async () => {
		sqlExecutor
			.mockResolvedValueOnce([
				{
					ownerAddress: 'tz1owner',
					amount: '42',
					operationGroupHash: 'opBalance',
					tokenId: '7',
					tokenContractAddress: 'KT1other',
					validFromBlockHash: 'BLockHash',
					validUntilBlockHash: null,
				},
			])
			.mockResolvedValueOnce([
				{
					order: 4,
					type: 'transfer',
					operationGroupHash: 'opTransfer',
					amount: '42',
					fromAddress: 'tz1from',
					toAddress: 'tz1to',
					ownerAddress: null,
					blockHash: 'BLockHash',
					tokenId: '7',
					tokenContractAddress: 'KT1token',
				},
			])

		await expect(listTokenBalances({
			contractAddress: 'KT1token',
			tokenId: 7n,
		})).rejects.toThrow('balance token does not match the subject')

		await expect(getTokenTransferAction({
			transferId: 'not-a-transfer',
		})).rejects.toThrow('invalid transfer id')
		await expect(getTokenTransferAction({
			transferId: 'opTransfer:3',
		})).rejects.toThrow('transfer response does not match the subject')
		expect(sqlExecutor).toHaveBeenCalledTimes(2)
	})

	it('requires a configured SQL executor', async () => {
		setTezosDappetizerSqlExecutor(undefined)
		await expect(getBlockByLevel({
			level: 1,
		})).rejects.toThrow('TezosDappetizer_Postgres: SQL executor not configured')
	})
})

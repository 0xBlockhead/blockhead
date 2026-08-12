import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { setTezosDappetizerSqlExecutor } from '$/sources/TezosDappetizer/Postgres/queries.ts'


const sqlExecutor = vi.fn()

const { default: dappetizerResolvers } = await import('$/resolvers/TezosDappetizer-Postgres.ts')

const blockResolver = dappetizerResolvers.resolvers.find((candidate) => (
	candidate.entityType === EntityType.TezosBlock
))

if (blockResolver == null)
	throw new Error('TezosDappetizer Postgres spec missing TezosBlock resolver')

const networkBlocksResolver = dappetizerResolvers.resolvers.find((candidate) => (
	candidate.entityType === EntityType.TezosNetwork
	&& '$$blocks' in candidate.projections
))

if (networkBlocksResolver == null)
	throw new Error('TezosDappetizer Postgres spec missing TezosNetwork.$$blocks resolver')

const contractResolver = dappetizerResolvers.resolvers.find((candidate) => (
	candidate.entityType === EntityType.TezosContract
))

if (contractResolver == null)
	throw new Error('TezosDappetizer Postgres spec missing TezosContract resolver')

const accountResolver = dappetizerResolvers.resolvers.find((candidate) => (
	candidate.entityType === EntityType.TezosAccount
	&& 'accountKind' in candidate.projections
))

if (accountResolver == null)
	throw new Error('TezosDappetizer Postgres spec missing TezosAccount resolver')

const tokenBalancesResolver = dappetizerResolvers.resolvers.find((candidate) => (
	candidate.entityType === EntityType.TezosToken
	&& '$$balanceTimestamps' in candidate.projections
))

if (tokenBalancesResolver == null)
	throw new Error('TezosDappetizer Postgres spec missing TezosToken.$$balanceTimestamps resolver')

const tokenTransfersResolver = dappetizerResolvers.resolvers.find((candidate) => (
	candidate.entityType === EntityType.TezosToken
	&& '$$transfers' in candidate.projections
))

if (tokenTransfersResolver == null)
	throw new Error('TezosDappetizer Postgres spec missing TezosToken.$$transfers resolver')

const tokenTransferResolver = dappetizerResolvers.resolvers.find((candidate) => (
	candidate.entityType === EntityType.TezosTokenTransfer
	&& 'amount' in candidate.projections
))

if (tokenTransferResolver == null)
	throw new Error('TezosDappetizer Postgres spec missing TezosTokenTransfer resolver')

const tezosNetwork = {
	$network: {
		slug: 'tezos',
	},
}

const context = {
	pagination: {
		limit: 100,
	},
	publicEnv: {},
}

describe('TezosDappetizer Postgres entity projections', () => {
	beforeEach(() => {
		sqlExecutor.mockReset()
		setTezosDappetizerSqlExecutor(sqlExecutor)
	})

	it('projects TezosBlock from framework block rows', async () => {
		sqlExecutor.mockResolvedValueOnce([
			{
				hash: 'BLockHash',
				predecessor: 'BPred',
				level: 42,
				timestamp: '2024-01-01T00:00:00Z',
			},
		])

		const resolve = blockResolver.resolve.NetworkLevel.resolve

		const block = await resolve({
			$network: tezosNetwork,
			level: 42n,
		}, context)

		expect(blockResolver.projections.hash(block)).toBe('BLockHash')
		expect(blockResolver.projections.level(block)).toBe(42n)
		expect(blockResolver.projections.predecessorHash(block)).toBe('BPred')
		expect(blockResolver.projections.timestampMs(block)).toBe(Date.parse('2024-01-01T00:00:00Z'))
	})

	it('projects Network.$$blocks list selectors', async () => {
		sqlExecutor.mockResolvedValueOnce([
			{
				hash: 'B1',
				predecessor: 'B0',
				level: 2,
				timestamp: '2024-01-02T00:00:00Z',
			},
		])

		const resolve = networkBlocksResolver.resolve.Network?.resolve
		if (resolve == null)
			throw new Error('missing Network resolve')

		const page = await resolve({
			$network: {
				slug: 'tezos',
			},
		}, context)

		const blocks = networkBlocksResolver.projections.$$blocks.select(page, {
			$network: {
				slug: 'tezos',
			},
		}, context)

		expect(blocks).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: {
						$network: {
							slug: 'tezos',
						},
					},
					level: 2n,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.TezosBlock, [], 'hash')]: 'B1',
					[entityFieldAddressKey(EntityType.TezosBlock, [], 'timestampMs')]: Date.parse('2024-01-02T00:00:00Z'),
					[entityFieldAddressKey(EntityType.TezosBlock, [], 'predecessorHash')]: 'B0',
				},
			},
		])
	})

	it('projects TezosContract and account kind from token-indexer evidence', async () => {
		sqlExecutor
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
					address: 'KT1contract',
				},
			])

		const resolveContract = contractResolver.resolve.NetworkAddress.resolve

		const contract = await resolveContract({
			$network: tezosNetwork,
			address: 'KT1contract',
		}, context)
		expect(contractResolver.projections.address(contract)).toBe('KT1contract')

		const resolveAccount = accountResolver.resolve.NetworkAddress.resolve

		const account = await resolveAccount({
			$network: tezosNetwork,
			address: 'KT1contract',
		}, context)
		expect(accountResolver.projections.accountKind(account)).toBe('contract')
	})

	it('rejects non-mainnet selectors', async () => {
		const resolve = blockResolver.resolve.NetworkLevel.resolve

		await expect(resolve({
			$network: {
				$network: {
					slug: 'ghostnet',
				},
			},
			level: 1n,
		}, context)).rejects.toThrow('TezosDappetizer_Postgres: unsupported network')
	})


	it('rejects settings chainId that is not Tezos mainnet', async () => {
		sqlExecutor.mockResolvedValueOnce([
			{
				chainId: 'NetXnHfVqm9iesp',
			},
		])

		const networkIdentity = dappetizerResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.TezosNetwork
			&& '$network' in candidate.projections
		))
		if (networkIdentity == null)
			throw new Error('missing TezosNetwork identity resolver')

		const resolve = networkIdentity.resolve.Network?.resolve
		if (resolve == null)
			throw new Error('missing Network resolve')

		await expect(resolve({
			$network: {
				slug: 'tezos',
			},
		}, context)).rejects.toThrow('settings chainId')
	})

	it('projects TezosToken.$$timestamps from first block metadata', async () => {
		const tokenTimestamps = dappetizerResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.TezosToken
			&& '$$timestamps' in candidate.projections
		))
		if (tokenTimestamps == null)
			throw new Error('missing TezosToken.$$timestamps resolver')

		sqlExecutor
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
			.mockResolvedValueOnce([
				{
					hash: 'BLockHash',
					predecessor: 'BPred',
					level: 7,
					timestamp: '2024-01-01T00:00:00Z',
				},
			])

		const resolve = tokenTimestamps.resolve.NetworkContractAddressTokenId?.resolve
		if (resolve == null)
			throw new Error('missing token timestamp resolve')

		const timestamps = await resolve({
			$network: tezosNetwork,
			contractAddress: 'KT1token',
			tokenId: 0n,
		}, context)

		expect(tokenTimestamps.projections.$$timestamps?.(timestamps)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$token: {
						$network: tezosNetwork,
						contractAddress: 'KT1token',
						tokenId: 0n,
					},
					level: 7n,
					source: Source.TezosDappetizer_Postgres,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.TezosToken_Timestamp, [], 'timestampMs')]: Date.parse('2024-01-01T00:00:00Z'),
					[entityFieldAddressKey(EntityType.TezosToken_Timestamp, [], 'name')]: 'Example',
					[entityFieldAddressKey(EntityType.TezosToken_Timestamp, [], 'symbol')]: 'EX',
					[entityFieldAddressKey(EntityType.TezosToken_Timestamp, [], 'decimals')]: 0,
				},
			},
		])
	})

	it('projects a native Tezos token balance and transfer lifecycle', async () => {
		const token = {
			$network: tezosNetwork,
			contractAddress: 'KT1token',
			tokenId: 7n,
		}
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

		const resolveBalances = tokenBalancesResolver.resolve.NetworkContractAddressTokenId?.resolve
		if (resolveBalances == null)
			throw new Error('missing TezosToken balance resolve')
		const balancePage = await resolveBalances(token, context)
		expect(tokenBalancesResolver.projections.$$balanceTimestamps.select(balancePage, token, context)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$account: {
						$network: tezosNetwork,
						address: 'tz1owner',
					},
					$token: token,
					level: 5n,
					source: Source.TezosDappetizer_Postgres,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.TezosTokenBalance_Timestamp, [], 'balance')]: 42n,
					[entityFieldAddressKey(EntityType.TezosTokenBalance_Timestamp, [], 'contractAddress')]: 'KT1token',
					[entityFieldAddressKey(EntityType.TezosTokenBalance_Timestamp, [], 'tokenId')]: 7n,
					[entityFieldAddressKey(EntityType.TezosTokenBalance_Timestamp, [], 'timestampMs')]: Date.parse('2024-01-01T00:00:00Z'),
				},
			},
		])

		const resolveTransfers = tokenTransfersResolver.resolve.NetworkContractAddressTokenId?.resolve
		if (resolveTransfers == null)
			throw new Error('missing TezosToken transfer resolve')
		const transferPage = await resolveTransfers(token, context)
		expect(tokenTransfersResolver.projections.$$transfers.select(transferPage, token, context)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: tezosNetwork,
					transferId: 'opTransfer:3',
					source: Source.TezosDappetizer_Postgres,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'amount')]: 42n,
					[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'transactionId')]: 'opTransfer',
				}),
			},
		])

		const resolveTransfer = tokenTransferResolver.resolve.NetworkTransferIdSource?.resolve
		if (resolveTransfer == null)
			throw new Error('missing TezosTokenTransfer resolve')
		await expect(resolveTransfer({
			$network: tezosNetwork,
			transferId: 'opTransfer:3',
			source: Source.TezosDappetizer_Postgres,
		}, context)).resolves.toEqual(expect.objectContaining({
			[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'amount')]: 42n,
			[entityFieldAddressKey(EntityType.TezosTokenTransfer, [], 'transactionId')]: 'opTransfer',
		}))

		await expect(resolveTransfer({
			$network: tezosNetwork,
			transferId: 'opTransfer:3',
			source: Source.TezosTzKt_Rest,
		}, context)).rejects.toThrow('unsupported transfer source')
	})

	it('registers TezosDappetizer_Postgres source', () => {
		expect(dappetizerResolvers.source).toBe(Source.TezosDappetizer_Postgres)
	})
})

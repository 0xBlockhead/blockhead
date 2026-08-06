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

		const resolve = blockResolver.resolve.NetworkLevel?.resolve
		if (resolve == null)
			throw new Error('missing NetworkLevel resolve')

		const block = await resolve({
			$network: tezosNetwork,
			level: 42n,
		}, context)

		expect(blockResolver.projections.hash?.(block)).toBe('BLockHash')
		expect(blockResolver.projections.level?.(block)).toBe(42n)
		expect(blockResolver.projections.predecessorHash?.(block)).toBe('BPred')
		expect(blockResolver.projections.timestampMs?.(block)).toBe(Date.parse('2024-01-01T00:00:00Z'))
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

		const resolveContract = contractResolver.resolve.NetworkAddress?.resolve
		if (resolveContract == null)
			throw new Error('missing contract NetworkAddress resolve')

		const contract = await resolveContract({
			$network: tezosNetwork,
			address: 'KT1contract',
		}, context)
		expect(contractResolver.projections.address?.(contract)).toBe('KT1contract')

		const resolveAccount = accountResolver.resolve.NetworkAddress?.resolve
		if (resolveAccount == null)
			throw new Error('missing account NetworkAddress resolve')

		const account = await resolveAccount({
			$network: tezosNetwork,
			address: 'KT1contract',
		}, context)
		expect(accountResolver.projections.accountKind?.(account)).toBe('contract')
	})

	it('rejects non-mainnet selectors', async () => {
		const resolve = blockResolver.resolve.NetworkLevel?.resolve
		if (resolve == null)
			throw new Error('missing NetworkLevel resolve')

		await expect(resolve({
			$network: {
				$network: {
					slug: 'ghostnet',
				},
			},
			level: 1n,
		}, context)).rejects.toThrow('TezosDappetizer_Postgres: unsupported network')
	})

	it('registers TezosDappetizer_Postgres source', () => {
		expect(dappetizerResolvers.source).toBe(Source.TezosDappetizer_Postgres)
	})
})

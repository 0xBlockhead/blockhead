import { readFileSync } from 'node:fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { HederaAccountSelector } from '$/schema/HederaAccount.ts'
import { HederaBlockSelector } from '$/schema/HederaBlock.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { SourceTargetKind } from '$/sources/SourceBinding.ts'
import {
	getAccount,
	getBlock,
	getBlocks,
} from '$/sources/HederaMirrorNode/Rest/queries.ts'
import type {
	HederaMirrorNodeAccount,
	HederaMirrorNodeBlock,
	HederaMirrorNodeBlocks,
} from '$/sources/HederaMirrorNode/Rest/types.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://mainnet-public.mirrornode.hedera.com',
	sourceFetch,
	sourceGetJson: async (_binding: unknown, url: string) => {
		const response = await sourceFetch(_binding, url)
		if (!response.ok)
			throw new Error(`HederaMirrorNode_Rest: HTTP ${String(response.status)}`)

		return response.json()
	},
}))

const { default: hederaMirrorNode } = await import('$/resolvers/HederaMirrorNode-Rest.ts')

const fixture = JSON.parse(readFileSync(
	new URL('../sources/HederaMirrorNode/Rest/fixtures/block.json', import.meta.url),
	'utf8'
)) satisfies HederaMirrorNodeBlock

const binding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((candidate) => (
		candidate.source === Source.HederaMirrorNode_Rest
		&& candidate.target.kind === SourceTargetKind.Caip2Network
		&& candidate.target.key === 'hedera:mainnet'
	))

if (binding == null)
	throw new Error('HederaMirrorNode_Rest spec missing source binding')

const network = {
	slug: 'hedera',
}

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

describe('Hedera Mirror Node block query', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('addresses a block selector without losing integer precision at the call site', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(fixture)))

		await expect(getBlock(binding, '77')).resolves.toEqual(fixture)
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://mainnet-public.mirrornode.hedera.com/api/v1/blocks/77'
		)
	})

	it('lists newest blocks through the registered proxy binding', async () => {
		const blocks = {
			blocks: [fixture],
			links: {
				next: null,
			},
		} satisfies HederaMirrorNodeBlocks
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(blocks)))

		await expect(getBlocks(binding, 16)).resolves.toEqual(blocks)
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://mainnet-public.mirrornode.hedera.com/api/v1/blocks?limit=16&order=desc'
		)
	})

	it('selects the one canonical Hedera mainnet binding', () => {
		expect(sourceProviderDefinitions
			.flatMap((provider) => provider.bindings)
			.filter((candidate) => (
				candidate.source === Source.HederaMirrorNode_Rest
				&& candidate.target.kind === SourceTargetKind.Caip2Network
				&& candidate.target.key === 'hedera:mainnet'
			))).toEqual([binding])
	})

	it('accepts documented hash selectors and rejects invalid selectors before transport', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(fixture)))

		await getBlock(binding, fixture.hash.slice(2))
		expect(sourceFetch.mock.calls[0][1]).toBe(
			`https://mainnet-public.mirrornode.hedera.com/api/v1/blocks/${fixture.hash.slice(2)}`
		)
		expect(() => getBlock(binding, 'hash/value')).toThrow('invalid block selector')
		expect(() => getBlock(binding, ' ')).toThrow('invalid block selector')
	})
})

describe('Hedera Mirror Node account query and resolver', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('addresses a canonical account ID through the registered binding', async () => {
		const account = {
			account: '0.0.98',
		} satisfies HederaMirrorNodeAccount
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(account)))

		await expect(getAccount(binding, account.account)).resolves.toEqual(account)
		expect(sourceFetch).toHaveBeenCalledWith(
			binding,
			'https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/0.0.98'
		)
	})

	it('rejects malformed account selectors before transport', () => {
		expect(() => getAccount(binding, '0.0.account')).toThrow('invalid account selector')
		expect(() => getAccount(binding, '0.0.1/path')).toThrow('invalid account selector')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('resolves only a matching Hedera mainnet account identity', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			account: '0.0.98',
		} satisfies HederaMirrorNodeAccount)))

		await expect(hederaMirrorNode.resolvers[0].resolve[
			HederaAccountSelector.NetworkAccountId
		].resolve({
			$network: network,
			accountId: '0.0.98',
		}, context)).resolves.toEqual({
			accountId: '0.0.98',
		})
		expect(Object.keys(hederaMirrorNode.resolvers[0].projections)).toEqual([
			'accountId',
		])

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			account: '0.0.99',
		} satisfies HederaMirrorNodeAccount)))
		await expect(hederaMirrorNode.resolvers[0].resolve[
			HederaAccountSelector.NetworkAccountId
		].resolve({
			$network: network,
			accountId: '0.0.98',
		}, context)).rejects.toThrow('response account does not match request')
	})

	it('rejects unsupported networks before account transport', async () => {
		await expect(hederaMirrorNode.resolvers[0].resolve[
			HederaAccountSelector.NetworkAccountId
		].resolve({
			$network: {
				slug: 'ethereum',
			},
			accountId: '0.0.98',
		}, context)).rejects.toThrow('unsupported network')
		expect(sourceFetch).not.toHaveBeenCalled()
	})
})

describe('Hedera Mirror Node block resolver', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('maps every owned Hedera block field from the typed fixture', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(fixture)))

		await expect(hederaMirrorNode.resolvers[2].resolve[
			HederaBlockSelector.NetworkBlockNumber
		].resolve({
			$network: network,
			blockNumber: 77n,
		}, context)).resolves.toEqual({
			blockNumber: 77n,
			blockHash: fixture.hash,
			consensusStartTimestamp: '1651560386.060890949',
			consensusEndTimestamp: '1651560386.661997287',
			gasUsed: 300000n,
			recordFileName: '2022-05-03T06_46_26.060890949Z.rcd',
			transactionCount: 3,
		})
		expect(Object.keys(hederaMirrorNode.resolvers[2].projections).sort()).toEqual([
			'blockHash',
			'blockNumber',
			'consensusEndTimestamp',
			'consensusStartTimestamp',
			'gasUsed',
			'recordFileName',
			'transactionCount',
		])
	})

	it('resolves block hashes case-insensitively and rejects mismatched responses', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(fixture)))
		await expect(hederaMirrorNode.resolvers[2].resolve[
			HederaBlockSelector.NetworkBlockHash
		].resolve({
			$network: network,
			blockHash: fixture.hash.slice(2).toUpperCase(),
		}, context)).resolves.toMatchObject({
			blockHash: fixture.hash,
		})

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			...fixture,
			number: 78,
		})))
		await expect(hederaMirrorNode.resolvers[2].resolve[
			HederaBlockSelector.NetworkBlockNumber
		].resolve({
			$network: network,
			blockNumber: 77n,
		}, context)).rejects.toThrow('response block does not match request')
	})

	it('rejects unsupported networks before transport', async () => {
		await expect(hederaMirrorNode.resolvers[2].resolve[
			HederaBlockSelector.NetworkBlockNumber
		].resolve({
			$network: {
				slug: 'ethereum',
			},
			blockNumber: 77n,
		}, context)).rejects.toThrow('unsupported network')
		expect(sourceFetch).not.toHaveBeenCalled()
	})

	it('fails closed on malformed integral wire fields', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			...fixture,
			gas_used: -1,
		})))
		await expect(hederaMirrorNode.resolvers[2].resolve[
			HederaBlockSelector.NetworkBlockNumber
		].resolve({
			$network: network,
			blockNumber: 77n,
		}, context)).rejects.toThrow('malformed gas used')
	})

	it('keeps a nullable wire gas total absent from the optional schema field', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			...fixture,
			gas_used: null,
		})))

		await expect(hederaMirrorNode.resolvers[2].resolve[
			HederaBlockSelector.NetworkBlockNumber
		].resolve({
			$network: network,
			blockNumber: 77n,
		}, context)).resolves.not.toHaveProperty('gasUsed')
	})
})

describe('Hedera Mirror Node network blocks resolver', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('materializes only mainnet block rows from the list operation', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			blocks: [fixture],
			links: {
				next: null,
			},
		} satisfies HederaMirrorNodeBlocks)))

		await expect(hederaMirrorNode.resolvers[1].resolve[
			NetworkSelector.Caip2
		].resolve({
			caip2: networkBySlug.hedera.caip2,
		}, {
			...context,
			pagination: {
				limit: 16,
			},
		})).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: {
						caip2: networkBySlug.hedera.caip2,
					},
					blockNumber: 77n,
				},
				blockNumber: 77n,
				blockHash: fixture.hash,
				consensusStartTimestamp: fixture.timestamp.from,
				consensusEndTimestamp: fixture.timestamp.to,
				gasUsed: 300000n,
				recordFileName: fixture.name,
				transactionCount: 3,
			},
		])
		expect(Object.keys(hederaMirrorNode.resolvers[1].projections)).toEqual([
			'Hedera',
		])
		expect(Object.keys(hederaMirrorNode.resolvers[1].projections.Hedera)).toEqual([
			'$$blocks',
		])
	})

	it('rejects non-Hedera CAIP-2 subjects before transport', async () => {
		await expect(hederaMirrorNode.resolvers[1].resolve[
			NetworkSelector.Caip2
		].resolve({
			caip2: networkBySlug.ethereum.caip2,
		}, context)).rejects.toThrow('unsupported network')
		expect(sourceFetch).not.toHaveBeenCalled()
	})
})

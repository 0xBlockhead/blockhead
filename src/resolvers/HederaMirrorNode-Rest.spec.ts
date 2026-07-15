import { readFileSync } from 'node:fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { HederaBlockSelector } from '$/schema/HederaBlock.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { Source } from '$/sources/Source.ts'
import { getBlock } from '$/sources/HederaMirrorNode/Rest/queries.ts'
import type { HederaMirrorNodeBlock } from '$/sources/HederaMirrorNode/Rest/types.ts'

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
	.find((candidate) => candidate.source === Source.HederaMirrorNode_Rest)

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

describe('Hedera Mirror Node block resolver', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('maps every owned Hedera block field from the typed fixture', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(fixture)))

		await expect(hederaMirrorNode.resolvers[0].resolve[
			HederaBlockSelector.NetworkBlockNumber
		]({
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
		expect(Object.keys(hederaMirrorNode.resolvers[0].projections).sort()).toEqual([
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
		await expect(hederaMirrorNode.resolvers[0].resolve[
			HederaBlockSelector.NetworkBlockHash
		]({
			$network: network,
			blockHash: fixture.hash.slice(2).toUpperCase(),
		}, context)).resolves.toMatchObject({
			blockHash: fixture.hash,
		})

		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			...fixture,
			number: 78,
		})))
		await expect(hederaMirrorNode.resolvers[0].resolve[
			HederaBlockSelector.NetworkBlockNumber
		]({
			$network: network,
			blockNumber: 77n,
		}, context)).rejects.toThrow('response block does not match request')
	})

	it('rejects unsupported networks before transport', async () => {
		await expect(hederaMirrorNode.resolvers[0].resolve[
			HederaBlockSelector.NetworkBlockNumber
		]({
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
		await expect(hederaMirrorNode.resolvers[0].resolve[
			HederaBlockSelector.NetworkBlockNumber
		]({
			$network: network,
			blockNumber: 77n,
		}, context)).rejects.toThrow('malformed gas used')
	})

	it('keeps a nullable wire gas total absent from the optional schema field', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify({
			...fixture,
			gas_used: null,
		})))

		await expect(hederaMirrorNode.resolvers[0].resolve[
			HederaBlockSelector.NetworkBlockNumber
		]({
			$network: network,
			blockNumber: 77n,
		}, context)).resolves.not.toHaveProperty('gasUsed')
	})
})

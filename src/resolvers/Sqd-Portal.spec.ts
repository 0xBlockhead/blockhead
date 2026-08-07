import { readFileSync } from 'node:fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import {
	getEvmBlock,
	getFinalizedHead,
	getHead,
} from '$/sources/Sqd/Portal/queries.ts'
import { SqdPortalResolution } from '$/sources/Sqd/Portal/types.ts'
import sqdPortal from '$/resolvers/Sqd-Portal.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://portal.sqd.dev/datasets/ethereum-mainnet',
	sourceFetch,
}))

const binding = {
	source: Source.SqdPortal_RawHttp,
	target: {
		kind: SourceTargetKind.Eip155Chain,
		key: '1',
	},
	endpoints: [{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
		corsEnabled: false,
	}],
	wireProtocol: WireProtocol.RawHttp,
	apiFamily: ApiFamily.SqdPortalStream,
	operationGroups: [SourceOperationGroup.GenericRead],
	delivery: SourceDelivery.HttpProxy,
	credentials: [],
} as const satisfies SourceBinding

const evmBlockNdjson = readFileSync(
	new URL('../sources/Sqd/Portal/fixtures/evm-block.ndjson', import.meta.url),
	'utf8'
)
const evmBlockHeaders = JSON.parse(readFileSync(
	new URL('../sources/Sqd/Portal/fixtures/evm-block-headers.json', import.meta.url),
	'utf8'
))
const evmBlockReorg = readFileSync(
	new URL('../sources/Sqd/Portal/fixtures/evm-block-reorg.json', import.meta.url),
	'utf8'
)
const finalizedHead = JSON.parse(readFileSync(
	new URL('../sources/Sqd/Portal/fixtures/finalized-head.json', import.meta.url),
	'utf8'
))
const head = JSON.parse(readFileSync(
	new URL('../sources/Sqd/Portal/fixtures/head.json', import.meta.url),
	'utf8'
))

const network = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
}
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 3,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const resolverFor = (entityType: string) => {
	const resolver = sqdPortal.resolvers.find((candidate) => candidate.entityType === entityType)
	if (resolver == null)
		throw new Error(`missing ${entityType} resolver`)
	return resolver
}

describe('SQD Portal query boundary', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('posts an inclusive explicit EVM block request and consumes NDJSON', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(evmBlockNdjson, {
			status: 200,
			headers: evmBlockHeaders,
		}))

		await expect(getEvmBlock(18_000_000n)).resolves.toMatchObject({
			resolution: SqdPortalResolution.Complete,
			block: {
				header: {
					number: 18_000_000,
					miner: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				},
			},
			finalizedHead: {
				number: 17_999_990,
				hash: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
			},
		})
		expect(JSON.parse(sourceFetch.mock.calls[0][2].body)).toMatchObject({
			type: 'evm',
			fromBlock: 18_000_000,
			toBlock: 18_000_000,
			includeAllBlocks: true,
			fields: {
				block: {
					hash: true,
					parentHash: true,
					miner: true,
					gasUsed: true,
					gasLimit: true,
					baseFeePerGas: true,
					blobGasUsed: true,
					excessBlobGas: true,
				},
				transaction: {
					hash: true,
				},
			},
		})
		expect(sourceFetch.mock.calls[0][0]).toMatchObject(binding)

		sourceFetch.mockResolvedValueOnce(new Response(
			evmBlockNdjson
				.replace('"blobGasUsed":"0x20000"', '"blobGasUsed":null')
				.replace('"excessBlobGas":"0x40000"', '"excessBlobGas":null'),
			{ status: 200 }
		))
		await expect(getEvmBlock(18_000_000n)).resolves.toMatchObject({
			resolution: SqdPortalResolution.Complete,
			block: {
				header: {
					blobGasUsed: null,
					excessBlobGas: null,
				},
			},
		})
	})

	it('reads arktype-fail-closed /finalized-head and /head', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(finalizedHead))
		await expect(getFinalizedHead()).resolves.toEqual(finalizedHead)
		expect(sourceFetch.mock.calls[0][1]).toBe('https://portal.sqd.dev/datasets/ethereum-mainnet/finalized-head')

		sourceFetch.mockResolvedValueOnce(Response.json(head))
		await expect(getHead()).resolves.toEqual(head)
		expect(sourceFetch.mock.calls[1][1]).toBe('https://portal.sqd.dev/datasets/ethereum-mainnet/head')

		sourceFetch.mockResolvedValueOnce(Response.json(null))
		await expect(getFinalizedHead()).rejects.toThrow('empty dataset')

		sourceFetch.mockResolvedValueOnce(Response.json({
			number: 1,
			hash: 'not-a-hash',
		}))
		await expect(getHead()).rejects.toThrow()

		sourceFetch.mockResolvedValueOnce(new Response('upstream unavailable', {
			status: 503,
			statusText: 'Service Unavailable',
		}))
		await expect(getFinalizedHead()).rejects.toThrow(/Fetch failed \(503/)
	})

	it('fail-closes malformed NDJSON block identity wires', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(
			evmBlockNdjson.replace(
				'"hash":"0x1111111111111111111111111111111111111111111111111111111111111111"',
				'"hash":"0x1111"'
			),
			{ status: 200 }
		))
		await expect(getEvmBlock(18_000_000n)).rejects.toThrow()
	})

	it('distinguishes complete empty, partial, and reorg responses', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(null, { status: 204 }))
		await expect(getEvmBlock(18_000_000n)).resolves.toEqual({
			resolution: SqdPortalResolution.Empty,
		})

		sourceFetch.mockResolvedValueOnce(new Response('', { status: 200 }))
		await expect(getEvmBlock(18_000_000n)).resolves.toEqual({
			resolution: SqdPortalResolution.Partial,
			blocks: [],
			nextBlock: 18_000_000,
		})

		sourceFetch.mockResolvedValueOnce(new Response(evmBlockReorg, { status: 409 }))
		await expect(getEvmBlock(18_000_000n, '0xparent')).resolves.toMatchObject({
			resolution: SqdPortalResolution.Reorg,
			previousBlocks: [{
				number: 17_999_999,
				hash: '0x3333333333333333333333333333333333333333333333333333333333333333',
			}],
		})
	})

	it('hard-fails non-OK Portal HTTP', async () => {
		sourceFetch.mockResolvedValueOnce(new Response('upstream unavailable', {
			status: 503,
			statusText: 'Service Unavailable',
		}))
		await expect(getEvmBlock(18_000_000n)).rejects.toThrow(/Fetch failed \(503/)
	})
})

describe('SQD Portal resolver', () => {
	it('maps every owned EVM block field and transaction selector', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(evmBlockNdjson, { status: 200 }))
		const block = await sqdPortal.resolvers[0].resolve['EvmNetworkBlockNumber'].resolve({
			$network: network,
			blockNumber: 18_000_000n,
		}, context)

		expect(block).toMatchObject({
			hash: '0x1111111111111111111111111111111111111111111111111111111111111111',
			parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
			timestamp: 1_693_066_895_000,
			gasUsed: 0xf7e9abn,
			gasLimit: 0x1c9c380n,
			baseFeePerGas: 0x3b9aca00n,
			blobGasUsed: 0x20000n,
			excessBlobGas: 0x40000n,
			transactionCount: 1,
			$miner: {
				[EntityMetaKey.Selector]: {
					address: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				},
			},
			$parent: {
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 17_999_999n,
				},
			},
			transactions: [{
				[EntityMetaKey.Selector]: {
					$network: network,
					txHash: '0x2222222222222222222222222222222222222222222222222222222222222222',
				},
			}],
		})
		expect(Object.keys(sqdPortal.resolvers[0].projections).sort()).toEqual([
			'$$transactions',
			'$miner',
			'$parent',
			'baseFeePerGas',
			'blobGasUsed',
			'excessBlobGas',
			'gasLimit',
			'gasUsed',
			'hash',
			'parentHash',
			'timestamp',
			'transactionCount',
		])
	})

	it('preserves a Slug network selector through transaction references', async () => {
		sourceFetch.mockResolvedValueOnce(new Response(evmBlockNdjson, { status: 200 }))
		const slugNetwork = {
			slug: 'ethereum',
		}
		const resolved = await sqdPortal.resolvers[0].resolve['EvmNetworkBlockNumber'].resolve({
			$network: slugNetwork,
			blockNumber: 18_000_000n,
		}, context)

		expect(resolved.transactions).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$network: slugNetwork,
			},
		}])
		expect(resolved.$parent).toMatchObject({
			[EntityMetaKey.Selector]: {
				$network: slugNetwork,
				blockNumber: 17_999_999n,
			},
		})
	})

	it('projects Network.Evm tip $$blocks / resolveCount / $$timestamps from /finalized-head', async () => {
		sourceFetch.mockResolvedValueOnce(Response.json(finalizedHead))
		const blocks = await resolverFor(EntityType.Network).resolve.Caip2.resolve(network, context)
		expect(blocks).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 17_999_990n,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 17_999_989n,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 17_999_988n,
				},
			},
		])

		sourceFetch.mockResolvedValueOnce(Response.json(finalizedHead))
		const countResolver = sqdPortal.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& resolver.projections.Evm?.$$blocks != null
			&& typeof resolver.projections.Evm.$$blocks === 'object'
			&& 'resolveCount' in resolver.projections.Evm.$$blocks
		))
		await expect(countResolver!.resolve.Caip2.resolve(network, context)).resolves.toBe(17_999_991)

		sourceFetch.mockResolvedValueOnce(Response.json(finalizedHead))
		const timestamps = await sqdPortal.resolvers.find((resolver) => (
			resolver.entityType === EntityType.Network
			&& resolver.projections.Evm?.$$timestamps != null
		))!.resolve.Caip2.resolve(network, context)
		expect(timestamps).toHaveLength(1)
		expect(timestamps[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$network: network,
				source: Source.SqdPortal_RawHttp,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EvmNetwork_Timestamp, [], 'blockHeight')]: 17_999_990n,
			},
		})

		sourceFetch.mockResolvedValueOnce(Response.json(finalizedHead))
		await expect(sqdPortal.resolvers.find((resolver) => (
			resolver.entityType === EntityType.EvmNetwork_Timestamp
		))!.resolve.NetworkTimestampMsSource.resolve({
			$network: network,
			timestampMs: 1_700_000_000_000,
			source: Source.SqdPortal_RawHttp,
		}, context)).resolves.toMatchObject({
			blockHeight: 17_999_990n,
		})
	})

	it('hard-fails unsupported networks and non-Complete Portal pages', async () => {
		await expect(sqdPortal.resolvers[0].resolve['EvmNetworkBlockNumber'].resolve({
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '8453',
				},
			},
			blockNumber: 18_000_000n,
		}, context)).rejects.toThrow('unsupported network')

		sourceFetch.mockResolvedValueOnce(new Response(null, { status: 204 }))
		await expect(sqdPortal.resolvers[0].resolve['EvmNetworkBlockNumber'].resolve({
			$network: network,
			blockNumber: 18_000_000n,
		}, context)).rejects.toThrow('Empty block')
	})
})

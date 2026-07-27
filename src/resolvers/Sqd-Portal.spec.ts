import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { getEvmBlock } from '$/sources/Sqd/Portal/queries.ts'
import { SqdPortalResolution } from '$/sources/Sqd/Portal/types.ts'
import sqdPortal from '$/resolvers/Sqd-Portal.ts'

const sourceFetch = vi.hoisted(() => vi.fn())
const resolverBinding = vi.hoisted(() => ({
	source: 'SqdPortal_RawHttp',
	target: {
		kind: 'Eip155Chain',
		key: '1',
	},
	endpoints: [{
		endpointKind: 'HttpUrl',
		locator: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
		origin: 'https://portal.sqd.dev',
		corsEnabled: false,
	}],
	wireProtocol: 'RawHttp',
	apiFamily: 'SqdPortalStream',
	operationGroups: ['GenericRead'],
	delivery: 'HttpProxy',
	credentials: [{ scope: 'None' }],
	proxyId: 'SqdPortal_RawHttp-284',
	artifacts: [{
		kind: 'HandwrittenTypes',
		path: 'src/sources/Sqd/Portal/types.ts',
		generated: false,
	}],
}))

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
		origin: 'https://portal.sqd.dev',
		corsEnabled: false,
	}],
	wireProtocol: WireProtocol.RawHttp,
	apiFamily: ApiFamily.SqdPortalStream,
	operationGroups: [SourceOperationGroup.GenericRead],
	delivery: SourceDelivery.HttpProxy,
	credentials: [{ scope: SourceCredentialScope.None }],
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

const network = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
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

describe('SQD Portal query boundary', () => {
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
				},
			},
			finalizedHead: {
				number: 17_999_990,
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
			transactions: [{
				[EntityMetaKey.Selector]: {
					$network: network,
					txHash: '0x2222222222222222222222222222222222222222222222222222222222222222',
				},
			}],
		})
		expect(Object.keys(sqdPortal.resolvers[0].projections).sort()).toEqual([
			'$$transactions',
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

	it('fails closed for an unsupported network', async () => {
		await expect(sqdPortal.resolvers[0].resolve['EvmNetworkBlockNumber'].resolve({
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: '8453',
				},
			},
			blockNumber: 18_000_000n,
		}, context)).rejects.toThrow('unsupported network')
	})
})

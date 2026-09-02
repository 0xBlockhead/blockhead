import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { Source } from '$/sources/Source.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://rpc.polkadot.io',
	sourceFetch,
}))

const { default: polkadot } = await import('$/resolvers/Polkadot-JsonRpc.ts')

const blockResolver = polkadot.resolvers.find((
	resolver
): resolver is Extract<
	typeof polkadot.resolvers[number],
	{ entityType: EntityType.PolkadotBlock }
> => resolver.entityType === EntityType.PolkadotBlock)

const networkBlockListResolver = polkadot.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Polkadot' in resolver.projections
	&& '$$blocks' in resolver.projections.Polkadot
	&& typeof resolver.projections.Polkadot.$$blocks === 'object'
	&& resolver.projections.Polkadot.$$blocks != null
	&& 'select' in resolver.projections.Polkadot.$$blocks
))

const networkBlockCountResolver = polkadot.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Polkadot' in resolver.projections
	&& '$$blocks' in resolver.projections.Polkadot
	&& typeof resolver.projections.Polkadot.$$blocks === 'object'
	&& resolver.projections.Polkadot.$$blocks != null
	&& 'resolveCount' in resolver.projections.Polkadot.$$blocks
))

const networkTimestampsResolver = polkadot.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& '$$timestamps' in resolver.projections
))

const networkRpcEndpointsResolver = polkadot.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Polkadot' in resolver.projections
	&& 'rpcEndpoints' in resolver.projections.Polkadot
))

if (
	blockResolver == null
	|| networkBlockListResolver == null
	|| networkBlockCountResolver == null
	|| networkTimestampsResolver == null
	|| networkRpcEndpointsResolver == null
)
	throw new Error('Polkadot JsonRpc resolvers are missing')

const network = {
	caip2: networkBySlug.polkadot.caip2,
}
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 2,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const jsonRpcResult = (
	result: unknown
) => (
	new Response(JSON.stringify({
		jsonrpc: '2.0',
		id: 1,
		result,
	}))
)

const header = {
	parentHash: '0xaaa1',
	number: '0xa',
	stateRoot: '0xbbb2',
	extrinsicsRoot: '0xccc3',
	digest: {
		logs: [],
	},
}

describe('Polkadot JsonRpc block leftovers', () => {
	beforeEach(() => {
		sourceFetch.mockReset()
	})

	it('projects the selected mainnet RPC endpoint with its transport and provider identity', async () => {
		const rpcEndpoints = await networkRpcEndpointsResolver.resolve.Slug.resolve({
			slug: 'polkadot',
		})

		expect(networkRpcEndpointsResolver.projections.Polkadot.rpcEndpoints(rpcEndpoints)).toEqual([
			{
				url: 'https://rpc.polkadot.io',
				transportType: TransportType.Http,
				providerName: 'Parity',
			},
		])
	})

	it('resolves NetworkBlockNumber via hash lookup', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonRpcResult('0xddd4'))
			.mockResolvedValueOnce(jsonRpcResult({
				block: {
					header,
					extrinsics: [
						'0x01',
						'0x02',
					],
				},
			}))

		const snapshot = await blockResolver.resolve.NetworkBlockNumber.resolve({
			$network: network,
			blockNumber: 10n,
		}, context)

		expect(blockResolver.projections.hash(snapshot)).toBe('0xddd4')
		const extrinsics = blockResolver.projections.$$extrinsics.select(snapshot)
		expect(extrinsics).toHaveLength(2)
		expect(blockResolver.projections.$$extrinsics.resolveCount(snapshot)).toBe(2)
		expect(extrinsics[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], 'hash')]: expect.stringMatching(/^0x[0-9a-f]{64}$/),
		})
		expect(extrinsics[0][EntityMetaKey.Fields]?.[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], 'hash')])
			.not.toBe(extrinsics[1][EntityMetaKey.Fields]?.[entityFieldAddressKey(EntityType.PolkadotExtrinsic, [], 'hash')])
		expect(blockResolver.projections.$parent(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				blockNumber: 9n,
				hash: '0xaaa1',
			},
		})
	})

	it('embeds finalized runtime and health state on the network observation read', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
		sourceFetch
			.mockResolvedValueOnce(jsonRpcResult('0xddd4'))
			.mockResolvedValueOnce(jsonRpcResult(header))
			.mockResolvedValueOnce(jsonRpcResult({
				block: {
					header,
					extrinsics: ['0x01'],
				},
			}))
			.mockResolvedValueOnce(jsonRpcResult({
				specName: 'polkadot',
				implName: 'parity-polkadot',
				authoringVersion: 0,
				specVersion: 1007001,
				implVersion: 0,
				transactionVersion: 26,
				stateVersion: 1,
			}))
			.mockResolvedValueOnce(jsonRpcResult({
				peers: 40,
				isSyncing: false,
				shouldHavePeers: true,
			}))

		const observations = await networkTimestampsResolver.resolve.Slug.resolve({
			slug: networkBySlug.polkadot.slug,
		}, context)
		expect(networkTimestampsResolver.projections.$$timestamps(observations)[0]?.[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Polkadot'], 'finalizedBlockNumber')]: 10n,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Polkadot'], 'finalizedBlockHash')]: '0xddd4',
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Polkadot'], 'finalizedExtrinsicCount')]: 1,
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Polkadot'], 'runtimeSpecName')]: 'polkadot',
			[entityFieldAddressKey(EntityType.Network_Timestamp, ['Polkadot'], 'peerCount')]: 40,
		})
		expect(polkadot.resolvers.some((resolver) => (
			resolver.entityType === EntityType.Network_Timestamp
		))).toBe(false)
	})

	it('resolves PolkadotExtrinsic.BlockIndexInBlock blake2-256 hash', async () => {
		const extrinsicResolver = polkadot.resolvers.find((
			resolver
		): resolver is Extract<
			typeof polkadot.resolvers[number],
			{ entityType: EntityType.PolkadotExtrinsic }
		> => resolver.entityType === EntityType.PolkadotExtrinsic)
		if (extrinsicResolver == null)
			throw new Error('Polkadot JsonRpc extrinsic resolver is missing')

		sourceFetch.mockResolvedValueOnce(jsonRpcResult({
			block: {
				header,
				extrinsics: [
					'0x01',
					'0x02',
				],
			},
		}))
		const snapshot = await extrinsicResolver.resolve.BlockIndexInBlock.resolve({
			$block: {
				$network: network,
				blockNumber: 10n,
				hash: '0xddd4',
			},
			indexInBlock: 1,
		}, context)
		expect(extrinsicResolver.projections.hash(snapshot)).toMatch(/^0x[0-9a-f]{64}$/)
	})

	it('counts blocks as finalized tip + 1', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonRpcResult('0xeeee'))
			.mockResolvedValueOnce(jsonRpcResult(header))

		const count = await networkBlockCountResolver.resolve.Slug.resolve(network, context)
		expect(
			(
				networkBlockCountResolver.projections.Polkadot.$$blocks as {
					resolveCount: (value: bigint) => bigint
				}
			).resolveCount(count)
		).toBe(11n)
	})

	it('lists an offset block page from finalized head', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonRpcResult('0xeeee'))
			.mockResolvedValueOnce(jsonRpcResult(header))
			.mockResolvedValueOnce(jsonRpcResult(`0x${'8'.repeat(64)}`))
			.mockResolvedValueOnce(jsonRpcResult(`0x${'7'.repeat(64)}`))

		const snapshot = await networkBlockListResolver.resolve.Slug.resolve(network, {
			...context,
			pagination: {
				limit: 2,
				offset: 2,
			},
		})
		expect(networkBlockListResolver.projections.Polkadot.$$blocks.select(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 8n,
					hash: `0x${'8'.repeat(64)}`,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 7n,
					hash: `0x${'7'.repeat(64)}`,
				},
			},
		])
		expect(networkBlockListResolver.projections.Polkadot.$$blocks.continuation(snapshot)).toEqual({
			operation: 'network-blocks',
			terminal: false,
			token: '6',
		})

		sourceFetch
			.mockResolvedValueOnce(jsonRpcResult('0xffff'))
			.mockResolvedValueOnce(jsonRpcResult({
				...header,
				number: '0xc',
			}))
			.mockResolvedValueOnce(jsonRpcResult(`0x${'6'.repeat(64)}`))
		const continuedSnapshot = await networkBlockListResolver.resolve.Slug.resolve(network, {
			...context,
			pagination: {
				limit: 1,
			},
			providerContinuationToken: '6',
		})
		expect(networkBlockListResolver.projections.Polkadot.$$blocks.select(continuedSnapshot)[0][EntityMetaKey.Selector]).toEqual({
			$network: network,
			blockNumber: 6n,
			hash: `0x${'6'.repeat(64)}`,
		})
		expect(networkBlockListResolver.projections.Polkadot.$$blocks.continuation(continuedSnapshot).token).toBe('5')
	})
})

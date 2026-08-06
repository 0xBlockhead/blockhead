import { beforeEach, describe, expect, it, vi } from 'vitest'

import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
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
	&& typeof resolver.projections.Polkadot.$$blocks === 'function'
))

const networkBlockCountResolver = polkadot.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Polkadot' in resolver.projections
	&& '$$blocks' in resolver.projections.Polkadot
	&& typeof resolver.projections.Polkadot.$$blocks === 'object'
	&& resolver.projections.Polkadot.$$blocks != null
	&& 'resolveCount' in resolver.projections.Polkadot.$$blocks
))

if (
	blockResolver == null
	|| networkBlockListResolver == null
	|| networkBlockCountResolver == null
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
		expect(blockResolver.projections.$$extrinsics(snapshot)).toHaveLength(2)
		expect(blockResolver.projections.$parent(snapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				blockNumber: 9n,
				hash: '0xaaa1',
			},
		})
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

	it('lists tip blocks from finalized head', async () => {
		sourceFetch
			.mockResolvedValueOnce(jsonRpcResult('0xeeee'))
			.mockResolvedValueOnce(jsonRpcResult(header))
			.mockResolvedValueOnce(jsonRpcResult('0xaaa1'))

		const snapshot = await networkBlockListResolver.resolve.Slug.resolve(network, context)
		expect(networkBlockListResolver.projections.Polkadot.$$blocks(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 10n,
					hash: '0xeeee',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					blockNumber: 9n,
					hash: '0xaaa1',
				},
			},
		])
	})
})

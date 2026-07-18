import { beforeEach, describe, expect, it, vi } from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { TezosBlockSelector } from '$/schema/TezosBlock.ts'
import { TezosNetworkSelector } from '$/schema/TezosNetwork.ts'

const { getJson } = vi.hoisted(() => ({
	getJson: vi.fn(),
}))

vi.mock('$/lib/http.ts', async (importOriginal) => ({
	...await importOriginal(),
	getJson,
}))

const { getBlock } = await import('$/sources/Tzkt/Rest/queries.ts')
const { default: tzktResolvers } = await import('$/resolvers/Tzkt-Rest.ts')

const networkResolver = tzktResolvers.resolvers.find((candidate) => (
	candidate.entityType === EntityType.TezosNetwork
	&& '$network' in candidate.projections
))

if (networkResolver == null)
	throw new Error('TzKT REST spec missing TezosNetwork identity resolver')

const blockResolver = tzktResolvers.resolvers.find((candidate) => (
	candidate.entityType === EntityType.TezosBlock
))

if (blockResolver == null)
	throw new Error('TzKT REST spec missing TezosBlock resolver')

describe('TzKT Tezos identity contract', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it.each([
		{ slug: 'tezos' },
		{
			caip2: {
				namespace: 'tezos',
				reference: 'NetXdQprcVkpaWU',
			},
		},
	])('accepts canonical mainnet selector $slug$caip2.reference', async ($network) => {
		await expect(networkResolver.resolve[TezosNetworkSelector.Network].resolve({
			$network,
		})).resolves.toEqual({
			$network: {
				[EntityMetaKey.Selector]: $network,
			},
		})
	})

	it.each([
		{ slug: 'tezos-ghostnet' },
		{ caip2: { namespace: 'tezos', reference: 'NetXnHfVqm9iesp' } },
		{ caip2: { namespace: 'eip155', reference: 'NetXdQprcVkpaWU' } },
		{ caip2: { namespace: 'tezos', reference: 'mainnet' } },
	])('rejects noncanonical selector $slug$caip2.namespace:$caip2.reference', async ($network) => {
		await expect(networkResolver.resolve[TezosNetworkSelector.Network].resolve({
			$network,
		})).rejects.toThrow('Tzkt_Rest: unsupported network')
	})
})

describe('TzKT block transport and resolver', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('parses the typed block endpoint', async () => {
		getJson.mockResolvedValueOnce({
			level: 5_000_000,
			timestamp: '2026-07-16T12:34:56Z',
			hash: 'BLzyx',
		})

		await expect(getBlock({
			restBaseUrl: 'https://api.tzkt.io/',
			level: 5_000_000n,
		})).resolves.toEqual({
			level: 5_000_000,
			timestamp: '2026-07-16T12:34:56Z',
			hash: 'BLzyx',
		})
		expect(getJson).toHaveBeenCalledWith(
			'https://api.tzkt.io/v1/blocks/5000000',
			{
				origins: [
					{
						origin: 'https://api.tzkt.io',
						corsEnabled: false,
					},
				],
			}
		)
	})

	it.each([
		{
			level: -1,
			timestamp: '2026-07-16T12:34:56Z',
			hash: 'BLzyx',
		},
		{
			level: 5_000_000.5,
			timestamp: '2026-07-16T12:34:56Z',
			hash: 'BLzyx',
		},
		{
			level: 5_000_000,
			timestamp: 1_752_666_096,
			hash: 'BLzyx',
		},
	])('rejects malformed block wire data', async (wire) => {
		getJson.mockResolvedValueOnce(wire)

		await expect(getBlock({
			restBaseUrl: 'https://api.tzkt.io',
			level: 5_000_000n,
		})).rejects.toThrow()
	})

	it('materializes provider-backed NetworkLevel fields', async () => {
		getJson.mockResolvedValueOnce({
			level: 5_000_000,
			timestamp: '2026-07-16T12:34:56Z',
			hash: 'BLzyx',
		})

		await expect(blockResolver.resolve[TezosBlockSelector.NetworkLevel].resolve({
			$network: {
				$network: {
					slug: 'tezos',
				},
			},
			level: 5_000_000n,
		})).resolves.toEqual({
			$network: {
				[EntityMetaKey.Selector]: {
					$network: {
						slug: 'tezos',
					},
				},
			},
			level: 5_000_000n,
			hash: 'BLzyx',
			timestampMs: Date.parse('2026-07-16T12:34:56Z'),
		})
	})

	it('rejects a non-Tezos parent before transport', async () => {
		await expect(blockResolver.resolve[TezosBlockSelector.NetworkLevel].resolve({
			$network: {
				$network: {
					slug: 'ethereum',
				},
			},
			level: 5_000_000n,
		})).rejects.toThrow('unsupported network')
		expect(getJson).not.toHaveBeenCalled()
	})

	it.each([
		-1n,
		BigInt(Number.MAX_SAFE_INTEGER) + 1n,
	])('rejects unsupported level %s before transport', async (level) => {
		await expect(blockResolver.resolve[TezosBlockSelector.NetworkLevel].resolve({
			$network: {
				$network: {
					slug: 'tezos',
				},
			},
			level,
		})).rejects.toThrow('unsupported block level')
		expect(getJson).not.toHaveBeenCalled()
	})

	it.each([
		{
			level: 4_999_999,
			timestamp: '2026-07-16T12:34:56Z',
			hash: 'BLzyx',
			error: 'does not match',
		},
		{
			level: 5_000_000,
			timestamp: 'not-a-timestamp',
			hash: 'BLzyx',
			error: 'invalid timestamp',
		},
		{
			level: 5_000_000,
			timestamp: '2026-07-16T12:34:56Z',
			hash: '   ',
			error: 'empty hash',
		},
	])('rejects inconsistent provider block data', async ({
		error,
		...wire
	}) => {
		getJson.mockResolvedValueOnce(wire)

		await expect(blockResolver.resolve[TezosBlockSelector.NetworkLevel].resolve({
			$network: {
				$network: {
					slug: 'tezos',
				},
			},
			level: 5_000_000n,
		})).rejects.toThrow(error)
	})
})

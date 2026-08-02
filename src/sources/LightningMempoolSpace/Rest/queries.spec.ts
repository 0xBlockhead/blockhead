import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/LightningMempoolSpace/bindings.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/_runtime/http.ts')>(),
	sourceGetJson,
}))

import {
	getLightningChannel,
	getLightningNode,
	getLightningNodeChannels,
	getLightningStatistics,
} from '$/sources/LightningMempoolSpace/Rest/queries.ts'
import lightningMempoolSpaceResolvers from '$/resolvers/LightningMempoolSpace-Rest.ts'

const binding = bindings[Source.LightningMempoolSpace_Rest][0]
const networkTimestampResolver = lightningMempoolSpaceResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.LightningNetwork_Timestamp
	&& 'nodeCount' in resolver.projections
))

if (networkTimestampResolver == null)
	throw new Error('LightningMempoolSpace_Rest spec missing network timestamp resolver')

const publicKey = `02${'a'.repeat(64)}`
const peerPublicKey = `03${'b'.repeat(64)}`

describe('mempool.space public Lightning graph queries', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('keeps network statistics lossless and tied to the canonical public endpoint', async () => {
		sourceGetJson.mockResolvedValue({
			latest: {
				added: '2026-07-22T00:00:00.000Z',
				node_count: 20_000,
				channel_count: 80_000,
				total_capacity: '5000000000000',
			},
		})

		await expect(getLightningStatistics()).resolves.toMatchObject({
			latest: {
				total_capacity: '5000000000000',
			},
		})
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://mempool.space/api/v1/lightning/statistics/latest'
		)
	})

	it('maps one binding-owned statistics response and rejects unsupported networks before transport', async () => {
		sourceGetJson.mockResolvedValue({
			latest: {
				added: '2026-07-22T00:00:00.000Z',
				node_count: 20_000,
				channel_count: 80_000,
				total_capacity: '5000000000000',
			},
		})
		const resolve = networkTimestampResolver.resolve[
			'LightningNetworkTimestampMsSource'
		].resolve
		const context = {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		}
		const snapshot = await resolve({
			$lightningNetwork: {
				$network: {
					slug: 'lightning',
				},
			},
			timestampMs: 1,
			source: Source.LightningMempoolSpace_Rest,
		}, context)

		expect(networkTimestampResolver.projections.nodeCount(snapshot)).toBe(20_000)
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://mempool.space/api/v1/lightning/statistics/latest'
		)

		sourceGetJson.mockClear()
		await expect(resolve({
			$lightningNetwork: {
				$network: {
					slug: 'bitcoin',
				},
			},
			timestampMs: 1,
			source: Source.LightningMempoolSpace_Rest,
		}, context)).rejects.toThrow('unsupported Lightning network')
		expect(sourceGetJson).not.toHaveBeenCalled()
	})

	it('rejects node identity substitution', async () => {
		sourceGetJson.mockResolvedValue({
			public_key: peerPublicKey,
			capacity: '100000000',
		})

		await expect(getLightningNode({
			binding,
			publicKey,
		})).rejects.toThrow('mismatched identity')
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			`https://mempool.space/api/v1/lightning/nodes/${publicKey}`
		)
	})

	it('loads an exact ten-row channel page with a validated peer identity', async () => {
		sourceGetJson.mockResolvedValue(Array.from({
			length: 10,
		}, (_, index) => ({
			id: String(index + 1),
			capacity: '1000000',
			node: {
				public_key: peerPublicKey,
			},
		})))

		await expect(getLightningNodeChannels({
			binding,
			publicKey,
			status: 'active',
			index: 20,
		})).resolves.toHaveLength(10)
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			`https://mempool.space/api/v1/lightning/channels?public_key=${publicKey}&status=active&index=20`
		)
	})

	it('rejects oversized or duplicate channel pages', async () => {
		sourceGetJson.mockResolvedValueOnce(Array.from({
			length: 11,
		}, (_, index) => ({
			id: String(index + 1),
		})))
		await expect(getLightningNodeChannels({
			binding,
			publicKey,
		})).rejects.toThrow('exceeds provider page size')

		sourceGetJson.mockResolvedValueOnce([
			{
				id: '1',
			},
			{
				id: '1',
			},
		])
		await expect(getLightningNodeChannels({
			binding,
			publicKey,
		})).rejects.toThrow('duplicate channel')
	})

	it('rejects channel identity substitution and lossy numeric capacity', async () => {
		sourceGetJson.mockResolvedValueOnce({
			id: '2',
		})
		await expect(getLightningChannel({
			binding,
			channelId: '1',
		})).rejects.toThrow('mismatched identity')

		sourceGetJson.mockResolvedValueOnce({
			id: '1',
			capacity: Number.MAX_SAFE_INTEGER + 1,
		})
		await expect(getLightningChannel({
			binding,
			channelId: '1',
		})).rejects.toThrow('invalid or lossy channel capacity')
	})
})

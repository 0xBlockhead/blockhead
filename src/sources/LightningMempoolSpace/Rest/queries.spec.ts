import { describe, expect, it, vi } from 'vitest'

import { lightningNetworkBySlug } from '$/constants/LightningNetwork.ts'
import * as http from '$/lib/http.ts'
import {
	getLightningChannel,
	getLightningNode,
	getLightningNodeChannels,
	getLightningStatistics,
} from '$/sources/LightningMempoolSpace/Rest/queries.ts'

const restBaseUrl = lightningNetworkBySlug.lightning.mempoolSpaceRestBaseUrl
const publicKey = `02${'a'.repeat(64)}`
const peerPublicKey = `03${'b'.repeat(64)}`

describe('mempool.space public Lightning graph queries', () => {
	it('keeps network statistics lossless and tied to the canonical public endpoint', async () => {
		vi.spyOn(http, 'getJson').mockResolvedValue({
			latest: {
				added: '2026-07-22T00:00:00.000Z',
				node_count: 20_000,
				channel_count: 80_000,
				total_capacity: '5000000000000',
			},
		})

		await expect(getLightningStatistics({
			restBaseUrl,
		})).resolves.toMatchObject({
			latest: {
				total_capacity: '5000000000000',
			},
		})
		await expect(getLightningStatistics({
			restBaseUrl: 'https://example.com/api/v1/lightning',
		})).rejects.toThrow('expected canonical Lightning API binding')
	})

	it('rejects node identity substitution', async () => {
		vi.spyOn(http, 'getJson').mockResolvedValue({
			public_key: peerPublicKey,
			capacity: '100000000',
		})

		await expect(getLightningNode({
			restBaseUrl,
			publicKey,
		})).rejects.toThrow('mismatched identity')
	})

	it('loads an exact ten-row channel page with a validated peer identity', async () => {
		vi.spyOn(http, 'getJson').mockResolvedValue(Array.from({
			length: 10,
		}, (_, index) => ({
			id: String(index + 1),
			capacity: '1000000',
			node: {
				public_key: peerPublicKey,
			},
		})))

		await expect(getLightningNodeChannels({
			restBaseUrl,
			publicKey,
			status: 'active',
			index: 20,
		})).resolves.toHaveLength(10)
		expect(http.getJson).toHaveBeenCalledWith(
			`${restBaseUrl}/channels?public_key=${publicKey}&status=active&index=20`,
			expect.anything()
		)
	})

	it('rejects oversized or duplicate channel pages', async () => {
		const getJson = vi.spyOn(http, 'getJson')
		getJson.mockResolvedValueOnce(Array.from({
			length: 11,
		}, (_, index) => ({
			id: String(index + 1),
		})))
		await expect(getLightningNodeChannels({
			restBaseUrl,
			publicKey,
		})).rejects.toThrow('exceeds provider page size')

		getJson.mockResolvedValueOnce([
			{
				id: '1',
			},
			{
				id: '1',
			},
		])
		await expect(getLightningNodeChannels({
			restBaseUrl,
			publicKey,
		})).rejects.toThrow('duplicate channel')
	})

	it('rejects channel identity substitution and lossy numeric capacity', async () => {
		const getJson = vi.spyOn(http, 'getJson')
		getJson.mockResolvedValueOnce({
			id: '2',
		})
		await expect(getLightningChannel({
			restBaseUrl,
			channelId: '1',
		})).rejects.toThrow('mismatched identity')

		getJson.mockResolvedValueOnce({
			id: '1',
			capacity: Number.MAX_SAFE_INTEGER + 1,
		})
		await expect(getLightningChannel({
			restBaseUrl,
			channelId: '1',
		})).rejects.toThrow('invalid or lossy channel capacity')
	})
})

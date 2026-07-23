import { describe, expect, it, vi } from 'vitest'

import * as http from '$/lib/http.ts'
import {
	getChannelInfo,
	getNetworkInfo,
	getNodeInfo,
} from '$/sources/LightningLnd/Rest/queries.ts'

const publicEnv = {
	PUBLIC_LND_MACAROON_HEX: 'macaroon',
}
const publicKey = `02${'a'.repeat(64)}`
const peerPublicKey = `03${'b'.repeat(64)}`

describe('LND authenticated public graph reads', () => {
	it('preserves network capacities as lossless decimal strings', async () => {
		vi.spyOn(http, 'getJson').mockResolvedValue({
			num_nodes: 20_000,
			num_channels: 80_000,
			total_network_capacity: '5000000000000',
			num_zombie_chans: '1000',
		})

		await expect(getNetworkInfo(publicEnv)).resolves.toMatchObject({
			total_network_capacity: '5000000000000',
		})
	})

	it('rejects node identity substitution and foreign channels', async () => {
		const getJson = vi.spyOn(http, 'getJson')
		getJson.mockResolvedValueOnce({
			node: {
				pub_key: peerPublicKey,
			},
		})
		await expect(getNodeInfo({
			publicEnv,
			publicKey,
		})).rejects.toThrow('mismatched identity')

		getJson.mockResolvedValueOnce({
			node: {
				pub_key: publicKey,
			},
			channels: [
				{
					channel_id: '1',
					node1_pub: peerPublicKey,
					node2_pub: `02${'c'.repeat(64)}`,
					capacity: '1000000',
				},
			],
		})
		await expect(getNodeInfo({
			publicEnv,
			publicKey,
			includeChannels: true,
		})).rejects.toThrow('foreign channel')
	})

	it('loads an exact public channel edge without numeric coercion', async () => {
		vi.spyOn(http, 'getJson').mockResolvedValue({
			channel_id: '123',
			node1_pub: publicKey,
			node2_pub: peerPublicKey,
			capacity: '9007199254740993',
		})

		await expect(getChannelInfo({
			publicEnv,
			channelId: '123',
		})).resolves.toMatchObject({
			capacity: '9007199254740993',
		})
	})
})

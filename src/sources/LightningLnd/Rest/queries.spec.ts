import { describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/LightningLnd/bindings.ts'
import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	SourceDelivery,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const sourceFetch = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: SourceBinding) => binding.endpoints[0]?.locator,
	sourceFetch,
}))
import {
	getChannelInfo,
	getNetworkInfo,
	getNodeInfo,
} from '$/sources/LightningLnd/Rest/queries.ts'

const binding = bindings[Source.LightningLnd_Rest][0]

const publicEnv = {
	PUBLIC_LND_MACAROON_HEX: 'macaroon',
}
const publicKey = `02${'a'.repeat(64)}`
const peerPublicKey = `03${'b'.repeat(64)}`

const respond = (body: unknown) => {
	sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(body)))
}

describe('LND authenticated public graph reads', () => {
	it('preserves network capacities as lossless decimal strings', async () => {
		respond({
			num_nodes: 20_000,
			num_channels: 80_000,
			total_network_capacity: '5000000000000',
			num_zombie_chans: '1000',
		})

		await expect(getNetworkInfo({
			publicEnv,
		})).resolves.toMatchObject({
			total_network_capacity: '5000000000000',
		})
	})

	it('rejects node identity substitution and foreign channels', async () => {
		respond({
			node: {
				pub_key: peerPublicKey,
			},
		})
		await expect(getNodeInfo({
			publicEnv,
			publicKey,
		})).rejects.toThrow('mismatched identity')

		respond({
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
		respond({
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

	it('fails closed when the graph edge has an unsafe update height', async () => {
		respond({
			channel_id: '123',
			node1_pub: publicKey,
			node2_pub: peerPublicKey,
			last_update: Number.MAX_SAFE_INTEGER + 1,
		})

		await expect(getChannelInfo({
			publicEnv,
			channelId: '123',
		})).rejects.toThrow('invalid channel last update')
	})
})

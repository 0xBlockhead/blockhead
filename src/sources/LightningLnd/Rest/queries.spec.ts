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
	getChannelBalance,
	getChannelInfo,
	getNetworkInfo,
	getNodeInfo,
	getWalletBalance,
} from '$/sources/LightningLnd/Rest/queries.ts'

const binding = bindings[Source.LightningLnd_Rest][0]

const publicKey = `02${'a'.repeat(64)}`
const peerPublicKey = `03${'b'.repeat(64)}`

const respond = (body: unknown) => {
	sourceFetch.mockResolvedValueOnce(new Response(JSON.stringify(body)))
}

describe('LND server-authenticated public graph reads', () => {
	it('preserves network capacities as lossless decimal strings', async () => {
		respond({
			num_nodes: 20_000,
			num_channels: 80_000,
			total_network_capacity: '5000000000000',
			num_zombie_chans: '1000',
		})

		await expect(getNetworkInfo()).resolves.toMatchObject({
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
			channelId: '123',
		})).rejects.toThrow('invalid channel edge envelope')
	})

	it('fail-closes list channels with lossy capacity and invalid funding points', async () => {
		const { listChannels } = await import('$/sources/LightningLnd/Rest/queries.ts')
		respond({
			channels: [{
				remote_pubkey: peerPublicKey,
				channel_point: 'txid:0',
				chan_id: '1',
				capacity: 'not-a-number',
			}],
		})
		await expect(listChannels()).rejects.toThrow('invalid list channels envelope')

		respond({
			channels: [{
				remote_pubkey: peerPublicKey,
				channel_point: 'missing-output',
				chan_id: '1',
				capacity: '1000',
			}],
		})
		await expect(listChannels()).rejects.toThrow('invalid channel funding point')
	})

	it('preserves wallet and channel balance sats as lossless decimal strings', async () => {
		respond({
			total_balance: '9007199254740993',
			confirmed_balance: '9007199254740993',
		})
		await expect(getWalletBalance()).resolves.toMatchObject({
			total_balance: '9007199254740993',
		})
		expect(sourceFetch).toHaveBeenLastCalledWith(
			binding,
			'https://127.0.0.1:8080/v1/balance/blockchain'
		)

		respond({
			local_balance: {
				sat: '12345678901234567890',
				msat: '12345678901234567890000',
			},
			pending_open_local_balance: {
				sat: '42',
			},
		})
		await expect(getChannelBalance()).resolves.toMatchObject({
			local_balance: {
				sat: '12345678901234567890',
			},
			pending_open_local_balance: {
				sat: '42',
			},
		})
		expect(sourceFetch).toHaveBeenLastCalledWith(
			binding,
			'https://127.0.0.1:8080/v1/balance/channels'
		)
	})

	it('fail-closes wallet and channel balance envelopes with lossy sats', async () => {
		respond({
			total_balance: '1.5',
		})
		await expect(getWalletBalance()).rejects.toThrow('invalid wallet balance envelope')

		respond({
			local_balance: {
				sat: 'not-a-number',
			},
		})
		await expect(getChannelBalance()).rejects.toThrow('invalid channel balance envelope')
	})
})

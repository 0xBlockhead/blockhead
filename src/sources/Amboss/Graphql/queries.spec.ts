import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Amboss/bindings.ts'
import { Source } from '$/sources/Source.ts'

const queryAmboss = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Amboss/Graphql/client.ts', async (importOriginal) => ({
	...await importOriginal(),
	queryAmboss,
}))

import {
	getEdge,
	getNode,
	getPopularNodePubkeys,
} from '$/sources/Amboss/Graphql/queries.ts'

const publicKey = `02${'a'.repeat(64)}`
const peerPublicKey = `03${'b'.repeat(64)}`
const binding = bindings[Source.Amboss_Graphql][0]

describe('Amboss public Lightning graph queries', () => {
	beforeEach(() => {
		queryAmboss.mockReset()
	})

	it('rejects node identity substitution', async () => {
		queryAmboss.mockResolvedValue({
			getNode: {
				graph_info: {
					node: {
						pub_key: peerPublicKey,
						alias: 'peer',
						color: '#000000',
						last_update: 1_700_000_000,
						addresses: [],
					},
					channels: null,
				},
			},
		})

		await expect(getNode({
			publicKey,
		})).rejects.toThrow('mismatched identity')
	})

	it('rejects node envelopes missing graph identity', async () => {
		queryAmboss.mockResolvedValue({
			getNode: {
				graph_info: {
					node: null,
					channels: null,
				},
			},
		})

		await expect(getNode({
			publicKey,
		})).rejects.toThrow('missing graph identity')
	})

	it('rejects lossy node capacity and empty addresses', async () => {
		queryAmboss.mockResolvedValue({
			getNode: {
				graph_info: {
					node: {
						pub_key: publicKey,
						alias: 'self',
						color: '#ffffff',
						last_update: 1_700_000_000,
						addresses: [
							{
								addr: '',
								ip_info: null,
							},
						],
					},
					channels: {
						num_channels: 2,
						total_capacity: '1.5',
					},
				},
			},
		})

		await expect(getNode({
			publicKey,
		})).rejects.toThrow('node address must not be empty')

		queryAmboss.mockResolvedValue({
			getNode: {
				graph_info: {
					node: {
						pub_key: publicKey,
						alias: 'self',
						color: '#ffffff',
						last_update: 1_700_000_000,
						addresses: [
							{
								addr: '1.2.3.4:9735',
								ip_info: null,
							},
						],
					},
					channels: {
						num_channels: 2,
						total_capacity: '1.5',
					},
				},
			},
		})

		await expect(getNode({
			publicKey,
		})).rejects.toThrow('invalid or lossy node capacity')
	})

	it('accepts either the exact long or short channel identity', async () => {
		queryAmboss.mockResolvedValue({
			getEdge: {
				long_channel_id: '123',
				short_channel_id: '1x2x3',
				graph: {
					info: {
						capacity: '1000000',
						is_closed: false,
						last_update: '1700000000',
						node1_pub: publicKey,
						node2_pub: peerPublicKey,
						node1_policy: null,
						node2_policy: null,
					},
				},
			},
		})

		await expect(getEdge({
			channelId: '1x2x3',
		})).resolves.toMatchObject({
			long_channel_id: '123',
			graph: {
				info: {
					capacity: '1000000',
				},
			},
		})
	})

	it('rejects channel envelopes missing graph identity or capacity', async () => {
		queryAmboss.mockResolvedValue({
			getEdge: {
				long_channel_id: '123',
				short_channel_id: '1x2x3',
				graph: null,
			},
		})

		await expect(getEdge({
			channelId: '123',
		})).rejects.toThrow('missing graph identity')

		queryAmboss.mockResolvedValue({
			getEdge: {
				long_channel_id: '123',
				short_channel_id: '1x2x3',
				graph: {
					info: {
						capacity: '1e6',
						is_closed: false,
						last_update: '1700000000',
						node1_pub: publicKey,
						node2_pub: peerPublicKey,
						node1_policy: null,
						node2_policy: null,
					},
				},
			},
		})

		await expect(getEdge({
			channelId: '123',
		})).rejects.toThrow('invalid or lossy channel capacity')
	})

	it('rejects mismatched channel identity', async () => {
		queryAmboss.mockResolvedValue({
			getEdge: {
				long_channel_id: '999',
				short_channel_id: '9x9x9',
				graph: {
					info: {
						capacity: '1000000',
						is_closed: false,
						last_update: '1700000000',
						node1_pub: publicKey,
						node2_pub: peerPublicKey,
						node1_policy: null,
						node2_policy: null,
					},
				},
			},
		})

		await expect(getEdge({
			channelId: '123',
		})).rejects.toThrow('mismatched identity')
	})

	it('rejects malformed or duplicate popular node identities', async () => {
		queryAmboss.mockResolvedValue({
			getPopularNodes: [
				publicKey,
				publicKey,
			],
		})

		await expect(getPopularNodePubkeys()).rejects.toThrow('duplicate public key')
	})

	it('keeps the Amboss GraphQL binding on the public API locator', () => {
		expect(binding.endpoints[0].locator).toBe('https://api.amboss.space/graphql')
	})
})

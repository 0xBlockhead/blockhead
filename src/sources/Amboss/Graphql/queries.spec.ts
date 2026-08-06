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
	getNodeChannels,
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
						chan_point: 'fundingtxid:0',
						node1_pub: publicKey,
						node2_pub: peerPublicKey,
						node1_policy: null,
						node2_policy: null,
						closed_info: null,
						transactions: {
							close_transaction: null,
						},
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
					chan_point: 'fundingtxid:0',
				},
			},
		})
	})

	it('fail-closes closed edges missing closed_info or with invalid closed_date', async () => {
		queryAmboss.mockResolvedValue({
			getEdge: {
				long_channel_id: '123',
				short_channel_id: '1x2x3',
				graph: {
					info: {
						capacity: '1000000',
						is_closed: true,
						last_update: '1700000000',
						chan_point: 'fundingtxid:0',
						node1_pub: publicKey,
						node2_pub: peerPublicKey,
						node1_policy: null,
						node2_policy: null,
						closed_info: null,
						transactions: {
							close_transaction: null,
						},
					},
				},
			},
		})
		await expect(getEdge({
			channelId: '123',
		})).rejects.toThrow('missing closed_info')

		queryAmboss.mockResolvedValue({
			getEdge: {
				long_channel_id: '123',
				short_channel_id: '1x2x3',
				graph: {
					info: {
						capacity: '1000000',
						is_closed: true,
						last_update: '1700000000',
						chan_point: 'fundingtxid:0',
						node1_pub: publicKey,
						node2_pub: peerPublicKey,
						node1_policy: null,
						node2_policy: null,
						closed_info: {
							close_transaction_id: 'closetxid',
							closed_date: 'not-a-date',
							closed_height: 1,
							closure_type: 'MUTUAL',
						},
						transactions: {
							close_transaction: {
								id: 'closetxid',
								fee: '1',
							},
						},
					},
				},
			},
		})
		await expect(getEdge({
			channelId: '123',
		})).rejects.toThrow('invalid channel closed_date')
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
						chan_point: 'fundingtxid:0',
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
						chan_point: 'fundingtxid:0',
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

	it('lists node channels fail-closed with ownership and funding checks', async () => {
		queryAmboss.mockResolvedValue({
			getNode: {
				graph_info: {
					channels: {
						num_channels: 1,
						channel_list: {
							list: [
								{
									long_channel_id: '123',
									short_channel_id: '1x2x3',
									chan_point: 'fundingtxid:0',
									capacity: '1000000',
									last_update: 1_700_000_000,
									node1_pub: publicKey,
									node2_pub: peerPublicKey,
								},
							],
							pagination: {
								limit: 10,
								offset: 0,
							},
						},
					},
				},
			},
		})

		await expect(getNodeChannels({
			publicKey,
			limit: 10,
		})).resolves.toMatchObject({
			num_channels: 1,
			channel_list: {
				list: [{
					long_channel_id: '123',
				}],
			},
		})

		queryAmboss.mockResolvedValue({
			getNode: {
				graph_info: {
					channels: {
						num_channels: 1,
						channel_list: {
							list: [
								{
									long_channel_id: '123',
									short_channel_id: '1x2x3',
									chan_point: 'bad',
									capacity: '1000000',
									last_update: 1_700_000_000,
									node1_pub: publicKey,
									node2_pub: peerPublicKey,
								},
							],
							pagination: {
								limit: 10,
								offset: 0,
							},
						},
					},
				},
			},
		})

		await expect(getNodeChannels({
			publicKey,
			limit: 10,
		})).rejects.toThrow('invalid channel funding point')
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

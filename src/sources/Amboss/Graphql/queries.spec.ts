import { describe, expect, it, vi } from 'vitest'

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
const binding = bindings[Source.Amboss_Graphql]

describe('Amboss public Lightning graph queries', () => {
	it('rejects node identity substitution', async () => {
		queryAmboss.mockResolvedValue({
			getNode: {
				graph_info: {
					node: {
						pub_key: peerPublicKey,
					},
				},
			},
		})

		await expect(getNode({
			publicKey,
		})).rejects.toThrow('mismatched identity')
	})

	it('accepts either the exact long or short channel identity', async () => {
		queryAmboss.mockResolvedValue({
			getEdge: {
				long_channel_id: '123',
				short_channel_id: '1x2x3',
				graph: {
					info: {
						node1_pub: publicKey,
						node2_pub: peerPublicKey,
					},
				},
			},
		})

		await expect(getEdge({
			channelId: '1x2x3',
		})).resolves.toMatchObject({
			long_channel_id: '123',
		})
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
})

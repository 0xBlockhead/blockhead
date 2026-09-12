import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	EntityMetaKey,
	entityFieldAddressKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const {
	getNode,
} = vi.hoisted(() => ({
	getNode: vi.fn(),
}))

vi.mock('$/sources/RadicleNode/Rest/queries.remote.ts', () => ({ getNode }))

const { default: resolverModule } = await import('$/resolvers/RadicleNode-Rest.ts')
const [nodeStateResolver, peerResolver] = resolverModule.resolvers

if (
	nodeStateResolver == null
	|| !('ConnectionIdNodeId' in nodeStateResolver.resolve)
	|| peerResolver == null
	|| !('NodePeerNodeId' in peerResolver.resolve)
)
	throw new Error('RadicleNode_Control resolvers are incomplete')

const nodeId = 'z6MksmpU5b1dS7oaqF2bHXhQi1DWy2hB7Mh9CuN7y1DN6QSz'
const peerNodeId = 'z6Mkmqogy2qEM2ummccUthFEaaHvyYmYBYh3dbe9W4ebScxo'
const $node = {
	connectionId: 'radicle-node',
	nodeId,
}
const node = {
	id: nodeId,
	observedAtMs: 1234,
	agent: '/radicle:1.10.1/',
	state: 'running',
	config: {
		alias: 'seed.radicle.dev',
		connect: [
			`${peerNodeId}@rosa.radicle.network:58776`,
		],
		peers: {
			type: 'dynamic',
		},
	},
}

beforeEach(() => {
	getNode.mockReset().mockResolvedValue(node)
})

describe('Radicle node canonical reads', () => {
	it('keeps one peer identity with every distinct configured address', async () => {
		getNode.mockResolvedValue({
			...node,
			config: {
				connect: [
					`${peerNodeId}@first.example:58776`,
					`${peerNodeId}@second.example:58776`,
					`${peerNodeId}@first.example:58776`,
				],
			},
		})
		const snapshot = await nodeStateResolver.resolve.ConnectionIdNodeId.resolve($node)
		const peer = await peerResolver.resolve.NodePeerNodeId.resolve({ $node, peerNodeId })
		expect(nodeStateResolver.projections.$$peers.resolveCount(snapshot)).toBe(1)
		expect(peer.addresses).toEqual(['first.example:58776', 'second.example:58776'])
		expect(nodeStateResolver.projections.$$peers.select(snapshot, $node)[0]?.[EntityMetaKey.Fields]).toEqual({
			[entityFieldAddressKey(EntityType.BlockheadRadiclePeer, [], 'addresses')]: peer.addresses,
		})
	})

	it('materializes verified node identity and configured connect peers', async () => {
		const snapshot = await nodeStateResolver.resolve.ConnectionIdNodeId.resolve($node)

		expect(nodeStateResolver.projections.connectionId()).toBe($node.connectionId)
		expect(nodeStateResolver.projections.nodeId(snapshot)).toBe(nodeId)
		expect(nodeStateResolver.projections.did(snapshot)).toBe(`did:key:${nodeId}`)
		expect(nodeStateResolver.projections.publicKey(snapshot)).toBe(nodeId)
		expect(nodeStateResolver.projections.$$peers.resolveCount(snapshot)).toBe(1)
		expect(nodeStateResolver.projections.$$peers.select(snapshot, $node)).toEqual([{
			[EntityMetaKey.Selector]: {
				$node,
				peerNodeId,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BlockheadRadiclePeer, [], 'addresses')]: ['rosa.radicle.network:58776'],
			},
		}])
		expect(snapshot).not.toHaveProperty('homePath')
		expect(snapshot).not.toHaveProperty('$$inventoryTimestamps')
		expect(snapshot).not.toHaveProperty('$$syncSessions')
		expect(nodeStateResolver.projections.$$timestamps.select(snapshot, $node)).toEqual([{
			[EntityMetaKey.Selector]: {
				$nodeState: $node,
				timestampMs: 1234,
				source: 'RadicleNode_Control',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BlockheadRadicleNodeState_Timestamp, [], 'alias')]: 'seed.radicle.dev',
				[entityFieldAddressKey(EntityType.BlockheadRadicleNodeState_Timestamp, [], 'nodeVersion')]: '/radicle:1.10.1/',
				[entityFieldAddressKey(EntityType.BlockheadRadicleNodeState_Timestamp, [], 'listenAddresses')]: [],
				[entityFieldAddressKey(EntityType.BlockheadRadicleNodeState_Timestamp, [], 'externalAddresses')]: [],
			},
		}])
		expect(getNode).toHaveBeenCalledWith()
	})

	it('resolves a configured peer without last-seen claims', async () => {
		const snapshot = await peerResolver.resolve.NodePeerNodeId.resolve({
			$node,
			peerNodeId,
		})

		expect(peerResolver.projections.$node(snapshot)).toEqual({
			[EntityMetaKey.Selector]: $node,
		})
		expect(snapshot.addresses).toEqual(['rosa.radicle.network:58776'])
		expect(snapshot).not.toHaveProperty('lastSeenMs')
		expect(snapshot).not.toHaveProperty('remoteDid')
		expect(snapshot).not.toHaveProperty('connectionKind')
	})

	it('preserves a valid empty connect list', async () => {
		getNode.mockResolvedValueOnce({
			...node,
			config: {
				...node.config,
				connect: [],
			},
		})

		const snapshot = await nodeStateResolver.resolve.ConnectionIdNodeId.resolve($node)

		expect(nodeStateResolver.projections.$$peers.select(snapshot, $node)).toEqual([])
		expect(nodeStateResolver.projections.$$peers.resolveCount(snapshot)).toBe(0)
	})

	it('rejects unsupported connections before reading the node', async () => {
		await expect(nodeStateResolver.resolve.ConnectionIdNodeId.resolve({
			connectionId: 'other-node',
			nodeId,
		})).rejects.toThrow('RadicleNode_Control: unsupported connection other-node')
		expect(getNode).not.toHaveBeenCalled()
	})

	it('rejects a requested node that does not match the configured node', async () => {
		getNode.mockResolvedValueOnce({
			...node,
			id: 'different-node',
		})

		await expect(nodeStateResolver.resolve.ConnectionIdNodeId.resolve($node)).rejects.toThrow('RadicleNode_Control: local node different-node does not match ' + nodeId)
	})

	it('rejects an absent peer identity', async () => {
		await expect(peerResolver.resolve.NodePeerNodeId.resolve({
			$node,
			peerNodeId: 'missing-peer',
		})).rejects.toThrow('RadicleNode_Control: peer not found for missing-peer')
	})
})

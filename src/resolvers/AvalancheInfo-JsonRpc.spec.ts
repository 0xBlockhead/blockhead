import {
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'

const jsonRpc2 = vi.hoisted(() => vi.fn())

vi.mock('$/lib/http.ts', () => ({
	corsFetch: vi.fn(),
	throwHttpError: vi.fn(),
}))

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const { default: avalancheInfo } = await import('$/resolvers/AvalancheInfo-JsonRpc.ts')

beforeEach(() => {
	jsonRpc2.mockReset()
})

const context = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const findResolver = (entityType: EntityType) => avalancheInfo.resolvers.find((resolver) => (
	resolver.entityType === entityType
))
const nodeStateResolver = findResolver(EntityType.BlockheadAvalancheNodeState)
if (nodeStateResolver == null)
	throw new Error('AvalancheInfo_JsonRpc spec missing node-state resolvers')

it('projects enrolled BlockheadAvalancheNodeState fields from Info node id + version', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
			nodeID: 'NodeID-local',
			nodePOP: {
				publicKey: '0xabc',
				proofOfPossession: '0xdef',
			},
		})
		.mockResolvedValueOnce({
			networkName: 'mainnet',
		})
		.mockResolvedValueOnce({
			version: 'avalanchego/1.14.2',
			databaseVersion: 'v1.4.5',
			rpcProtocolVersion: '45',
			gitCommit: 'abc',
			vmVersions: {
				platform: 'avalanchego/1.14.2',
			},
		})
		.mockResolvedValueOnce({
			numPeers: '3',
			peers: [],
		})
		.mockResolvedValueOnce({
			rewardingStakePercentage: '99',
			weightedAveragePercentage: '99.5',
		})

	const nodeState = await nodeStateResolver.resolve.NodeId.resolve({
		nodeId: 'NodeID-local',
	}, context)

	expect(nodeState.nodePopPublicKey).toBe('0xabc')
	expect(nodeState.$$timestamps).toHaveLength(1)
	expect(nodeState.$$timestamps[0][EntityMetaKey.Fields]).toMatchObject({
		[entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'nodeVersion')]: 'avalanchego/1.14.2',
		[entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'connectedPeerCount')]: 3,
		[entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'uptimePercent')]: 99.5,
	})
})

it('materializes best-effort node observations without arbitrary timestamp replay', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
			nodeID: 'NodeID-local',
		})
		.mockResolvedValueOnce({
			networkName: 'mainnet',
		})
		.mockResolvedValueOnce({
			version: 'avalanchego/1.14.2',
			databaseVersion: 'v1.4.5',
			rpcProtocolVersion: '45',
			gitCommit: 'abc',
			vmVersions: {
				platform: 'avalanchego/1.14.2',
			},
		})
		.mockResolvedValueOnce({
			numPeers: '3',
			peers: [],
		})
		.mockRejectedValueOnce(new Error('method missing'))

	const nodeState = await nodeStateResolver.resolve.NodeId.resolve({
		nodeId: 'NodeID-local',
	}, context)

	expect(nodeState.$$timestamps[0][EntityMetaKey.Fields]).toMatchObject({
		[entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'networkName')]: 'mainnet',
		[entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'connectedPeerCount')]: 3,
	})
	expect(nodeState.$$timestamps[0][EntityMetaKey.Fields]).not.toHaveProperty(
		entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'uptimePercent')
	)
	expect(findResolver(EntityType.BlockheadAvalancheNodeState_Timestamp)).toBeUndefined()
})

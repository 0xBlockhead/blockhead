import {
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'
import { EntityMetaKey, entityFieldAddressKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

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

const nodeStateResolver = avalancheInfo.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadAvalancheNodeState
))
const nodeStateTimestampResolver = avalancheInfo.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BlockheadAvalancheNodeState_Timestamp
))

if (nodeStateResolver == null || nodeStateTimestampResolver == null)
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

	const nodeState = await nodeStateResolver.resolve.NodeId.resolve({
		nodeId: 'NodeID-local',
	}, context)

	expect(nodeState.nodePopPublicKey).toBe('0xabc')
	expect(nodeState.$$timestamps).toHaveLength(1)
	expect(nodeState.$$timestamps[0][EntityMetaKey.Fields]).toMatchObject({
		[entityFieldAddressKey(EntityType.BlockheadAvalancheNodeState_Timestamp, [], 'nodeVersion')]: 'avalanchego/1.14.2',
	})
})

it('projects node-state observations including peer count when uptime is unavailable', async () => {
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

	const observation = await nodeStateTimestampResolver.resolve.NodeStateTimestampMsSource.resolve({
		$nodeState: {
			nodeId: 'NodeID-local',
		},
		timestampMs: 1,
		source: Source.AvalancheInfo_JsonRpc,
	}, context)

	expect(observation.connectedPeerCount).toBe(3)
	expect(observation.uptimePercent).toBeUndefined()
	expect(observation.networkName).toBe('mainnet')
})

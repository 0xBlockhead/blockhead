import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { entityFieldAddressKey, EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getAllDynamicInfo = vi.hoisted(() => vi.fn())
const getAllMetagraphs = vi.hoisted(() => vi.fn())
const getBlock = vi.hoisted(() => vi.fn())
const getDynamicInfo = vi.hoisted(() => vi.fn())
const getFinalizedHead = vi.hoisted(() => vi.fn())
const getHeader = vi.hoisted(() => vi.fn())
const getMetagraph = vi.hoisted(() => vi.fn())
const getNeuronLite = vi.hoisted(() => vi.fn())
const getNeuronsLite = vi.hoisted(() => vi.fn())
const getRuntimeVersion = vi.hoisted(() => vi.fn())
const getSubnetsInfo = vi.hoisted(() => vi.fn())
const getSubnetHyperparams = vi.hoisted(() => vi.fn())
const getSubnetInfo = vi.hoisted(() => vi.fn())
const getSystemHealth = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Bittensor/JsonRpc/queries.ts', () => ({
	getAllDynamicInfo,
	getAllMetagraphs,
	getBlock,
	getDynamicInfo,
	getFinalizedHead,
	getHeader,
	getMetagraph,
	getNeuronLite,
	getNeuronsLite,
	getRuntimeVersion,
	getSubnetsInfo,
	getSubnetHyperparams,
	getSubnetInfo,
	getSystemHealth,
}))

const { default: bittensor } = await import('$/resolvers/Bittensor-JsonRpc.ts')

const network = {
	slug: 'bittensor',
}
const subnet = {
	$network: network,
	netuid: 1,
}
const context = {
	filters: [],
	sorts: [],
	pagination: {
		limit: 3,
	},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const finalizedBlockHash = `0x${'b'.repeat(64)}`
const finalizedBlockNumber = 42n

const subnetTipResolver = bittensor.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BittensorSubnet
	&& 'subnetInfoByteLength' in resolver.projections
	&& '$$metagraphTimestamps' in resolver.projections
))
const neuronTipResolver = bittensor.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BittensorNeuron
))
const subnetNeuronsResolver = bittensor.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BittensorSubnet
	&& '$$neurons' in resolver.projections
))
const networkSubnetsResolver = bittensor.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BittensorNetwork
	&& '$$subnets' in resolver.projections
))
const bittensorNetworkTimestampsResolver = bittensor.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BittensorNetwork
	&& '$$timestamps' in resolver.projections
))
const networkTimestampsResolver = bittensor.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Bittensor' in resolver.projections
	&& '$$timestamps' in resolver.projections.Bittensor
))

if (
	subnetTipResolver == null
	|| neuronTipResolver == null
	|| subnetNeuronsResolver == null
	|| networkSubnetsResolver == null
	|| bittensorNetworkTimestampsResolver == null
	|| networkTimestampsResolver == null
)
	throw new Error('Bittensor-JsonRpc spec missing resolvers')

describe('Bittensor-JsonRpc subnet/neuron tip deepen', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		getFinalizedHead.mockResolvedValue(finalizedBlockHash)
		getHeader.mockResolvedValue({
			number: finalizedBlockNumber.toString(),
		})
		getRuntimeVersion.mockResolvedValue({
			specName: 'node-subtensor',
			specVersion: 268,
			implVersion: 1,
		})
		getSystemHealth.mockResolvedValue({
			peers: 12,
			isSyncing: false,
			shouldHavePeers: true,
		})
		getSubnetsInfo.mockResolvedValue([1, 2, 3])
		getAllMetagraphs.mockResolvedValue(new Array(30).fill(8))
		getSubnetInfo.mockResolvedValue([1, 2, 3])
		getDynamicInfo.mockResolvedValue([4, 5])
		getSubnetHyperparams.mockResolvedValue([6])
		getMetagraph.mockResolvedValue(new Array(20).fill(7))
		// SCALE compact length 5 (mode 0 → byte = 5 << 2 = 20)
		getNeuronsLite.mockResolvedValue([20, 0, 0, 0])
		getNeuronLite.mockResolvedValue([9, 8, 7])
		// SCALE compact length 4 (mode 0 → byte = 4 << 2 = 16)
		getAllDynamicInfo.mockResolvedValue([16, 1, 2, 3])
	})

	it('does not register direct Bittensor timestamp replay resolvers', () => {
		expect(bittensor.resolvers.some((resolver) => (
			resolver.entityType === EntityType.BittensorNetwork_Timestamp
		))).toBe(false)
		expect(bittensor.resolvers.some((resolver) => (
			resolver.entityType === EntityType.BittensorMetagraph_Timestamp
		))).toBe(false)
	})

	it('embeds finalized-head network observation fields on one parent read', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
		const snapshot = await bittensorNetworkTimestampsResolver.resolve.Network.resolve({
			$network: network,
		}, context)
		const observation = bittensorNetworkTimestampsResolver.projections.$$timestamps(snapshot)[0]
		const fields = observation[EntityMetaKey.Fields]

		expect(getFinalizedHead).toHaveBeenCalledTimes(1)
		expect(getRuntimeVersion).toHaveBeenCalledTimes(1)
		expect(getSystemHealth).toHaveBeenCalledTimes(1)
		expect(getSubnetsInfo).toHaveBeenCalledWith({
			blockHash: finalizedBlockHash,
		})
		expect(getAllDynamicInfo).toHaveBeenCalledWith({
			blockHash: finalizedBlockHash,
		})
		expect(getAllMetagraphs).toHaveBeenCalledWith({
			blockHash: finalizedBlockHash,
		})
		expect(getHeader).toHaveBeenCalledWith({
			blockHash: finalizedBlockHash,
		})
		expect(observation[EntityMetaKey.Selector]).toEqual({
			$network: network,
			timestampMs: 1_700_000_000_000,
			source: Source.Bittensor_JsonRpc,
		})
		expect(fields).toMatchObject({
			[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'finalizedBlockHash')]: finalizedBlockHash,
			[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'finalizedBlockNumber')]: finalizedBlockNumber,
			[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'runtimeSpecName')]: 'node-subtensor',
			[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'runtimeSpecVersion')]: 268,
			[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'runtimeImplVersion')]: 1,
			[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'peerCount')]: 12,
			[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'isSyncing')]: false,
			[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'shouldHavePeers')]: true,
			[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'subnetCount')]: 4,
			[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'subnetsInfoByteLength')]: 3,
			[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'dynamicInfoByteLength')]: 4,
			[entityFieldAddressKey(EntityType.BittensorNetwork_Timestamp, [], 'metagraphsByteLength')]: 30,
		})

		const networkSnapshot = await networkTimestampsResolver.resolve.Slug.resolve(network, context)
		expect(
			networkTimestampsResolver.projections.Bittensor.$$timestamps(networkSnapshot)[0][EntityMetaKey.Fields]
		).toEqual(fields)
	})

	it('pins subnet tip payloads and metagraph observations to the finalized head', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)
		const snapshot = await subnetTipResolver.resolve.NetworkNetuid.resolve(subnet, context)
		const metagraphObservation = subnetTipResolver.projections.$$metagraphTimestamps.select?.(snapshot)[0]

		expect(getFinalizedHead).toHaveBeenCalledTimes(1)
		expect(getSubnetInfo).toHaveBeenCalledWith({
			netuid: 1,
			blockHash: finalizedBlockHash,
		})
		expect(getDynamicInfo).toHaveBeenCalledWith({
			netuid: 1,
			blockHash: finalizedBlockHash,
		})
		expect(getSubnetHyperparams).toHaveBeenCalledWith({
			netuid: 1,
			blockHash: finalizedBlockHash,
		})
		expect(getMetagraph).toHaveBeenCalledWith({
			netuid: 1,
			blockHash: finalizedBlockHash,
		})
		expect(getNeuronsLite).toHaveBeenCalledWith({
			netuid: 1,
			blockHash: finalizedBlockHash,
		})
		expect(subnetTipResolver.projections.subnetInfoByteLength(snapshot)).toBe(3)
		expect(subnetTipResolver.projections.dynamicInfoByteLength(snapshot)).toBe(2)
		expect(subnetTipResolver.projections.hyperparamsByteLength(snapshot)).toBe(1)
		expect(metagraphObservation[EntityMetaKey.Selector]).toEqual({
			$subnet: subnet,
			timestampMs: 1_700_000_000_000,
			source: Source.Bittensor_JsonRpc,
		})
		expect(metagraphObservation[EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.BittensorMetagraph_Timestamp, [], 'metagraphByteLength')]: 20,
			[entityFieldAddressKey(EntityType.BittensorMetagraph_Timestamp, [], 'neuronCount')]: 5,
		})
		expect(subnetTipResolver.projections.$$metagraphTimestamps.resolveCount?.(snapshot)).toBe(1)
	})

	it('tip-probes singular neurons via getNeuronLite at finalized head', async () => {
		const snapshot = await neuronTipResolver.resolve.BittensorSubnetUid.resolve({
			$subnet: subnet,
			uid: 2,
		}, context)

		expect(getNeuronLite).toHaveBeenCalledWith({
			netuid: 1,
			uid: 2,
			blockHash: finalizedBlockHash,
		})
		expect(neuronTipResolver.projections.uid(snapshot)).toBe(2)
	})

	it('lists $$neurons from tip neurons-lite Vec length with authoritative resolveCount', async () => {
		const snapshot = await subnetNeuronsResolver.resolve.NetworkNetuid.resolve(subnet, context)
		const neurons = subnetNeuronsResolver.projections.$$neurons.select?.(snapshot)

		expect(getNeuronsLite).toHaveBeenCalledWith({
			netuid: 1,
			blockHash: finalizedBlockHash,
		})
		expect(neurons).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$subnet: subnet,
					uid: 0,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$subnet: subnet,
					uid: 1,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$subnet: subnet,
					uid: 2,
				},
			},
		])
		expect(subnetNeuronsResolver.projections.$$neurons.resolveCount?.(snapshot)).toBe(5)
	})

	it('lists tip $$subnets pinned to finalized dynamic-info with resolveCount', async () => {
		const snapshot = await networkSubnetsResolver.resolve.Network.resolve({
			$network: network,
		}, context)
		const subnets = networkSubnetsResolver.projections.$$subnets.select?.(snapshot)

		expect(getAllDynamicInfo).toHaveBeenCalledWith({
			blockHash: finalizedBlockHash,
		})
		expect(subnets).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					netuid: 0,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					netuid: 1,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					netuid: 2,
				},
			},
		])
		expect(networkSubnetsResolver.projections.$$subnets.resolveCount?.(snapshot)).toBe(4)
	})
})

import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { EntityMetaKey } from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getAllDynamicInfo = vi.hoisted(() => vi.fn())
const getBlock = vi.hoisted(() => vi.fn())
const getDynamicInfo = vi.hoisted(() => vi.fn())
const getFinalizedHead = vi.hoisted(() => vi.fn())
const getHeader = vi.hoisted(() => vi.fn())
const getMetagraph = vi.hoisted(() => vi.fn())
const getNeuronLite = vi.hoisted(() => vi.fn())
const getNeuronsLite = vi.hoisted(() => vi.fn())
const getSubnetHyperparams = vi.hoisted(() => vi.fn())
const getSubnetInfo = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Bittensor/JsonRpc/queries.ts', () => ({
	getAllDynamicInfo,
	getBlock,
	getDynamicInfo,
	getFinalizedHead,
	getHeader,
	getMetagraph,
	getNeuronLite,
	getNeuronsLite,
	getSubnetHyperparams,
	getSubnetInfo,
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

const subnetTipResolver = bittensor.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BittensorSubnet
	&& 'subnetInfoByteLength' in resolver.projections
))
const metagraphTipResolver = bittensor.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BittensorMetagraph_Timestamp
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

if (
	subnetTipResolver == null
	|| metagraphTipResolver == null
	|| neuronTipResolver == null
	|| subnetNeuronsResolver == null
	|| networkSubnetsResolver == null
)
	throw new Error('Bittensor-JsonRpc spec missing resolvers')

describe('Bittensor-JsonRpc subnet/neuron tip deepen', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		getFinalizedHead.mockResolvedValue(finalizedBlockHash)
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

	it('pins subnet tip payloads to the finalized head', async () => {
		const snapshot = await subnetTipResolver.resolve.NetworkNetuid.resolve(subnet, context)

		expect(getFinalizedHead).toHaveBeenCalled()
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
		expect(subnetTipResolver.projections.subnetInfoByteLength(snapshot)).toBe(3)
		expect(subnetTipResolver.projections.dynamicInfoByteLength(snapshot)).toBe(2)
		expect(subnetTipResolver.projections.hyperparamsByteLength(snapshot)).toBe(1)
	})

	it('projects metagraph tip byte length and neurons-lite Vec length as neuronCount', async () => {
		const snapshot = await metagraphTipResolver.resolve.SubnetTimestampMsSource.resolve({
			$subnet: subnet,
			timestampMs: 1,
			source: Source.Bittensor_JsonRpc,
		}, context)

		expect(getMetagraph).toHaveBeenCalledWith({
			netuid: 1,
			blockHash: finalizedBlockHash,
		})
		expect(getNeuronsLite).toHaveBeenCalledWith({
			netuid: 1,
			blockHash: finalizedBlockHash,
		})
		expect(metagraphTipResolver.projections.metagraphByteLength(snapshot)).toBe(20)
		expect(metagraphTipResolver.projections.neuronCount(snapshot)).toBe(5)
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

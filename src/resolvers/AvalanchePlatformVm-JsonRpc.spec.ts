import {
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'
import { networkBySlug } from '$/constants/Network.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { avalanchePrimaryNetworkSubnetId } from '$/sources/AvalanchePlatformVm/JsonRpc/types.ts'

const jsonRpc2 = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const { default: avalanchePlatformVm } = await import('$/resolvers/AvalanchePlatformVm-JsonRpc.ts')

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

const blockchainResolver = avalanchePlatformVm.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AvalancheBlockchain
))
const subnetResolver = avalanchePlatformVm.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AvalancheSubnet
))
const validatorResolver = avalanchePlatformVm.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AvalancheValidator
))
const blockResolver = avalanchePlatformVm.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AvalanchePChainBlock
))
const txResolver = avalanchePlatformVm.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AvalanchePChainTransaction
))
const txTimestampResolver = avalanchePlatformVm.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AvalanchePChainTransaction_Timestamp
))

if (
	blockchainResolver == null
	|| subnetResolver == null
	|| validatorResolver == null
	|| blockResolver == null
	|| txResolver == null
	|| txTimestampResolver == null
)
	throw new Error('AvalanchePlatformVm_JsonRpc spec missing required resolvers')

it('projects enrolled blockchain, subnet, validator, and P-Chain block fields', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
			blockchains: [{
				id: 'chain-1',
				name: 'C-Chain',
				subnetID: avalanchePrimaryNetworkSubnetId,
				vmID: 'jvYyfQTxGM',
			}],
		})
		.mockResolvedValueOnce({
			subnets: [{
				id: avalanchePrimaryNetworkSubnetId,
				controlKeys: [],
				threshold: '0',
			}],
		})
		.mockResolvedValueOnce({
			blockchains: [{
				id: 'chain-1',
				name: 'C-Chain',
				subnetID: avalanchePrimaryNetworkSubnetId,
				vmID: 'jvYyfQTxGM',
			}],
		})
		.mockResolvedValueOnce({
			validators: [{
				txID: 'tx-validator',
				startTime: '1600000000',
				endTime: '1700000000',
				weight: '2000000000000',
				nodeID: 'NodeID-validator',
				validationRewardOwner: {
					locktime: '0',
					threshold: '1',
					addresses: ['P-avax1owner'],
				},
				delegationFee: '2.0000',
				uptime: '99.5',
				connected: true,
				delegators: [],
			}],
		})
		.mockResolvedValueOnce({
			validators: [{
				txID: 'tx-validator',
				startTime: '1600000000',
				endTime: '1700000000',
				weight: '2000000000000',
				nodeID: 'NodeID-validator',
				validationRewardOwner: {
					locktime: '0',
					threshold: '1',
					addresses: ['P-avax1owner'],
				},
				delegationFee: '2.0000',
				connected: true,
			}],
		})
		.mockResolvedValueOnce({
			block: {
				parentID: 'parent',
				height: 7,
				id: 'block-7',
				tx: {
					id: 'tx-7',
					unsignedTx: {
						time: 1600740000,
					},
				},
			},
			encoding: 'json',
		})

	const blockchain = await blockchainResolver.resolve.BlockchainId.resolve({
		blockchainId: 'chain-1',
	}, context)
	expect(blockchain.vmId).toBe('jvYyfQTxGM')
	expect(blockchain.chainName).toBe('C-Chain')

	const subnet = await subnetResolver.resolve.SubnetId.resolve({
		subnetId: avalanchePrimaryNetworkSubnetId,
	}, context)
	expect(subnet.$$validators).toHaveLength(1)
	expect(subnet.$$blockchains).toHaveLength(1)

	const validator = await validatorResolver.resolve.NodeIdSubnetIdStartTimeMs.resolve({
		nodeId: 'NodeID-validator',
		subnetId: avalanchePrimaryNetworkSubnetId,
		startTimeMs: 1_600_000_000_000,
	}, context)
	expect(validator.stakeAmountNavax).toBe(2000000000000n)
	expect(validator.delegationFeePercent).toBe(2)
	expect(validator.rewardOwnerAddresses).toEqual(['P-avax1owner'])

	const block = await blockResolver.resolve.NetworkHeight.resolve({
		$network: {
			slug: networkBySlug['avalanche-p-chain'].slug,
		},
		height: 7n,
	}, context)
	expect(block.blockId).toBe('block-7')
	expect(block.txCount).toBe(1)
	expect(block.timestampMs).toBe(1_600_740_000_000)
	expect(block.$$transactions).toEqual([{
		[EntityMetaKey.Selector]: {
			$network: {
				slug: networkBySlug['avalanche-p-chain'].slug,
			},
			txId: 'tx-7',
		},
	}])
})

it('projects committed P-Chain transaction status observations', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
			status: 'Committed',
		})
		.mockResolvedValueOnce({
			height: '99',
		})

	const observation = await txTimestampResolver.resolve.TransactionTimestampMsSource.resolve({
		$transaction: {
			$network: {
				slug: networkBySlug['avalanche-p-chain'].slug,
			},
			txId: 'tx-1',
		},
		timestampMs: 1,
		source: Source.AvalanchePlatformVm_JsonRpc,
	}, context)

	expect(observation.status).toBe('Committed')
	expect(observation.blockHeight).toBe(99n)
	expect(observation.source).toBe(Source.AvalanchePlatformVm_JsonRpc)
})

it('projects enrolled AvalanchePChainTransaction fields from platform.getTx json', async () => {
	jsonRpc2.mockResolvedValueOnce({
		tx: {
			unsignedTx: {
				networkID: 1,
				blockchainID: avalanchePrimaryNetworkSubnetId,
				memo: '0x68656c6c6f',
				validator: {
					nodeID: 'NodeID-VT3YhgFaWEzy4Ap937qMeNEDscCammzG',
					start: 1682945406,
					end: 1684155006,
					weight: 48944170378,
				},
				stake: [{
					assetID: 'FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z',
				}],
				shares: 200000,
				rewardsOwner: {
					addresses: ['P-avax19zfygxaf59stehzedhxjesads0p5jdvfeedal0'],
				},
			},
			id: '28KVjSw5h3XKGuNpJXWY74EdnGq4TUWvCgEtJPymgQTvudiugb',
		},
		encoding: 'json',
	})

	const transaction = await txResolver.resolve.NetworkTxId.resolve({
		$network: {
			slug: networkBySlug['avalanche-p-chain'].slug,
		},
		txId: '28KVjSw5h3XKGuNpJXWY74EdnGq4TUWvCgEtJPymgQTvudiugb',
	}, context)

	expect(txResolver.projections.txType(transaction)).toBe('AddValidatorTx')
	expect(txResolver.projections.blockchainId(transaction)).toBe(avalanchePrimaryNetworkSubnetId)
	expect(txResolver.projections.subnetId(transaction)).toBe(avalanchePrimaryNetworkSubnetId)
	expect(txResolver.projections.nodeId(transaction)).toBe('NodeID-VT3YhgFaWEzy4Ap937qMeNEDscCammzG')
	expect(txResolver.projections.startTimeMs(transaction)).toBe(1_682_945_406_000)
	expect(txResolver.projections.endTimeMs(transaction)).toBe(1_684_155_006_000)
	expect(txResolver.projections.stakeAmountNavax(transaction)).toBe(48944170378n)
	expect(txResolver.projections.memo(transaction)).toBe('0x68656c6c6f')
	expect(txResolver.projections.feeNavax(transaction)).toBeUndefined()
	expect(txResolver.projections.$block(transaction)).toBeUndefined()
	expect(txResolver.projections.payload(transaction)).toMatchObject({
		shares: 200000,
		validator: {
			nodeID: 'NodeID-VT3YhgFaWEzy4Ap937qMeNEDscCammzG',
		},
	})
	expect(jsonRpc2.mock.calls.map(([, method, params]) => [method, params])).toEqual([
		[
			'platform.getTx',
			{
				txID: '28KVjSw5h3XKGuNpJXWY74EdnGq4TUWvCgEtJPymgQTvudiugb',
				encoding: 'json',
			},
		],
	])
})

const networkBlocksResolver = avalanchePlatformVm.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Avalanche' in resolver.projections
	&& '$$blocks' in resolver.projections.Avalanche
	&& typeof resolver.projections.Avalanche.$$blocks === 'object'
	&& 'select' in resolver.projections.Avalanche.$$blocks
))
const networkSubnetsResolver = avalanchePlatformVm.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Avalanche' in resolver.projections
	&& '$$subnets' in resolver.projections.Avalanche
	&& typeof resolver.projections.Avalanche.$$subnets === 'object'
	&& 'select' in resolver.projections.Avalanche.$$subnets
))

if (networkBlocksResolver == null || networkSubnetsResolver == null)
	throw new Error('AvalanchePlatformVm_JsonRpc spec missing Network.Avalanche list resolvers')

it('projects Network.Avalanche $$blocks tip walk and $$subnets from platform.getSubnets', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
			height: '3',
		})
		.mockResolvedValueOnce({
			subnets: [
				{
					id: avalanchePrimaryNetworkSubnetId,
					controlKeys: ['P-avax1control'],
					threshold: '1',
				},
				{
					id: 'subnet-2',
					controlKeys: [],
					threshold: '0',
				},
			],
		})

	const blocksSnapshot = await networkBlocksResolver.resolve.Slug.resolve({
		slug: networkBySlug['avalanche-p-chain'].slug,
	}, {
		...context,
		pagination: {
			limit: 2,
		},
	})
	expect(networkBlocksResolver.projections.Avalanche.$$blocks.select(blocksSnapshot)).toEqual([
		{
			[EntityMetaKey.Selector]: {
				$network: {
					slug: networkBySlug['avalanche-p-chain'].slug,
				},
				height: 3n,
			},
		},
		{
			[EntityMetaKey.Selector]: {
				$network: {
					slug: networkBySlug['avalanche-p-chain'].slug,
				},
				height: 2n,
			},
		},
	])
	expect(networkBlocksResolver.projections.Avalanche.$$blocks.resolveCount(blocksSnapshot)).toBe(4n)

	const subnetsSnapshot = await networkSubnetsResolver.resolve.Slug.resolve({
		slug: networkBySlug['avalanche-p-chain'].slug,
	}, {
		...context,
		pagination: {
			limit: 1,
		},
	})
	expect(networkSubnetsResolver.projections.Avalanche.$$subnets.resolveCount(subnetsSnapshot)).toBe(2n)
	expect(networkSubnetsResolver.projections.Avalanche.$$subnets.select(subnetsSnapshot)).toEqual([{
		[EntityMetaKey.Selector]: {
			subnetId: avalanchePrimaryNetworkSubnetId,
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.AvalancheSubnet, [], 'controlKeys')]: ['P-avax1control'],
			[entityFieldAddressKey(EntityType.AvalancheSubnet, [], 'ownerAddresses')]: ['P-avax1control'],
			[entityFieldAddressKey(EntityType.AvalancheSubnet, [], 'threshold')]: 1,
		},
	}])
})

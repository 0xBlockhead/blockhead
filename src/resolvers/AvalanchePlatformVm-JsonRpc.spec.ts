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
if (
	blockchainResolver == null
	|| subnetResolver == null
	|| validatorResolver == null
	|| blockResolver == null
	|| txResolver == null
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
				delegatorCount: '3',
				delegators: [],
			}],
		})
		.mockResolvedValueOnce({
			validators: [],
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
				delegatorCount: '3',
				delegators: [{
					txID: 'tx-delegator',
					startTime: '1601000000',
					endTime: '1701000000',
					weight: '300000000000',
					nodeID: 'NodeID-validator',
					rewardOwner: {
						locktime: '0',
						threshold: '1',
						addresses: ['P-avax1delegator'],
					},
					potentialReward: '1000000000',
				}],
			}],
		})
		.mockResolvedValueOnce({
			validators: [],
		})
		.mockResolvedValueOnce({
			block: {
				parentID: 'parent',
				height: 7,
				id: 'block-7',
				time: 1700000000,
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
	expect(subnetResolver.projections.$$validators.resolveCount(subnet)).toBe(1)
	expect(subnetResolver.projections.$$blockchains.resolveCount(subnet)).toBe(1)
	expect(subnetResolver.projections.$$delegators.resolveCount(subnet)).toBe(3)
	expect(subnet.$$timestamps[0][EntityMetaKey.Fields]).toMatchObject({
		[entityFieldAddressKey(EntityType.AvalancheSubnet_Timestamp, [], 'validatorCount')]: 1,
		[entityFieldAddressKey(EntityType.AvalancheSubnet_Timestamp, [], 'chainCount')]: 1,
		[entityFieldAddressKey(EntityType.AvalancheSubnet_Timestamp, [], 'pendingValidatorCount')]: 0,
	})

	const validator = await validatorResolver.resolve.NodeIdSubnetIdStartTimeMs.resolve({
		nodeId: 'NodeID-validator',
		subnetId: avalanchePrimaryNetworkSubnetId,
		startTimeMs: 1_600_000_000_000,
	}, context)
	expect(validator.stakeAmountNavax).toBe(2000000000000n)
	expect(validator.delegationFeePercent).toBe(2)
	expect(validator.rewardOwnerAddresses).toEqual(['P-avax1owner'])
	expect(validatorResolver.projections.$$delegators.resolveCount(validator)).toBe(3)
	expect(validatorResolver.projections.$$delegators.select(validator)).toEqual([{
		[EntityMetaKey.Selector]: {
			$validator: {
				nodeId: 'NodeID-validator',
				subnetId: avalanchePrimaryNetworkSubnetId,
				startTimeMs: 1_600_000_000_000,
			},
			txId: 'tx-delegator',
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.AvalancheDelegator, [], 'delegatorAddress')]: 'P-avax1delegator',
			[entityFieldAddressKey(EntityType.AvalancheDelegator, [], 'stakeAmountNavax')]: 300000000000n,
			[entityFieldAddressKey(EntityType.AvalancheDelegator, [], 'startTimeMs')]: 1_601_000_000_000,
			[entityFieldAddressKey(EntityType.AvalancheDelegator, [], 'endTimeMs')]: 1_701_000_000_000,
			[entityFieldAddressKey(EntityType.AvalancheDelegator, [], 'rewardOwnerAddresses')]: ['P-avax1delegator'],
			[entityFieldAddressKey(EntityType.AvalancheDelegator, [], 'potentialRewardNavax')]: 1000000000n,
		},
	}])
	expect(validator.$$timestamps[0][EntityMetaKey.Fields]).toMatchObject({
		[entityFieldAddressKey(EntityType.AvalancheValidator_Timestamp, [], 'observedDelegatorCount')]: 3,
	})

	const block = await blockResolver.resolve.NetworkHeight.resolve({
		$network: {
			slug: networkBySlug['avalanche-p-chain'].slug,
		},
		height: 7n,
	}, context)
	expect(block.blockId).toBe('block-7')
	expect(block.txCount).toBe(1)
	expect(block.timestampMs).toBe(1_700_000_000_000)
	expect(blockResolver.projections.$$transactions.resolveCount(block)).toBe(1)
	expect(blockResolver.projections.$$transactions.select(block)).toEqual(block.$$transactions)
	expect(block.$$transactions).toEqual([{
		[EntityMetaKey.Selector]: {
			$network: {
				slug: networkBySlug['avalanche-p-chain'].slug,
			},
			txId: 'tx-7',
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.AvalanchePChainTransaction, [], '$block')]: {
				[EntityMetaKey.Selector]: {
					$network: {
						slug: networkBySlug['avalanche-p-chain'].slug,
					},
					height: 7n,
					blockId: 'block-7',
				},
			},
			[entityFieldAddressKey(EntityType.AvalanchePChainTransaction, [], 'txType')]: 'AdvanceTimeTx',
			[entityFieldAddressKey(EntityType.AvalanchePChainTransaction, [], 'payload')]: {
				time: 1600740000,
			},
		},
	}])
})

it('preserves legacy AdvanceTime block timestamps when the top-level Banff time is absent', async () => {
	jsonRpc2.mockResolvedValueOnce({
		block: {
			parentID: 'parent',
			height: 6,
			id: 'block-6',
			tx: {
				id: 'tx-6',
				unsignedTx: {
					time: 1600740000,
				},
			},
		},
		encoding: 'json',
	})

	await expect(blockResolver.resolve.NetworkHeight.resolve({
		$network: {
			slug: networkBySlug['avalanche-p-chain'].slug,
		},
		height: 6n,
	}, context)).resolves.toMatchObject({
		blockId: 'block-6',
		timestampMs: 1_600_740_000_000,
	})
})

it('materializes pending validators through the subnet, direct entity, and observation hierarchy', async () => {
	const pendingValidator = {
		txID: 'tx-pending',
		startTime: '1800000000',
		endTime: '1900000000',
		weight: '4000000000000',
		nodeID: 'NodeID-pending',
		validationRewardOwner: {
			locktime: '0',
			threshold: '1',
			addresses: ['P-avax1pending'],
		},
		delegationFee: '3.0000',
		delegators: [],
	}
	jsonRpc2
		.mockResolvedValueOnce({
			subnets: [{
				id: avalanchePrimaryNetworkSubnetId,
				controlKeys: [],
				threshold: '0',
			}],
		})
		.mockResolvedValueOnce({
			blockchains: [],
		})
		.mockResolvedValueOnce({
			validators: [],
		})
		.mockResolvedValueOnce({
			validators: [pendingValidator],
		})
		.mockResolvedValueOnce({
			validators: [],
		})
		.mockResolvedValueOnce({
			validators: [pendingValidator],
		})

	const subnet = await subnetResolver.resolve.SubnetId.resolve({
		subnetId: avalanchePrimaryNetworkSubnetId,
	}, context)
	expect(subnet.$$validators).toHaveLength(1)
	expect(subnet.$$validators[0][EntityMetaKey.Selector]).toMatchObject({
		nodeId: 'NodeID-pending',
		startTimeMs: 1_800_000_000_000,
	})

	const validatorSelector = {
		nodeId: 'NodeID-pending',
		subnetId: avalanchePrimaryNetworkSubnetId,
		startTimeMs: 1_800_000_000_000,
	}
	const validator = await validatorResolver.resolve.NodeIdSubnetIdStartTimeMs.resolve(
		validatorSelector,
		context
	)
	expect(validator.stakeAmountNavax).toBe(4000000000000n)
	expect(validator.$$timestamps[0][EntityMetaKey.Fields]).toMatchObject({
		[entityFieldAddressKey(EntityType.AvalancheValidator_Timestamp, [], 'validatorSetKind')]: 'pending',
		[entityFieldAddressKey(EntityType.AvalancheValidator_Timestamp, [], 'observedStakeNavax')]: 4000000000000n,
	})
})

it('projects committed P-Chain transaction status observations', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
			tx: {
				id: 'tx-1',
				unsignedTx: {},
			},
			encoding: 'json',
		})
		.mockResolvedValueOnce({
			status: 'Committed',
		})

	const transaction = await txResolver.resolve.NetworkTxId.resolve({
		$network: {
			slug: networkBySlug['avalanche-p-chain'].slug,
		},
		txId: 'tx-1',
	}, context)

	expect(transaction.$$timestamps[0][EntityMetaKey.Selector]).toMatchObject({
		$transaction: {
			$network: {
				slug: networkBySlug['avalanche-p-chain'].slug,
			},
			txId: 'tx-1',
		},
		source: Source.AvalanchePlatformVm_JsonRpc,
	})
	expect(transaction.$$timestamps[0][EntityMetaKey.Fields]).toEqual({
		[entityFieldAddressKey(EntityType.AvalanchePChainTransaction_Timestamp, [], 'status')]: 'Committed',
	})
})

it('projects enrolled AvalanchePChainTransaction fields from platform.getTx json', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
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
		.mockResolvedValueOnce({
			status: 'Committed',
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
		[
			'platform.getTxStatus',
			{
				txID: '28KVjSw5h3XKGuNpJXWY74EdnGq4TUWvCgEtJPymgQTvudiugb',
			},
		],
	])
})

it('fails closed when direct P-Chain responses disagree with requested identity', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
			block: {
				parentID: 'parent',
				height: 8,
				id: 'block-8',
			},
			encoding: 'json',
		})
		.mockResolvedValueOnce({
			block: {
				parentID: 'parent',
				height: 7,
				id: 'block-other',
			},
			encoding: 'json',
		})
		.mockResolvedValueOnce({
			tx: {
				id: 'tx-other',
				unsignedTx: {},
			},
			encoding: 'json',
		})
		.mockResolvedValueOnce({
			status: 'Unknown',
		})

	await expect(blockResolver.resolve.NetworkHeight.resolve({
		$network: {
			slug: networkBySlug['avalanche-p-chain'].slug,
		},
		height: 7n,
	}, context)).rejects.toThrow('block height response does not match request')

	await expect(blockResolver.resolve.NetworkBlockId.resolve({
		$network: {
			slug: networkBySlug['avalanche-p-chain'].slug,
		},
		blockId: 'block-7',
	}, context)).rejects.toThrow('block response does not match request')

	await expect(txResolver.resolve.NetworkTxId.resolve({
		$network: {
			slug: networkBySlug['avalanche-p-chain'].slug,
		},
		txId: 'tx-requested',
	}, context)).rejects.toThrow('transaction response does not match request')
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
			offset: 1,
		},
	})
	expect(networkBlocksResolver.projections.Avalanche.$$blocks.select(blocksSnapshot)).toEqual([
		{
			[EntityMetaKey.Selector]: {
				$network: {
					slug: networkBySlug['avalanche-p-chain'].slug,
				},
				height: 2n,
			},
		},
		{
			[EntityMetaKey.Selector]: {
				$network: {
					slug: networkBySlug['avalanche-p-chain'].slug,
				},
				height: 1n,
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
			offset: 1,
		},
	})
	expect(networkSubnetsResolver.projections.Avalanche.$$subnets.resolveCount(subnetsSnapshot)).toBe(2n)
	expect(networkSubnetsResolver.projections.Avalanche.$$subnets.select(subnetsSnapshot)).toEqual([{
		[EntityMetaKey.Selector]: {
			subnetId: 'subnet-2',
		},
		[EntityMetaKey.Fields]: {
			[entityFieldAddressKey(EntityType.AvalancheSubnet, [], 'controlKeys')]: [],
			[entityFieldAddressKey(EntityType.AvalancheSubnet, [], 'ownerAddresses')]: [],
			[entityFieldAddressKey(EntityType.AvalancheSubnet, [], 'threshold')]: 0,
		},
	}])
})

import {
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'
import { networkBySlug } from '$/constants/Network.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
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
const txTimestampResolver = avalanchePlatformVm.resolvers.find((resolver) => (
	resolver.entityType === EntityType.AvalanchePChainTransaction_Timestamp
))

if (
	blockchainResolver == null
	|| subnetResolver == null
	|| validatorResolver == null
	|| blockResolver == null
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

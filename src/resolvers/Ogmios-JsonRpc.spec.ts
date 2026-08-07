import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'

const getEpoch = vi.hoisted(() => vi.fn())
const getLedgerTip = vi.hoisted(() => vi.fn())
const getNetworkBlockHeight = vi.hoisted(() => vi.fn())
const getProtocolParameters = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Ogmios/JsonRpc/queries.ts', () => ({
	getEpoch,
	getLedgerTip,
	getNetworkBlockHeight,
	getProtocolParameters,
}))

const { default: ogmiosJsonRpc } = await import('$/resolvers/Ogmios-JsonRpc.ts')

const network = {
	slug: 'cardano',
}
const unsupportedNetwork = {
	slug: 'ethereum',
}
const tipPoint = {
	slot: 130_000_102,
	id: 'c248757d390181c517a5beadc9c3fe64bf821d3e889a963fc717003ec248757d',
}
const protocolParameters = {
	minFeeCoefficient: 44,
	minFeeConstant: {
		ada: {
			lovelace: 155_381,
		},
	},
	minUtxoDepositCoefficient: 4_310,
	minUtxoDepositConstant: {
		ada: {
			lovelace: 0,
		},
	},
	maxBlockBodySize: {
		bytes: 90_112,
	},
	maxBlockHeaderSize: {
		bytes: 1_100,
	},
	maxTransactionSize: {
		bytes: 16_384,
	},
	maxValueSize: {
		bytes: 5_000,
	},
	stakeCredentialDeposit: {
		ada: {
			lovelace: 2_000_000,
		},
	},
	stakePoolDeposit: {
		ada: {
			lovelace: 500_000_000,
		},
	},
	stakePoolRetirementEpochBound: 18,
	stakePoolPledgeInfluence: '3/10',
	minStakePoolCost: {
		ada: {
			lovelace: 340_000_000,
		},
	},
	monetaryExpansion: '3/1000',
	treasuryExpansion: '1/5',
	desiredNumberOfStakePools: 500,
	federatedBlockProductionRatio: '0/1',
	collateralPercentage: 150,
	maxCollateralInputs: 3,
	plutusCostModels: {
		'plutus:v3': [
			1,
			2,
			3,
		],
	},
	scriptExecutionPrices: {
		memory: '577/10000',
		cpu: '721/10000000',
	},
	maxExecutionUnitsPerTransaction: {
		memory: 14_000_000,
		cpu: 10_000_000_000,
	},
	maxExecutionUnitsPerBlock: {
		memory: 62_000_000,
		cpu: 20_000_000_000,
	},
	version: {
		major: 9,
		minor: 0,
	},
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

const timestampsResolver = ogmiosJsonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cardano' in resolver.projections
	&& '$$timestamps' in resolver.projections.Cardano
))
const blocksResolver = ogmiosJsonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cardano' in resolver.projections
	&& '$$blocks' in resolver.projections.Cardano
))
const protocolParametersResolver = ogmiosJsonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Cardano' in resolver.projections
	&& '$$protocolParameterEpochs' in resolver.projections.Cardano
))
const timestampResolver = ogmiosJsonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CardanoNetwork_Timestamp
))
const protocolParametersEpochResolver = ogmiosJsonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CardanoProtocolParameters_Epoch
))
const blockResolver = ogmiosJsonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CardanoBlock
))

if (
	timestampsResolver == null
	|| blocksResolver == null
	|| protocolParametersResolver == null
	|| timestampResolver == null
	|| protocolParametersEpochResolver == null
	|| blockResolver == null
)
	throw new Error('Ogmios-JsonRpc spec missing tip/protocol leftover resolvers')

describe('Ogmios JsonRpc Cardano tip projections', () => {
	beforeEach(() => {
		getLedgerTip.mockReset()
		getNetworkBlockHeight.mockReset()
		getEpoch.mockReset()
		getProtocolParameters.mockReset()
		getLedgerTip.mockResolvedValue(tipPoint)
		getNetworkBlockHeight.mockResolvedValue(12_345_678)
		getEpoch.mockResolvedValue(500)
		getProtocolParameters.mockResolvedValue(protocolParameters)
	})

	it('projects Network.Cardano tip timestamps / tip block / protocol parameters', async () => {
		const timestamps = await timestampsResolver.resolve.Slug.resolve(network, context)
		expect(timestamps).toHaveLength(1)
		expect(timestamps[0][EntityMetaKey.Selector]).toMatchObject({
			$network: network,
			source: Source.Ogmios_JsonRpc,
		})
		expect(timestamps[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestSlot')]: 130_000_102n,
			[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockNo')]: 12_345_678n,
			[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockHash')]: tipPoint.id,
			[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'epoch')]: 500,
		})

		const blocks = await blocksResolver.resolve.Slug.resolve(network, context)
		expect(blocks).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				hash: tipPoint.id,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.CardanoBlock, [], 'slot')]: 130_000_102n,
				[entityFieldAddressKey(EntityType.CardanoBlock, [], 'blockNo')]: 12_345_678n,
				[entityFieldAddressKey(EntityType.CardanoBlock, [], 'epoch')]: 500,
			},
		}])

		const parameterEpochs = await protocolParametersResolver.resolve.Slug.resolve(network, context)
		expect(parameterEpochs[0][EntityMetaKey.Selector]).toEqual({
			$network: network,
			epoch: 500,
			source: Source.Ogmios_JsonRpc,
		})
		expect(parameterEpochs[0][EntityMetaKey.Fields]).toMatchObject({
			[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'minFeeA')]: 44n,
			[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'minFeeB')]: 155_381n,
			[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'coinsPerUtxoByte')]: 4_310n,
			[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'rho')]: '3/1000',
			[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'executionPrices')]: {
				memory: '577/10000',
				steps: '721/10000000',
			},
		})
	})

	it('tip-probes singular timestamp / protocol epoch / tip block selectors', async () => {
		const observation = await timestampResolver.resolve.NetworkTimestampMsSource.resolve({
			$network: network,
			timestampMs: 1,
			source: Source.Ogmios_JsonRpc,
		}, context)
		expect(timestampResolver.projections.latestSlot(observation)).toBe(130_000_102n)
		expect(timestampResolver.projections.latestBlockHash(observation)).toBe(tipPoint.id)

		const snapshot = await protocolParametersEpochResolver.resolve.NetworkEpochSource.resolve({
			$network: network,
			epoch: 500,
			source: Source.Ogmios_JsonRpc,
		}, context)
		expect(protocolParametersEpochResolver.projections.minFeeA(snapshot)).toBe(44n)
		expect(protocolParametersEpochResolver.projections.executionPrices(snapshot)).toEqual({
			memory: '577/10000',
			steps: '721/10000000',
		})

		const tipBlock = await blockResolver.resolve.NetworkHash.resolve({
			$network: network,
			hash: tipPoint.id,
		}, context)
		expect(blockResolver.projections.blockNo(tipBlock)).toBe(12_345_678n)
		expect(blockResolver.projections.epoch(tipBlock)).toBe(500)

		await expect(blockResolver.resolve.NetworkHash.resolve({
			$network: network,
			hash: '0'.repeat(64),
		}, context)).rejects.toThrow('historical block by hash is unavailable')

		await expect(protocolParametersEpochResolver.resolve.NetworkEpochSource.resolve({
			$network: network,
			epoch: 499,
			source: Source.Ogmios_JsonRpc,
		}, context)).rejects.toThrow('historical protocol parameters epoch is unavailable')
	})

	it('rejects non-Cardano networks', async () => {
		await expect(timestampsResolver.resolve.Slug.resolve(unsupportedNetwork, context)).rejects.toThrow('unsupported network')
	})
})

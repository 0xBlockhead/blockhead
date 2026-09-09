import { createOgmiosFixture } from '../../tests/fixtures/ogmios.ts'
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
const getConstitution = vi.hoisted(() => vi.fn())
const getLedgerTip = vi.hoisted(() => vi.fn())
const getNetworkBlockHeight = vi.hoisted(() => vi.fn())
const getProtocolParameters = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Ogmios/JsonRpc/queries.ts', () => ({
	getConstitution,
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
const { tipPoint, protocolParameters } = createOgmiosFixture()
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
const constitutionEpochResolver = ogmiosJsonRpc.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CardanoConstitution_Epoch
))

if (
	timestampsResolver == null
	|| blocksResolver == null
	|| protocolParametersResolver == null
	|| timestampResolver == null
	|| protocolParametersEpochResolver == null
	|| blockResolver == null
	|| constitutionEpochResolver == null
)
	throw new Error('Ogmios-JsonRpc spec missing tip/protocol leftover resolvers')

describe('Ogmios JsonRpc Cardano tip projections', () => {
	beforeEach(() => {
		getLedgerTip.mockReset()
		getConstitution.mockReset()
		getNetworkBlockHeight.mockReset()
		getEpoch.mockReset()
		getProtocolParameters.mockReset()
		getLedgerTip.mockResolvedValue(tipPoint)
		getNetworkBlockHeight.mockResolvedValue(12_345_678)
		getEpoch.mockResolvedValue(500)
		getConstitution.mockResolvedValue({
			metadata: {
				url: 'ipfs://constitution',
				hash: 'constitution-anchor-hash',
			},
			guardrails: {
				hash: 'guardrails-script-hash',
			},
		})
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

	it('resolves the current constitution at its epoch and source tip', async () => {
		const constitution = await constitutionEpochResolver.resolve.NetworkEpochSource.resolve({
			$network: network,
			epoch: 500,
			source: Source.Ogmios_JsonRpc,
		}, context)

		expect(constitution).toEqual({
			slot: 130_000_102n,
			anchorUrl: 'ipfs://constitution',
			anchorHash: 'constitution-anchor-hash',
			scriptHash: 'guardrails-script-hash',
		})
		expect(constitutionEpochResolver.projections.anchorUrl(constitution)).toBe('ipfs://constitution')

		getConstitution.mockResolvedValueOnce({
			metadata: {
				url: 'ipfs://constitution',
				hash: 'constitution-anchor-hash',
			},
			guardrails: null,
		})
		await expect(constitutionEpochResolver.resolve.NetworkEpochSource.resolve({
			$network: network,
			epoch: 500,
			source: Source.Ogmios_JsonRpc,
		}, context)).resolves.not.toHaveProperty('scriptHash')
	})

	it('rejects historical and foreign constitution selectors before fabricating state', async () => {
		await expect(constitutionEpochResolver.resolve.NetworkEpochSource.resolve({
			$network: network,
			epoch: 499,
			source: Source.Ogmios_JsonRpc,
		}, context)).rejects.toThrow('historical constitution epoch is unavailable')

		await expect(constitutionEpochResolver.resolve.NetworkEpochSource.resolve({
			$network: network,
			epoch: 500,
			source: Source.Blockfrost_Rest,
		}, context)).rejects.toThrow('constitution source mismatch')

		await expect(constitutionEpochResolver.resolve.NetworkEpochSource.resolve({
			$network: unsupportedNetwork,
			epoch: 500,
			source: Source.Ogmios_JsonRpc,
		}, context)).rejects.toThrow('unsupported network')
	})
})

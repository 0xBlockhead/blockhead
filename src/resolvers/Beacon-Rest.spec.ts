import {
	beaconConsensusNetworks,
	slotsPerEpoch,
} from '$/constants/BeaconConsensus.ts'
import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

import { networkConsensusUpgrades } from '$/constants/EthereumNetworkUpgrades.ts'
import { indexResolvers } from '$/resolvers/$resolvers.ts'
import {
	EntityMetaKey,
	entityFieldDefinitions,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const getFinalityCheckpoints = vi.hoisted(() => vi.fn())
const getForkSchedule = vi.hoisted(() => vi.fn())
const getCommittees = vi.hoisted(() => vi.fn())
const getSyncCommittee = vi.hoisted(() => vi.fn())
const getValidatorAtHead = vi.hoisted(() => vi.fn())
const getBlockDutySummary = vi.hoisted(() => vi.fn())
const getHeader = vi.hoisted(() => vi.fn())
const getHeadSlot = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Beacon/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Beacon/Rest/queries.ts')>(),
	getFinalityCheckpoints,
	getForkSchedule,
	getCommittees,
	getSyncCommittee,
	getValidatorAtHead,
	getBlockDutySummary,
	getHeader,
	getHeadSlot,
}))

const { default: beaconRest } = await import('$/resolvers/Beacon-Rest.ts')
const { beaconRestByChainId } = await import('$/sources/Beacon/Rest/queries.ts')

const network = {
	caip2: {
		namespace: 'eip155',
		reference: '1',
	},
}
const consensusUpgrade = networkConsensusUpgrades.find((upgrade) => (
	upgrade.chainId === 1
	&& upgrade.activationEpoch != null
))
const activationEpoch = consensusUpgrade?.activationEpoch
const finalityResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EthereumBeaconFinality_Timestamp
))
const previousForkVersionResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EthereumConsensusUpgrade
	&& 'previousForkVersion' in resolver.projections
))
const currentForkVersionResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.EthereumConsensusUpgrade
	&& 'currentForkVersion' in resolver.projections
))
const committeeResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconCommittee
))
const syncCommitteeResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconSyncCommittee
))
const validatorResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconValidator
))
const slashingResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconSlashing
))
const headerResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconSlot
	&& 'root' in resolver.projections
))
const headSlotResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$beaconSlots' in resolver.projections.Evm
))
const consensusEndpointsResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& 'consensusEndpoints' in resolver.projections.Evm
))

if (
	consensusUpgrade == null
	|| activationEpoch == null
	|| finalityResolver == null
	|| previousForkVersionResolver == null
	|| currentForkVersionResolver == null
	|| committeeResolver == null
	|| syncCommitteeResolver == null
	|| validatorResolver == null
	|| slashingResolver == null
	|| headerResolver == null
	|| headSlotResolver == null
	|| consensusEndpointsResolver == null
) throw new Error('Beacon REST checkpoint and fork resolvers are not registered')
const indexedConsensusEndpointsResolver = indexResolvers(
	schema,
	[{
		source: Source.Beacon_Rest,
		resolvers: [consensusEndpointsResolver],
	}],
	new Set<Source>([Source.Beacon_Rest])
).resolverDefinitions[0]
const indexedValidatorResolver = indexResolvers(
	schema,
	[{
		source: Source.Beacon_Rest,
		resolvers: [validatorResolver],
	}],
	new Set<Source>([Source.Beacon_Rest])
).resolverDefinitions[0]
const resolveForkVersionsByUpgradeId = (
	'EvmNetworkUpgradeId' in previousForkVersionResolver.resolve ?
		previousForkVersionResolver.resolve.EvmNetworkUpgradeId.resolve
	:
		undefined
)
const resolveHeaderBySlot = (
	'EvmNetworkSlot' in headerResolver.resolve ?
		headerResolver.resolve.EvmNetworkSlot.resolve
	:
		undefined
)
const resolveHeadSlots = (
	'Caip2' in headSlotResolver.resolve ?
		headSlotResolver.resolve.Caip2.resolve
	:
		undefined
)
if (resolveForkVersionsByUpgradeId == null)
	throw new Error('Beacon REST fork resolver does not accept upgrade IDs')
if (resolveHeaderBySlot == null)
	throw new Error('Beacon REST header resolver does not accept slots')
if (resolveHeadSlots == null)
	throw new Error('Beacon REST head-slot resolver does not accept CAIP-2 networks')

describe('Beacon REST checkpoint and fork projections', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('owns ordered consensus endpoints without duplicating transport URLs in domain constants', async () => {
		const endpoints = await consensusEndpointsResolver.resolve.Caip2.resolve(network)

		expect(endpoints).toEqual([
			{
				restBaseUrl: 'https://ethereum-beacon-api.publicnode.com',
				consensusProtocol: 'EthereumBeacon',
			},
		])
		expect(endpoints.map((endpoint) => endpoint.restBaseUrl)).toEqual(
			beaconRestByChainId.get(1)?.restBaseUrls
		)
		expect(consensusEndpointsResolver.projections.Evm.consensusEndpoints(endpoints)).toEqual(endpoints)
		expect(beaconConsensusNetworks.map((network) => network.slotsPerEpoch)).toEqual([
			slotsPerEpoch,
			slotsPerEpoch,
			slotsPerEpoch,
		])
		expect(beaconConsensusNetworks.every((network) => (
			!Object.hasOwn(network, 'restBaseUrl')
		))).toBe(true)
	})

	it('limits endpoint ownership to exact checked-in Beacon EIP-155 targets', () => {
		expect(indexedConsensusEndpointsResolver.appliesTo('Caip2', network)).toBe(true)
		expect(indexedConsensusEndpointsResolver.appliesTo('Caip2', {
			caip2: {
				namespace: 'eip155',
				reference: '10',
			},
		})).toBe(false)
	})

	it('is the sole default source for Network.Evm.consensusEndpoints', () => {
		const networkDefinition = schema.find((definition) => (
			definition.entityType === EntityType.Network
		))
		if (networkDefinition == null)
			throw new Error('Network schema definition missing')

		expect(entityFieldDefinitions(networkDefinition).find((field) => (
			field.name === 'consensusEndpoints'
		))?.defaultSources).toEqual([
			Source.Beacon_Rest,
		])
	})

	it('converts native finality checkpoint fields only at schema projection', async () => {
		getFinalityCheckpoints.mockResolvedValue({
			previous_justified: {
				epoch: '100',
				root: '0xAABB',
			},
			current_justified: {
				epoch: '101',
				root: '0xCCDD',
			},
			finalized: {
				epoch: '99',
				root: '0xEEFF',
			},
		})

		await expect(finalityResolver.resolve.EvmNetworkTimestampMs.resolve({
			$network: network,
			timestampMs: 1_725_000_000_000,
		})).resolves.toEqual({
			currentJustifiedCheckpointEpoch: 101,
			currentJustifiedCheckpointRoot: '0xccdd',
			previousJustifiedCheckpointEpoch: 100,
			previousJustifiedCheckpointRoot: '0xaabb',
			finalizedCheckpointEpoch: 99,
			finalizedCheckpointRoot: '0xeeff',
		})
		expect(getFinalityCheckpoints).toHaveBeenCalledWith(1)
	})

	it('matches a native decimal epoch and canonicalizes fork versions', async () => {
		getForkSchedule.mockResolvedValue([
			{
				epoch: String(activationEpoch + 1),
				previous_version: '0x11111111',
				current_version: '0x22222222',
			},
			{
				epoch: String(activationEpoch),
				previous_version: '0xAABBCCDD',
				current_version: '0xEEFF0011',
			},
		])
		const selector = {
			$network: network,
			upgradeId: consensusUpgrade.upgradeId,
		}

		await expect(
			resolveForkVersionsByUpgradeId(selector)
		).resolves.toEqual({
			previousForkVersion: '0xaabbccdd',
			currentForkVersion: '0xeeff0011',
		})
		expect(previousForkVersionResolver).toBe(currentForkVersionResolver)
		expect(getForkSchedule).toHaveBeenCalledWith(1)
		expect(getForkSchedule).toHaveBeenCalledOnce()
	})

	it('projects native committee decimal strings at the schema boundary', async () => {
		getCommittees.mockResolvedValue([
			{
				index: '1',
				slot: '64',
				validators: [
					'2',
					'3',
				],
			},
		])

		await expect(committeeResolver.resolve.EvmNetworkSlotIndexInSlot.resolve({
			$network: network,
			slot: 64,
			indexInSlot: 1,
		})).resolves.toEqual({
			validatorIndices: [
				2,
				3,
			],
		})
		expect(getCommittees).toHaveBeenCalledWith(
			1,
			'64'
		)
	})

	it('projects the native validator row without an effective-balance fallback', async () => {
		getValidatorAtHead.mockResolvedValue({
			index: '12',
			balance: '32000000001',
			status: 'active_ongoing',
			validator: {
				pubkey: `0x${'A'.repeat(96)}`,
				withdrawal_credentials: `0x${'B'.repeat(64)}`,
				effective_balance: '32000000000',
				slashed: false,
				activation_eligibility_epoch: '10',
				activation_epoch: '11',
				exit_epoch: '18446744073709551615',
				withdrawable_epoch: '18446744073709551615',
			},
		})

		await expect(validatorResolver.resolve.NetworkIndexInNetwork.resolve({
			$network: network,
			indexInNetwork: 12,
		})).resolves.toEqual({
			balanceGwei: 32_000_000_001n,
			effectiveBalanceGwei: 32_000_000_000n,
			pubkey: `0x${'a'.repeat(96)}`,
			slashed: false,
			status: 'active_ongoing',
		})
		expect(getValidatorAtHead).toHaveBeenCalledWith(
			1,
			12
		)
	})

	it('projects native header keys, decimal strings, and case only at the schema boundary', async () => {
		getHeader.mockResolvedValue({
			root: `0x${'A'.repeat(64)}`,
			canonical: true,
			header: {
				message: {
					slot: '64',
					proposer_index: '12',
					parent_root: `0x${'B'.repeat(64)}`,
					state_root: `0x${'C'.repeat(64)}`,
					body_root: `0x${'D'.repeat(64)}`,
				},
				signature: `0x${'E'.repeat(192)}`,
			},
		})

		await expect(resolveHeaderBySlot({
			$network: network,
			slot: 64,
		}, {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			publicEnv: {},
		})).resolves.toEqual({
			bodyRoot: `0x${'d'.repeat(64)}`,
			canonical: true,
			parentRoot: `0x${'b'.repeat(64)}`,
			proposerIndex: 12,
			root: `0x${'a'.repeat(64)}`,
			signature: `0x${'e'.repeat(192)}`,
			stateRoot: `0x${'c'.repeat(64)}`,
		})
		expect(getHeader).toHaveBeenCalledWith(
			1,
			64
		)
	})

	it('rejects a native uint64 header index that cannot be represented by the schema number', async () => {
		getHeader.mockResolvedValue({
			root: `0x${'A'.repeat(64)}`,
			canonical: true,
			header: {
				message: {
					slot: '64',
					proposer_index: '18446744073709551615',
					parent_root: `0x${'B'.repeat(64)}`,
					state_root: `0x${'C'.repeat(64)}`,
					body_root: `0x${'D'.repeat(64)}`,
				},
				signature: `0x${'E'.repeat(192)}`,
			},
		})

		await expect(resolveHeaderBySlot({
			$network: network,
			slot: 64,
		}, {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			publicEnv: {},
		})).rejects.toThrow('proposer index must be a safe integer')
	})

	it('rejects a native head-slot uint64 that cannot be represented by resolver numbers', async () => {
		getHeadSlot.mockResolvedValue('18446744073709551615')

		await expect(resolveHeadSlots(network, {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			publicEnv: {},
		})).rejects.toThrow('head slot must be a safe integer')
	})

	it('limits nested network selectors to the eip155 applicability contract', () => {
		expect(indexedValidatorResolver.appliesTo('NetworkIndexInNetwork', {
			$network: network,
			indexInNetwork: 12,
		})).toBe(true)
		expect(indexedValidatorResolver.appliesTo('NetworkIndexInNetwork', {
			$network: {
				slug: 'ethereum',
			},
			indexInNetwork: 12,
		})).toBe(false)
		expect(indexedValidatorResolver.appliesTo('NetworkIndexInNetwork', {
			$network: {
				caip2: {
					namespace: 'cosmos',
					reference: 'cosmoshub-4',
				},
			},
			indexInNetwork: 12,
		})).toBe(false)
	})

	it('rejects non-eip155 selectors before direct resolver calls reach the source', async () => {
		await expect(validatorResolver.resolve.NetworkIndexInNetwork.resolve({
			$network: {
				slug: 'ethereum',
			},
			indexInNetwork: 12,
		})).rejects.toThrow('network must use the eip155 CAIP-2 namespace')
		await expect(validatorResolver.resolve.NetworkIndexInNetwork.resolve({
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: 'not-a-chain-id',
				},
			},
			indexInNetwork: 12,
		})).rejects.toThrow('network must have a positive safe eip155 chain ID')
		expect(getValidatorAtHead).not.toHaveBeenCalled()
	})

	it('projects a slashing network as an entity reference', async () => {
		getBlockDutySummary.mockResolvedValue({
			attestations: [],
			withdrawals: [],
			slashings: [{
				index: 0,
				kind: 'proposer',
			}],
		})

		const slashing = await slashingResolver.resolve.EvmNetworkSlotKindIndexInSlot.resolve({
			$network: network,
			slot: 64,
			kind: 'proposer',
			indexInSlot: 0,
		})

		expect(slashingResolver.projections.$network(slashing)).toEqual({
			[EntityMetaKey.Selector]: network,
		})
		expect(getBlockDutySummary).toHaveBeenCalledWith(
			1,
			64
		)
	})

	it('projects native sync committee membership without re-encoding aggregates', async () => {
		getSyncCommittee.mockResolvedValue({
			validators: [
				'4',
				'5',
			],
			validator_aggregates: [
				['4'],
				['5'],
			],
		})

		await expect(syncCommitteeResolver.resolve.EvmNetworkPeriod.resolve({
			$network: network,
			period: 2,
		})).resolves.toEqual({
			validatorIndices: [
				4,
				5,
			],
		})
		expect(getSyncCommittee).toHaveBeenCalledWith(
			1,
			'head'
		)
	})

	it('preserves missing finality and unmatched fork behavior', async () => {
		getFinalityCheckpoints.mockResolvedValue(undefined)
		getForkSchedule.mockResolvedValue([])

		await expect(finalityResolver.resolve.EvmNetworkTimestampMs.resolve({
			$network: network,
			timestampMs: 1_725_000_000_000,
		})).rejects.toThrow('finality checkpoints not returned')
		await expect(
			resolveForkVersionsByUpgradeId({
				$network: network,
				upgradeId: consensusUpgrade.upgradeId,
			})
		).resolves.toEqual({
			previousForkVersion: undefined,
			currentForkVersion: undefined,
		})
	})
})

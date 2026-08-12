import {
	beaconConsensusNetworks,
	epochsPerSyncCommitteePeriod,
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
	entityFieldAddressKey,
	entityFieldDefinitions,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const getFinalityCheckpoints = vi.hoisted(() => vi.fn())
const getForkSchedule = vi.hoisted(() => vi.fn())
const getCommittees = vi.hoisted(() => vi.fn())
const getSyncCommittee = vi.hoisted(() => vi.fn())
const getValidator = vi.hoisted(() => vi.fn())
const getBlockDutySummary = vi.hoisted(() => vi.fn())
const getHeader = vi.hoisted(() => vi.fn())
const getHeadSlot = vi.hoisted(() => vi.fn())
const getNodeHealthObservation = vi.hoisted(() => vi.fn())
const getNodeIdentityObservation = vi.hoisted(() => vi.fn())
const getNodePeerCountObservation = vi.hoisted(() => vi.fn())
const getNodeSyncingObservation = vi.hoisted(() => vi.fn())
const getNodeVersionObservation = vi.hoisted(() => vi.fn())
const getRecentProposerValidatorIndices = vi.hoisted(() => vi.fn())
const getValidators = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Beacon/Rest/queries.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/sources/Beacon/Rest/queries.ts')>(),
	getFinalityCheckpoints,
	getForkSchedule,
	getCommittees,
	getSyncCommittee,
	getValidator,
	getBlockDutySummary,
	getHeader,
	getHeadSlot,
	getNodeHealthObservation,
	getNodeIdentityObservation,
	getNodePeerCountObservation,
	getNodeSyncingObservation,
	getNodeVersionObservation,
	getRecentProposerValidatorIndices,
	getValidators,
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
	&& '$$timestamps' in resolver.projections
))
const validatorTimestampResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconValidator_Timestamp
))
const networkValidatorsResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$beaconValidators' in resolver.projections.Evm
))
const slashingResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconSlashing
))
const depositResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconDeposit
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
const committeesListResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$beaconCommittees' in resolver.projections.Evm
))
const slotCommitteesListResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconSlot
	&& '$$beaconCommittees' in resolver.projections
))
const syncCommitteesListResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$beaconSyncCommittees' in resolver.projections.Evm
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
	|| validatorTimestampResolver == null
	|| depositResolver == null
	|| slashingResolver == null
	|| headerResolver == null
	|| headSlotResolver == null
	|| committeesListResolver == null
	|| slotCommitteesListResolver == null
	|| syncCommitteesListResolver == null
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
const resolveCommitteesList = (
	'Caip2' in committeesListResolver.resolve ?
		committeesListResolver.resolve.Caip2.resolve
	:
		undefined
)
const resolveSlotCommitteesList = (
	'EvmNetworkSlot' in slotCommitteesListResolver.resolve ?
		slotCommitteesListResolver.resolve.EvmNetworkSlot.resolve
	:
		undefined
)
const resolveSyncCommitteesList = (
	'Caip2' in syncCommitteesListResolver.resolve ?
		syncCommitteesListResolver.resolve.Caip2.resolve
	:
		undefined
)
if (resolveForkVersionsByUpgradeId == null)
	throw new Error('Beacon REST fork resolver does not accept upgrade IDs')
if (resolveHeaderBySlot == null)
	throw new Error('Beacon REST header resolver does not accept slots')
if (resolveHeadSlots == null)
	throw new Error('Beacon REST head-slot resolver does not accept CAIP-2 networks')
if (resolveCommitteesList == null || resolveSlotCommitteesList == null)
	throw new Error('Beacon REST committee list resolvers are not registered')
if (resolveSyncCommitteesList == null)
	throw new Error('Beacon REST sync-committee list resolver does not accept CAIP-2 networks')

const tipValidatorEnvelope = {
	validator: {
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
	},
	executionOptimistic: true,
	finalized: false,
} as const

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
			slotsPerEpoch,
		])
		expect(beaconConsensusNetworks.every((network) => (
			!Object.hasOwn(network, 'restBaseUrl')
		))).toBe(true)
		expect(epochsPerSyncCommitteePeriod).toBe(256)
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

	it('materializes committee membership in network and slot lists without detail refetches', async () => {
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
		const context = {
			filters: [],
			sorts: [],
			pagination: {
				limit: 10,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		}
		const expectedCommittee = {
			[EntityMetaKey.Selector]: {
				$network: network,
				slot: 64,
				indexInSlot: 1,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconCommittee, [], 'validatorIndices')]: [
					2,
					3,
				],
			},
		}

		await expect(resolveCommitteesList(network, context)).resolves.toEqual([expectedCommittee])
		await expect(resolveSlotCommitteesList({
			$network: network,
			slot: 64,
		}, context)).resolves.toEqual([expectedCommittee])
		expect(getCommittees).toHaveBeenNthCalledWith(1, 1)
		expect(getCommittees).toHaveBeenNthCalledWith(2, 1, '64')
	})

	it('projects tip BeaconValidator fields and $$timestamps from head-slot state', async () => {
		getHeadSlot.mockResolvedValue('9500000')
		getValidator.mockResolvedValue(tipValidatorEnvelope)

		const validator = await validatorResolver.resolve.NetworkIndexInNetwork.resolve({
			$network: network,
			indexInNetwork: 12,
		})
		expect(validator).toMatchObject({
			indexInNetwork: 12,
			balanceGwei: 32_000_000_001n,
			effectiveBalanceGwei: 32_000_000_000n,
			pubkey: `0x${'a'.repeat(96)}`,
			slashed: false,
			status: 'active_ongoing',
			activationEpoch: 11,
			finalized: false,
			executionOptimistic: true,
		})
		expect(validatorResolver.projections.$$timestamps(validator)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$validator: {
						$network: network,
						indexInNetwork: 12,
					},
					slot: 9_500_000,
					source: Source.Beacon_Rest,
				},
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.BeaconValidator_Timestamp, [], 'status')]: 'active_ongoing',
					[entityFieldAddressKey(EntityType.BeaconValidator_Timestamp, [], 'slashed')]: false,
					[entityFieldAddressKey(EntityType.BeaconValidator_Timestamp, [], 'activationEpoch')]: 11,
					[entityFieldAddressKey(EntityType.BeaconValidator_Timestamp, [], 'withdrawalCredentials')]: `0x${'b'.repeat(64)}`,
					[entityFieldAddressKey(EntityType.BeaconValidator_Timestamp, [], 'finalized')]: false,
					[entityFieldAddressKey(EntityType.BeaconValidator_Timestamp, [], 'executionOptimistic')]: true,
				}),
			},
		])
		expect(getValidator).toHaveBeenCalledWith(
			1,
			12,
			9_500_000
		)
		expect(getValidator).toHaveBeenCalledOnce()
	})

	it('materializes recent proposer snapshots from one coordinate-bound validator read', async () => {
		if (networkValidatorsResolver == null || !('Caip2' in networkValidatorsResolver.resolve))
			throw new Error('Beacon_Rest: missing network validator collection resolver')

		getHeadSlot.mockResolvedValue('9500000')
		getRecentProposerValidatorIndices.mockResolvedValue(['12'])
		getValidators.mockResolvedValue({
			validators: [tipValidatorEnvelope.validator],
			executionOptimistic: true,
			finalized: false,
		})
		const context = {
			filters: [],
			sorts: [],
			pagination: {
				limit: 10,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		}

		const validators = await networkValidatorsResolver.resolve.Caip2.resolve(network, context)
		expect(validators).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				indexInNetwork: 12,
			},
			[EntityMetaKey.Fields]: expect.objectContaining({
				[entityFieldAddressKey(EntityType.BeaconValidator, [], 'pubkey')]: `0x${'a'.repeat(96)}`,
				[entityFieldAddressKey(EntityType.BeaconValidator, [], 'balanceGwei')]: 32_000_000_001n,
				[entityFieldAddressKey(EntityType.BeaconValidator, [], 'status')]: 'active_ongoing',
				[entityFieldAddressKey(EntityType.BeaconValidator, [], '$$timestamps')]: [{
					[EntityMetaKey.Selector]: {
						$validator: {
							$network: network,
							indexInNetwork: 12,
						},
						slot: 9_500_000,
						source: Source.Beacon_Rest,
					},
					[EntityMetaKey.Fields]: expect.objectContaining({
						[entityFieldAddressKey(EntityType.BeaconValidator_Timestamp, [], 'finalized')]: false,
						[entityFieldAddressKey(EntityType.BeaconValidator_Timestamp, [], 'executionOptimistic')]: true,
					}),
				}],
			}),
		}])
		expect(getRecentProposerValidatorIndices).toHaveBeenCalledWith({
			chainId: 1,
			headSlot: 9_500_000,
			limit: 10,
			slotLookbackCap: 80,
		})
		expect(getValidators).toHaveBeenCalledWith(1, ['12'], 9_500_000)
		getValidator.mockReset()
		expect(getValidator).not.toHaveBeenCalled()
	})

	it('resolves validators by NetworkPubkey against the tip observation slot', async () => {
		getHeadSlot.mockResolvedValue('9500000')
		getValidator.mockResolvedValue(tipValidatorEnvelope)

		await expect(validatorResolver.resolve.NetworkPubkey.resolve({
			$network: network,
			pubkey: `0x${'a'.repeat(96)}`,
		})).resolves.toMatchObject({
			indexInNetwork: 12,
			pubkey: `0x${'a'.repeat(96)}`,
			status: 'active_ongoing',
		})
		expect(getValidator).toHaveBeenCalledWith(
			1,
			`0x${'a'.repeat(96)}`,
			9_500_000
		)
	})

	it('projects tip BeaconValidator_Timestamp and rejects foreign observation slots', async () => {
		getHeadSlot
			.mockResolvedValueOnce('9500000')
			.mockResolvedValueOnce('9500000')
		getValidator
			.mockResolvedValueOnce(tipValidatorEnvelope)
			.mockResolvedValueOnce(tipValidatorEnvelope)

		await expect(validatorTimestampResolver.resolve.ValidatorSlotSource.resolve({
			$validator: {
				$network: network,
				indexInNetwork: 12,
			},
			slot: 9_500_000,
			source: Source.Beacon_Rest,
		})).resolves.toMatchObject({
			slot: 9_500_000,
			source: Source.Beacon_Rest,
			balanceGwei: 32_000_000_001n,
			activationEpoch: 11,
			status: 'active_ongoing',
			finalized: false,
			executionOptimistic: true,
		})

		await expect(validatorTimestampResolver.resolve.ValidatorSlotSource.resolve({
			$validator: {
				$network: network,
				indexInNetwork: 12,
			},
			slot: 1,
			source: Source.Beacon_Rest,
		})).rejects.toThrow('no validator observation at slot 1')
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
		getHeader.mockResolvedValue({
			root: `0x${'A'.repeat(64)}`,
			canonical: true,
			header: {
				message: {
					slot: '18446744073709551615',
					proposer_index: '1',
					parent_root: `0x${'B'.repeat(64)}`,
					state_root: `0x${'C'.repeat(64)}`,
					body_root: `0x${'D'.repeat(64)}`,
				},
				signature: `0x${'E'.repeat(192)}`,
			},
		})

		await expect(resolveHeadSlots(network, {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			publicEnv: {},
		})).rejects.toThrow('head slot must be a safe integer')
	})

	it('materializes recent slot headers from the bounded network collection', async () => {
		getHeader.mockImplementation(async (_chainId, slot) => ({
			root: `0x${'A'.repeat(64)}`,
			canonical: true,
			header: {
				message: {
					slot: slot === 'head' ? '64' : String(slot),
					proposer_index: '12',
					parent_root: `0x${'B'.repeat(64)}`,
					state_root: `0x${'C'.repeat(64)}`,
					body_root: `0x${'D'.repeat(64)}`,
				},
				signature: `0x${'E'.repeat(192)}`,
			},
		}))

		const slots = await resolveHeadSlots(network, {
			filters: [],
			sorts: [],
			pagination: {
				limit: 2,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			publicEnv: {},
		})
		expect(slots).toHaveLength(2)
		expect(slots[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$network: network,
				slot: 64,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconSlot, [], 'epoch')]: 2,
				[entityFieldAddressKey(EntityType.BeaconSlot, [], 'canonical')]: true,
				[entityFieldAddressKey(EntityType.BeaconSlot, [], 'proposerIndex')]: 12,
				[entityFieldAddressKey(EntityType.BeaconSlot, [], 'root')]: `0x${'a'.repeat(64)}`,
			},
		})
		expect(getHeader).toHaveBeenCalledWith(1, 'head')
		expect(getHeader).toHaveBeenCalledWith(1, 63)
		expect(getHeader).toHaveBeenCalledTimes(2)
	})

	it('limits nested network selectors to the eip155 applicability contract', () => {
		expect(indexedValidatorResolver.appliesTo('NetworkIndexInNetwork', {
			$network: network,
			indexInNetwork: 12,
		})).toBe(true)
		expect(indexedValidatorResolver.appliesTo('NetworkPubkey', {
			$network: network,
			pubkey: `0x${'a'.repeat(96)}`,
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
		expect(getValidator).not.toHaveBeenCalled()
		expect(getHeadSlot).not.toHaveBeenCalled()
	})

	it('projects a slashing network as an entity reference', async () => {
		getBlockDutySummary.mockResolvedValue({
			deposits: [],
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

	it('resolves a deposit route from its slot-local index', async () => {
		getBlockDutySummary.mockResolvedValue({
			deposits: [{
				index: 0,
				pubkey: `0x${'22'.repeat(48)}`,
				withdrawalCredentials: `0x${'33'.repeat(32)}`,
				amountGwei: 32_000_000_000n,
				signature: `0x${'44'.repeat(96)}`,
				proof: [`0x${'11'.repeat(32)}`],
			}],
			attestations: [],
			withdrawals: [],
			slashings: [],
		})

		const deposit = await depositResolver.resolve.EvmNetworkSlotIndexInSlot.resolve({
			$network: network,
			slot: 64,
			indexInSlot: 0,
		})

		expect(depositResolver.projections.$validator(deposit)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				pubkey: `0x${'22'.repeat(48)}`,
			},
		})
		expect(depositResolver.projections.amountGwei(deposit)).toBe(32_000_000_000n)
		expect(getBlockDutySummary).toHaveBeenCalledWith(
			1,
			64
		)
	})

	it('materializes native duty cards from one block summary', async () => {
		getBlockDutySummary.mockResolvedValue({
			deposits: [{
				index: 0,
				pubkey: `0x${'22'.repeat(48)}`,
				withdrawalCredentials: `0x${'33'.repeat(32)}`,
				amountGwei: 32_000_000_000n,
				signature: `0x${'44'.repeat(96)}`,
				proof: [`0x${'11'.repeat(32)}`],
			}],
			attestations: [{
				index: 2,
				committeeIndex: 4,
				aggregationBits: '0x03',
			}],
			withdrawals: [{
				index: 5,
				validatorIndex: 12,
				address: '0000000000000000000000000000000000000001',
				amountGwei: 32_000_000_000n,
			}],
			slashings: [{
				index: 1,
				kind: 'attester',
			}],
		})
		const dutySummaryResolver = beaconRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.BeaconSlot
			&& '$$beaconDeposits' in resolver.projections
			&& '$$beaconAttestations' in resolver.projections
			&& '$$beaconWithdrawals' in resolver.projections
			&& '$$beaconSlashings' in resolver.projections
		))
		if (dutySummaryResolver == null || !('EvmNetworkSlot' in dutySummaryResolver.resolve))
			throw new Error('Beacon REST block duty summary resolver is not registered')

		const dutySummary = await dutySummaryResolver.resolve.EvmNetworkSlot.resolve({
			$network: network,
			slot: 64,
		}, {
			filters: [],
			sorts: [],
			pagination: {
				limit: 4,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})
		expect(dutySummaryResolver.projections.$$beaconDeposits(dutySummary)).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$network: network,
				slot: 64,
				indexInSlot: 0,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconDeposit, [], 'pubkey')]: `0x${'22'.repeat(48)}`,
				[entityFieldAddressKey(EntityType.BeaconDeposit, [], '$validator')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						pubkey: `0x${'22'.repeat(48)}`,
					},
				},
				[entityFieldAddressKey(EntityType.BeaconDeposit, [], 'amountGwei')]: 32_000_000_000n,
			},
		}])

		expect(dutySummaryResolver.projections.$$beaconAttestations(dutySummary)).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$network: network,
				slot: 64,
				indexInSlot: 2,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconAttestation, [], 'committeeIndex')]: 4,
				[entityFieldAddressKey(EntityType.BeaconAttestation, [], 'aggregationBits')]: '0x03',
			},
		}])
		expect(dutySummaryResolver.projections.$$beaconWithdrawals(dutySummary)).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$network: network,
				slot: 64,
				indexInSlot: 5,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], 'validatorIndex')]: 12,
				[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], 'amountGwei')]: 32_000_000_000n,
				[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], '$validator')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						indexInNetwork: 12,
					},
				},
			},
		}])
		expect(dutySummaryResolver.projections.$$beaconSlashings(dutySummary)).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$network: network,
				slot: 64,
				kind: 'attester',
				indexInSlot: 1,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconSlashing, [], 'kind')]: 'attester',
			},
		}])
	})

	it('projects historical sync committee membership from the period start slot', async () => {
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
			2 * epochsPerSyncCommitteePeriod * slotsPerEpoch
		)
	})

	it('lists recent sync committee periods back from tip', async () => {
		getHeadSlot.mockResolvedValue(String(2 * epochsPerSyncCommitteePeriod * slotsPerEpoch + 1))
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

		await expect(resolveSyncCommitteesList(network, {
			filters: [],
			sorts: [],
			pagination: {
				limit: 3,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			publicEnv: {},
		})).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					period: 2,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BeaconSyncCommittee, [], 'validatorIndices')]: [4, 5],
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					period: 1,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BeaconSyncCommittee, [], 'validatorIndices')]: [4, 5],
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					period: 0,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BeaconSyncCommittee, [], 'validatorIndices')]: [4, 5],
				},
			},
		])
		expect(getSyncCommittee).toHaveBeenCalledTimes(3)
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

describe('Beacon endpoint observation', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		getNodeHealthObservation.mockResolvedValue({
			statusCode: 206,
			endpointUrl: 'https://ethereum-beacon-api.publicnode.com',
			fetchedAtMs: 1_785_477_600_101,
		})
		getNodeIdentityObservation.mockResolvedValue({
			peer_id: 'peer-id',
			enr: 'enr:-example',
			p2p_addresses: ['/ip4/127.0.0.1/tcp/9000'],
			discovery_addresses: ['/ip4/127.0.0.1/udp/9000'],
			metadata: {
				seq_number: '7',
				attnets: '0x01',
				syncnets: '0x02',
				custody_group_count: '3',
			},
			endpointUrl: 'https://ethereum-beacon-api.publicnode.com',
			fetchedAtMs: 1_785_477_600_102,
		})
		getNodePeerCountObservation.mockResolvedValue({
			disconnected: '1',
			connecting: '2',
			connected: '3',
			disconnecting: '4',
			endpointUrl: 'https://ethereum-beacon-api.publicnode.com',
			fetchedAtMs: 1_785_477_600_103,
		})
		getNodeSyncingObservation.mockResolvedValue({
			head_slot: '12345678',
			sync_distance: '9',
			is_syncing: true,
			is_optimistic: false,
			el_offline: false,
			endpointUrl: 'https://ethereum-beacon-api.publicnode.com',
			fetchedAtMs: 1_785_477_600_104,
		})
		getNodeVersionObservation.mockResolvedValue({
			version: 'Lighthouse/v7.1.0',
			endpointUrl: 'https://ethereum-beacon-api.publicnode.com',
			fetchedAtMs: 1_785_477_600_105,
		})
	})

	it('materializes one complete current Beacon endpoint snapshot from Network', async () => {
		const resolver = beaconRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& '$$endpointObservations' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Beacon endpoint observation resolver is not registered')

		const observation = await resolver.resolve.Caip2.resolve(network, {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})

		expect(resolver.projections.$$endpointObservations(observation)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				endpointUrl: 'https://ethereum-beacon-api.publicnode.com',
				endpointKind: 'EthereumBeaconRest',
				timestampMs: 1_785_477_600_105,
				source: Source.Beacon_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'disconnectedPeerCount')]: 1n,
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'connectingPeerCount')]: 2n,
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'connectedPeerCount')]: 3n,
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'disconnectingPeerCount')]: 4n,
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'headSlot')]: 12_345_678n,
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'syncDistance')]: 9n,
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'isSyncing')]: true,
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'isOptimistic')]: false,
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'executionLayerOffline')]: false,
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'version')]: 'Lighthouse/v7.1.0',
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'peerId')]: 'peer-id',
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'enr')]: 'enr:-example',
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'p2pAddresses')]: ['/ip4/127.0.0.1/tcp/9000'],
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'discoveryAddresses')]: ['/ip4/127.0.0.1/udp/9000'],
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'metadataSequenceNumber')]: 7n,
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'attestationSubnets')]: '0x01',
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'syncCommitteeSubnets')]: '0x02',
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'custodyGroupCount')]: 3n,
				[entityFieldAddressKey(EntityType.NetworkEndpointObservation_Timestamp, ['Beacon'], 'statusCode')]: 206,
			},
		}])
		expect(beaconRest.resolvers.some((candidate) => (
			candidate.entityType === EntityType.NetworkEndpointObservation_Timestamp
		))).toBe(false)
	})

	it('rejects an incomplete Beacon facet instead of publishing a partial snapshot', async () => {
		getNodeVersionObservation.mockRejectedValue(new Error('version unavailable'))
		const resolver = beaconRest.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& '$$endpointObservations' in candidate.projections
		))
		if (resolver == null)
			throw new Error('Beacon endpoint observation resolver is not registered')

		await expect(resolver.resolve.Caip2.resolve(network, {
			filters: [],
			sorts: [],
			pagination: {},
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})).rejects.toThrow('version unavailable')
	})
})

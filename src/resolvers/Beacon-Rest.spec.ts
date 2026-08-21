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
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'

const getFinalityCheckpoints = vi.hoisted(() => vi.fn())
const getForkSchedule = vi.hoisted(() => vi.fn())
const getCommittees = vi.hoisted(() => vi.fn())
const getProposerDuties = vi.hoisted(() => vi.fn())
const getSyncCommittee = vi.hoisted(() => vi.fn())
const getValidator = vi.hoisted(() => vi.fn())
const getBlockDutySummary = vi.hoisted(() => vi.fn())
const getBeaconBlockSnapshot = vi.hoisted(() => vi.fn())
const getExecutionPayloadEnvelope = vi.hoisted(() => vi.fn())
const getBlockRewards = vi.hoisted(() => vi.fn())
const getAttestationRewards = vi.hoisted(() => vi.fn())
const getSyncCommitteeRewards = vi.hoisted(() => vi.fn())
const getDataColumnSidecars = vi.hoisted(() => vi.fn())
const getHeader = vi.hoisted(() => vi.fn())
const getHeadersAtSlot = vi.hoisted(() => vi.fn())
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
	getProposerDuties,
	getSyncCommittee,
	getValidator,
	getBlockDutySummary,
	getBeaconBlockSnapshot,
	getExecutionPayloadEnvelope,
	getBlockRewards,
	getAttestationRewards,
	getSyncCommitteeRewards,
	getDataColumnSidecars,
	getHeader,
	getHeadersAtSlot,
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
const finalityTimestampsResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$beaconFinalityTimestamps' in resolver.projections.Evm
	&& resolver.resolveLive == null
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
const validatorRewardResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconValidator_Timestamp
	&& 'attestationHeadRewardGwei' in resolver.projections
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
const slotBlocksResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconSlot
	&& '$$blocks' in resolver.projections
))
const blockRewardsResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconBlock
	&& 'rewardTotalGwei' in resolver.projections
))
const beaconBlockResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconBlock
	&& 'root' in resolver.projections
))
const executionPayloadBidResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconExecutionPayloadBid
))
const executionPayloadEnvelopeResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconExecutionPayloadEnvelope
))
const executionConsolidationRequestResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconExecutionConsolidationRequest
))
const executionDepositRequestResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconExecutionDepositRequest
))
const executionWithdrawalRequestResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconExecutionWithdrawalRequest
))
const headSlotResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$beaconSlots' in resolver.projections.Evm
))
const networkEpochsResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.Network
	&& 'Evm' in resolver.projections
	&& '$$beaconEpochs' in resolver.projections.Evm
	&& resolver.resolveLive == null
))
const epochSlotsResolver = beaconRest.resolvers.find((resolver) => (
	resolver.entityType === EntityType.BeaconEpoch
	&& '$$beaconSlots' in resolver.projections
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
	|| finalityTimestampsResolver == null
	|| previousForkVersionResolver == null
	|| currentForkVersionResolver == null
	|| committeeResolver == null
	|| syncCommitteeResolver == null
	|| validatorResolver == null
	|| validatorTimestampResolver == null
	|| validatorRewardResolver == null
	|| depositResolver == null
	|| slashingResolver == null
	|| blockRewardsResolver == null
	|| slotBlocksResolver == null
	|| beaconBlockResolver == null
	|| executionPayloadBidResolver == null
	|| executionPayloadEnvelopeResolver == null
	|| executionConsolidationRequestResolver == null
	|| executionDepositRequestResolver == null
	|| executionWithdrawalRequestResolver == null
	|| headSlotResolver == null
	|| networkEpochsResolver == null
	|| epochSlotsResolver == null
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
				reference: '560048',
			},
		})).toBe(true)
		expect(beaconRestByChainId.get(560048)?.restBaseUrls).toEqual([
			'https://ethereum-hoodi-beacon-api.publicnode.com',
		])
		expect(indexedConsensusEndpointsResolver.appliesTo('Caip2', {
			caip2: {
				namespace: 'eip155',
				reference: '17000',
			},
		})).toBe(false)
		expect(indexedConsensusEndpointsResolver.appliesTo('Caip2', {
			caip2: {
				namespace: 'eip155',
				reference: '10',
			},
		})).toBe(false)
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

		await expect(finalityTimestampsResolver.resolve.Caip2.resolve(network)).resolves.toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				timestampMs: expect.any(Number),
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'currentJustifiedCheckpointEpoch')]: 101,
				[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'currentJustifiedCheckpointRoot')]: '0xccdd',
				[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'previousJustifiedCheckpointEpoch')]: 100,
				[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'previousJustifiedCheckpointRoot')]: '0xaabb',
				[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'finalizedCheckpointEpoch')]: 99,
				[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'finalizedCheckpointRoot')]: '0xeeff',
			},
		}])
		expect(beaconRest.resolvers.some((resolver) => (
			resolver.entityType === EntityType.EthereumBeaconFinality_Timestamp
		))).toBe(false)
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

		const snapshot = await resolveCommitteesList(network, context)
		const slotSnapshot = await resolveSlotCommitteesList({
			$network: network,
			slot: 64,
		}, context)
		expect(committeesListResolver.projections.Evm.$$beaconCommittees(snapshot)).toEqual([expectedCommittee])
		expect(slotCommitteesListResolver.projections.$$beaconCommittees.select(slotSnapshot)).toEqual([expectedCommittee])
		expect(slotCommitteesListResolver.projections.$$beaconCommittees.resolveCount(slotSnapshot)).toBe(1)
		expect(slotCommitteesListResolver.projections.$$beaconCommittees.continuation(slotSnapshot)).toEqual({
			operation: 'slot-beacon-committees',
			target: 'beacon-rest',
			terminal: true,
		})
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

	it('keeps epoch $$beaconSlots resolveCount from the complete proposer-duty set when the page is windowed', async () => {
		getProposerDuties.mockResolvedValue([
			{
				pubkey: `0x${'1'.repeat(96)}`,
				validator_index: '12',
				slot: '64',
			},
			{
				pubkey: `0x${'2'.repeat(96)}`,
				validator_index: '13',
				slot: '65',
			},
			{
				pubkey: `0x${'3'.repeat(96)}`,
				validator_index: '14',
				slot: '66',
			},
		])
		getHeadersAtSlot.mockResolvedValue([])

		const snapshot = await epochSlotsResolver.resolve.EvmNetworkEpoch.resolve({
			$network: network,
			epoch: 2,
		}, {
			filters: [],
			sorts: [],
			pagination: {
				limit: 1,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			publicEnv: {},
		})
		expect(epochSlotsResolver.projections.$$beaconSlots.select(snapshot)).toHaveLength(1)
		expect(epochSlotsResolver.projections.$$beaconSlots.resolveCount(snapshot)).toBe(3)
	})

	it('keeps slot duty resolveCount from the complete block payload when the page is windowed', async () => {
		const dutySummaryResolver = beaconRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.BeaconSlot
			&& '$$beaconDeposits' in resolver.projections
			&& '$$beaconAttestations' in resolver.projections
		))
		if (dutySummaryResolver == null || !('EvmNetworkSlot' in dutySummaryResolver.resolve))
			throw new Error('Beacon REST block duty summary resolver is not registered')

		getBeaconBlockSnapshot.mockResolvedValue({
			root: `0x${'11'.repeat(32)}`,
			deposits: [
				{
					index: 0,
					indexInBlock: 0,
					pubkey: `0x${'22'.repeat(48)}`,
					withdrawalCredentials: `0x${'33'.repeat(32)}`,
					amountGwei: 32_000_000_000n,
					signature: `0x${'44'.repeat(96)}`,
					proof: [`0x${'11'.repeat(32)}`],
				},
				{
					index: 1,
					indexInBlock: 1,
					pubkey: `0x${'55'.repeat(48)}`,
					withdrawalCredentials: `0x${'66'.repeat(32)}`,
					amountGwei: 32_000_000_000n,
					signature: `0x${'77'.repeat(96)}`,
					proof: [`0x${'11'.repeat(32)}`],
				},
			],
			attestations: [
				{
					index: 0,
					indexInBlock: 0,
					committeeIndex: 1,
					aggregationBits: '0x01',
				},
				{
					index: 1,
					indexInBlock: 1,
					committeeIndex: 2,
					aggregationBits: '0x03',
				},
			],
			withdrawals: [],
			slashings: [],
		})

		const dutySummary = await dutySummaryResolver.resolve.EvmNetworkSlot.resolve({
			$network: network,
			slot: 64,
		}, {
			filters: [],
			sorts: [],
			pagination: {
				limit: 1,
			},
			providerContinuationToken: '1',
			selectorKeys: [],
			parentSelectorKeys: [],
			sources: [],
			publicEnv: {},
		})
		expect(dutySummaryResolver.projections.$$beaconDeposits.select(dutySummary)).toHaveLength(1)
		expect(dutySummaryResolver.projections.$$beaconDeposits.select(dutySummary)[0][EntityMetaKey.Selector].indexInBlock).toBe(1)
		expect(dutySummaryResolver.projections.$$beaconDeposits.resolveCount(dutySummary)).toBe(2)
		expect(dutySummaryResolver.projections.$$beaconAttestations.select(dutySummary)).toHaveLength(1)
		expect(dutySummaryResolver.projections.$$beaconAttestations.select(dutySummary)[0][EntityMetaKey.Selector].indexInBlock).toBe(1)
		expect(dutySummaryResolver.projections.$$beaconAttestations.resolveCount(dutySummary)).toBe(2)
		expect(dutySummaryResolver.projections.$$beaconDeposits.continuation(dutySummary)).toEqual({
			operation: 'slot-beacon-deposits',
			target: 'beacon-rest',
			terminal: true,
		})
	})

	it('counts complete BeaconBlock children from the unsliced block payload', async () => {
		getBeaconBlockSnapshot.mockResolvedValue({
			version: 'electra',
			root: `0x${'a'.repeat(64)}`,
			slot: 64,
			proposerIndex: 12,
			parentRoot: `0x${'b'.repeat(64)}`,
			stateRoot: `0x${'c'.repeat(64)}`,
			bodyRoot: `0x${'d'.repeat(64)}`,
			signature: `0x${'e'.repeat(192)}`,
			canonical: true,
			executionOptimistic: false,
			finalized: true,
			deposits: [
				{
					index: 0,
					indexInBlock: 0,
					pubkey: `0x${'22'.repeat(48)}`,
					withdrawalCredentials: `0x${'33'.repeat(32)}`,
					amountGwei: 32_000_000_000n,
					signature: `0x${'44'.repeat(96)}`,
					proof: [`0x${'11'.repeat(32)}`],
				},
				{
					index: 1,
					indexInBlock: 1,
					pubkey: `0x${'55'.repeat(48)}`,
					withdrawalCredentials: `0x${'66'.repeat(32)}`,
					amountGwei: 32_000_000_000n,
					signature: `0x${'77'.repeat(96)}`,
					proof: [`0x${'11'.repeat(32)}`],
				},
			],
			attestations: [
				{
					index: 0,
					indexInBlock: 0,
					committeeIndex: 1,
					aggregationBits: '0x01',
				},
			],
			withdrawals: [],
			slashings: [],
		})

		const block = await beaconBlockResolver.resolve.NetworkRoot.resolve({
			$network: network,
			root: `0x${'a'.repeat(64)}`,
		})
		expect(beaconBlockResolver.projections.$$deposits.select(block)).toHaveLength(2)
		expect(beaconBlockResolver.projections.$$deposits.resolveCount(block)).toBe(2)
		expect(beaconBlockResolver.projections.$$attestations.select(block)).toHaveLength(1)
		expect(beaconBlockResolver.projections.$$attestations.resolveCount(block)).toBe(1)
		expect(beaconBlockResolver.projections.$$withdrawals.resolveCount(block)).toBe(0)
		expect(beaconBlockResolver.projections.$$slashings.resolveCount(block)).toBe(0)
	})

	it('walks Network.Evm.$$beaconSlots by exact next-slot continuation without inferring the page length', async () => {
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
		const pageContext = {
			filters: [],
			sorts: [],
			pagination: {
				limit: 2,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			publicEnv: {},
		}
		const firstPage = await resolveHeadSlots(network, pageContext)
		expect(headSlotResolver.projections.Evm.$$beaconSlots.select(firstPage).map((slot) => (
			slot[EntityMetaKey.Selector].slot
		))).toEqual([64, 63])
		expect(headSlotResolver.projections.Evm.$$beaconSlots.resolveCount(firstPage)).toBe(65)
		const continuation = headSlotResolver.projections.Evm.$$beaconSlots.continuation(firstPage)
		expect(continuation).toEqual({
			operation: 'network-beacon-slots',
			terminal: false,
			token: '62',
		})
		if (!('token' in continuation))
			throw new Error('expected slots continuation token')
		const nextPage = await resolveHeadSlots(network, {
			...pageContext,
			providerContinuationToken: continuation.token,
		})
		expect(headSlotResolver.projections.Evm.$$beaconSlots.select(nextPage).map((slot) => (
			slot[EntityMetaKey.Selector].slot
		))).toEqual([62, 61])
		expect(headSlotResolver.projections.Evm.$$beaconSlots.resolveCount(nextPage)).toBe(65)
	})

	it('walks Network.Evm.$$beaconEpochs by exact next-epoch continuation from genesis-to-head', async () => {
		if (!('Caip2' in networkEpochsResolver.resolve))
			throw new Error('Beacon REST epoch list resolver does not accept CAIP-2 networks')
		getHeadSlot.mockResolvedValue('191')
		const pageContext = {
			filters: [],
			sorts: [],
			pagination: {
				limit: 2,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			publicEnv: {},
		}
		const firstPage = await networkEpochsResolver.resolve.Caip2.resolve(network, pageContext)
		expect(networkEpochsResolver.projections.Evm.$$beaconEpochs.select(firstPage)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					epoch: 5,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					epoch: 4,
				},
			},
		])
		expect(networkEpochsResolver.projections.Evm.$$beaconEpochs.resolveCount(firstPage)).toBe(6)
		const continuation = networkEpochsResolver.projections.Evm.$$beaconEpochs.continuation(firstPage)
		expect(continuation).toEqual({
			operation: 'network-beacon-epochs',
			terminal: false,
			token: '3',
		})
		if (!('token' in continuation))
			throw new Error('expected epochs continuation token')
		const nextPage = await networkEpochsResolver.resolve.Caip2.resolve(network, {
			...pageContext,
			providerContinuationToken: continuation.token,
		})
		expect(networkEpochsResolver.projections.Evm.$$beaconEpochs.select(nextPage).map((epoch) => (
			epoch[EntityMetaKey.Selector].epoch
		))).toEqual([3, 2])
		expect(networkEpochsResolver.projections.Evm.$$beaconEpochs.resolveCount(nextPage)).toBe(6)
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
		expect(networkValidatorsResolver.projections.Evm.$$beaconValidators.resolveCount).toBeUndefined()
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

	it('projects BeaconValidator_Timestamp at its requested historical state slot', async () => {
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
		})).resolves.toMatchObject({
			slot: 1,
			source: Source.Beacon_Rest,
			status: 'active_ongoing',
		})
		expect(getValidator).toHaveBeenNthCalledWith(1, 1, 12, 9_500_000)
		expect(getValidator).toHaveBeenNthCalledWith(2, 1, 12, 1)
	})

	it('treats a beacon slot as a coordinate and does not project a canonical header onto it', async () => {
		const slotEpochResolver = beaconRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.BeaconSlot
			&& 'epoch' in resolver.projections
			&& !('$$blocks' in resolver.projections)
		))
		if (slotEpochResolver == null)
			throw new Error('Beacon REST slot epoch resolver is not registered')

		await expect(slotEpochResolver.resolve.EvmNetworkSlot.resolve({
			$network: network,
			slot: 64,
		})).resolves.toEqual({
			epoch: 2,
		})
		expect(getHeader).not.toHaveBeenCalled()
	})

	it('materializes a fork-root block and source-clocked canonicality observation', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_750_000_000_000)
		getHeadersAtSlot.mockResolvedValue([
			{
				root: `0x${'a'.repeat(64)}`,
			},
			{
				root: `0x${'1'.repeat(64)}`,
			},
		])
		getBeaconBlockSnapshot.mockImplementation(async (_chainId, root) => ({
			version: 'electra',
			root,
			slot: 64,
			proposerIndex: 12,
			parentRoot: `0x${'b'.repeat(64)}`,
			stateRoot: `0x${'c'.repeat(64)}`,
			bodyRoot: `0x${'d'.repeat(64)}`,
			signature: `0x${'e'.repeat(192)}`,
			canonical: root === `0x${'a'.repeat(64)}`,
			executionOptimistic: false,
			finalized: root === `0x${'a'.repeat(64)}`,
			executionBlockHash: `0x${'f'.repeat(64)}`,
			deposits: [],
			attestations: [],
			withdrawals: [],
			slashings: [],
		}))
		const selector = {
			$network: network,
			root: `0x${'a'.repeat(64)}`,
		}
		const block = await beaconBlockResolver.resolve.NetworkRoot.resolve(selector)
		const slotSnapshot = await slotBlocksResolver.resolve.EvmNetworkSlot.resolve({
			$network: network,
			slot: 64,
		})
		const blocks = slotBlocksResolver.projections.$$blocks.select(slotSnapshot)

		expect(block).toMatchObject({
			root: selector.root,
			version: 'electra',
			$slot: {
				[EntityMetaKey.Selector]: {
					slot: 64,
				},
			},
			$executionBlock: {
				[EntityMetaKey.Selector]: {
					hash: `0x${'f'.repeat(64)}`,
				},
			},
		})
		expect(block?.$$timestamps[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				timestampMs: 1_750_000_000_000,
				source: Source.Beacon_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconBlock_Timestamp, [], 'canonical')]: true,
				[entityFieldAddressKey(EntityType.BeaconBlock_Timestamp, [], 'finalized')]: true,
			},
		})
		expect(blocks).toHaveLength(2)
		expect(slotBlocksResolver.projections.$$blocks.resolveCount(slotSnapshot)).toBe(2)
		expect(slotBlocksResolver.projections.$executionBlock(slotSnapshot)).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				hash: `0x${'f'.repeat(64)}`,
			},
		})
		expect(blocks[0]).toMatchObject({
			[EntityMetaKey.Selector]: { root: selector.root },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconBlock, [], 'version')]: 'electra',
				[entityFieldAddressKey(EntityType.BeaconBlock, [], '$$timestamps')]: [{
					[EntityMetaKey.Selector]: {
						timestampMs: 1_750_000_000_000,
						source: Source.Beacon_Rest,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.BeaconBlock_Timestamp, [], 'canonical')]: true,
						[entityFieldAddressKey(EntityType.BeaconBlock_Timestamp, [], 'finalized')]: true,
					},
				}],
			},
		})
		expect(blocks[1]).toMatchObject({
			[EntityMetaKey.Selector]: { root: `0x${'1'.repeat(64)}` },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconBlock, [], '$$timestamps')]: [{
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.BeaconBlock_Timestamp, [], 'canonical')]: false,
						[entityFieldAddressKey(EntityType.BeaconBlock_Timestamp, [], 'finalized')]: false,
					},
				}],
			},
		})
		expect(getBeaconBlockSnapshot).toHaveBeenNthCalledWith(1, 1, selector.root)
		expect(getBeaconBlockSnapshot).toHaveBeenNthCalledWith(2, 1, selector.root)
		expect(getBeaconBlockSnapshot).toHaveBeenNthCalledWith(3, 1, `0x${'1'.repeat(64)}`)
		expect(getHeadersAtSlot).toHaveBeenCalledWith(1, 64)

		getHeadersAtSlot.mockResolvedValue([])
		const emptySlot = await slotBlocksResolver.resolve.EvmNetworkSlot.resolve({
			$network: network,
			slot: 65,
		})
		expect(slotBlocksResolver.projections.$$blocks.select(emptySlot)).toEqual([])
		expect(slotBlocksResolver.projections.$$blocks.resolveCount(emptySlot)).toBe(0)
		expect(slotBlocksResolver.projections.$executionBlock(emptySlot)).toBeUndefined()
	})

	it('materializes a selected Gloas bid and separately delivered execution envelope', async () => {
		vi.spyOn(Date, 'now').mockReturnValue(1_760_000_000_000)
		const beaconBlockSelector = {
			$network: network,
			root: `0x${'a'.repeat(64)}`,
		}
		getBeaconBlockSnapshot.mockResolvedValue({
			version: 'gloas',
			root: beaconBlockSelector.root,
			slot: 96,
			proposerIndex: 12,
			parentRoot: `0x${'b'.repeat(64)}`,
			stateRoot: `0x${'c'.repeat(64)}`,
			bodyRoot: `0x${'d'.repeat(64)}`,
			signature: `0x${'e'.repeat(192)}`,
			canonical: true,
			executionOptimistic: false,
			finalized: true,
			deposits: [],
			attestations: [],
			withdrawals: [],
			slashings: [],
			executionPayloadBid: {
				builderIndex: 7,
				slot: 96,
				parentExecutionBlockHash: `0x${'1'.repeat(64)}`,
				parentBeaconBlockRoot: `0x${'b'.repeat(64)}`,
				executionBlockHash: `0x${'2'.repeat(64)}`,
				prevRandao: `0x${'3'.repeat(64)}`,
				feeRecipient: `0x${'4'.repeat(40)}`,
				gasLimit: 30_000_000n,
				valueGwei: 15n,
				executionPaymentGwei: 5n,
				blobKzgCommitments: [`0x${'5'.repeat(96)}`],
				executionRequestsRoot: `0x${'6'.repeat(64)}`,
				signature: `0x${'7'.repeat(192)}`,
			},
		})
		const executionPayloadEnvelope = {
			version: 'gloas',
			executionOptimistic: false,
			finalized: true,
			beaconBlockRoot: beaconBlockSelector.root,
			parentBeaconBlockRoot: `0x${'b'.repeat(64)}`,
			builderIndex: 7,
			signature: `0x${'8'.repeat(192)}`,
			executionBlockHash: `0x${'2'.repeat(64)}`,
			parentExecutionBlockHash: `0x${'1'.repeat(64)}`,
			blockNumber: 22_000_000n,
			feeRecipient: `0x${'4'.repeat(40)}`,
			gasLimit: 30_000_000n,
			gasUsed: 25_000_000n,
			timestampSeconds: 1_760_000_000n,
			slotNumber: 96,
			baseFeePerGas: 10n,
			blobGasUsed: 12n,
			excessBlobGas: 13n,
			blockAccessList: '0x1234',
			transactionCount: 2,
			executionRequests: {
				deposits: [{
					pubkey: `0x${'9'.repeat(96)}`,
					withdrawalCredentials: `0x${'a'.repeat(64)}`,
					amountGwei: 32_000_000_000n,
					signature: `0x${'b'.repeat(192)}`,
					requestIndex: 41n,
				}],
				withdrawals: [{
					sourceAddress: `0x${'c'.repeat(40)}`,
					validatorPubkey: `0x${'d'.repeat(96)}`,
					amountGwei: 1_000_000_000n,
				}],
				consolidations: [{
					sourceAddress: `0x${'e'.repeat(40)}`,
					sourcePubkey: `0x${'f'.repeat(96)}`,
					targetPubkey: `0x${'0'.repeat(96)}`,
				}],
			},
		}
		getExecutionPayloadEnvelope.mockResolvedValue(executionPayloadEnvelope)

		const block = await beaconBlockResolver.resolve.NetworkRoot.resolve(beaconBlockSelector)
		expect(block).toMatchObject({
			$executionPayloadBid: {
				[EntityMetaKey.Selector]: { $beaconBlock: beaconBlockSelector },
			},
			$executionPayloadEnvelope: {
				[EntityMetaKey.Selector]: { $beaconBlock: beaconBlockSelector },
			},
		})
		await expect(executionPayloadBidResolver.resolve.BeaconBlock.resolve({
			$beaconBlock: beaconBlockSelector,
		})).resolves.toMatchObject({
			builderIndex: 7,
			executionBlockHash: `0x${'2'.repeat(64)}`,
			valueGwei: 15n,
		})
		const envelope = await executionPayloadEnvelopeResolver.resolve.BeaconBlock.resolve({
			$beaconBlock: beaconBlockSelector,
		})
		expect(envelope).toMatchObject({
			blockNumber: 22_000_000n,
			executionTimestampMs: 1_760_000_000_000,
			$executionBlock: {
				[EntityMetaKey.Selector]: {
					hash: `0x${'2'.repeat(64)}`,
				},
			},
			$$consolidationRequests: [{
				[EntityMetaKey.Selector]: {
					indexInEnvelope: 0,
				},
			}],
			$$depositRequests: [{
				[EntityMetaKey.Selector]: {
					requestIndex: 41n,
				},
			}],
			$$withdrawalRequests: [{
				[EntityMetaKey.Selector]: {
					indexInEnvelope: 0,
				},
			}],
		})
		expect(envelope.$$timestamps[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				timestampMs: 1_760_000_000_000,
				source: Source.Beacon_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconExecutionPayloadEnvelope_Timestamp, [], 'finalized')]: true,
			},
		})
		expect(executionPayloadEnvelopeResolver.projections.$$depositRequests.select(envelope)).toHaveLength(1)
		expect(executionPayloadEnvelopeResolver.projections.$$depositRequests.resolveCount(envelope)).toBe(1)
		expect(executionPayloadEnvelopeResolver.projections.$$withdrawalRequests.resolveCount(envelope)).toBe(1)
		expect(executionPayloadEnvelopeResolver.projections.$$consolidationRequests.resolveCount(envelope)).toBe(1)
		await expect(executionConsolidationRequestResolver.resolve.EnvelopeIndexInEnvelope.resolve({
			$envelope: { $beaconBlock: beaconBlockSelector },
			indexInEnvelope: 0,
		})).resolves.toMatchObject({
			sourceAddress: `0x${'e'.repeat(40)}`,
			targetPubkey: `0x${'0'.repeat(96)}`,
		})
		await expect(executionDepositRequestResolver.resolve.EnvelopeRequestIndex.resolve({
			$envelope: { $beaconBlock: beaconBlockSelector },
			requestIndex: 41n,
		})).resolves.toMatchObject({
			amountGwei: 32_000_000_000n,
			pubkey: `0x${'9'.repeat(96)}`,
		})
		await expect(executionWithdrawalRequestResolver.resolve.EnvelopeIndexInEnvelope.resolve({
			$envelope: { $beaconBlock: beaconBlockSelector },
			indexInEnvelope: 0,
		})).resolves.toMatchObject({
			amountGwei: 1_000_000_000n,
			validatorPubkey: `0x${'d'.repeat(96)}`,
		})
		await expect(executionDepositRequestResolver.resolve.EnvelopeRequestIndex.resolve({
			$envelope: { $beaconBlock: beaconBlockSelector },
			requestIndex: 42n,
		})).rejects.toThrow('execution deposit request 42 not found')

		getExecutionPayloadEnvelope.mockResolvedValue({
			...executionPayloadEnvelope,
			builderIndex: 8,
		})
		await expect(executionPayloadEnvelopeResolver.resolve.BeaconBlock.resolve({
			$beaconBlock: beaconBlockSelector,
		})).rejects.toThrow('does not match selected block bid')
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

	it('materializes recent slot coordinates from the bounded network collection', async () => {
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

		const snapshot = await resolveHeadSlots(network, {
			filters: [],
			sorts: [],
			pagination: {
				limit: 2,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			publicEnv: {},
		})
		const slots = headSlotResolver.projections.Evm.$$beaconSlots.select(snapshot)
		expect(slots).toHaveLength(2)
		expect(slots[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$network: network,
				slot: 64,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconSlot, [], 'epoch')]: 2,
				[entityFieldAddressKey(EntityType.BeaconSlot, [], '$epoch')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						epoch: 2,
					},
				},
			},
		})
		expect(slots[0][EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BeaconSlot, [], 'root')]).toBeUndefined()
		expect(headSlotResolver.projections.Evm.$$beaconSlots.resolveCount(snapshot)).toBe(65)
		expect(headSlotResolver.projections.Evm.$$beaconSlots.continuation(snapshot)).toEqual({
			operation: 'network-beacon-slots',
			terminal: false,
			token: '62',
		})
		expect(getHeader).toHaveBeenCalledWith(1, 'head')
		expect(getHeader).toHaveBeenCalledTimes(1)
	})

	it('materializes bounded epoch slot history as slot coordinates', async () => {
		getProposerDuties.mockResolvedValue([
			{
				pubkey: `0x${'1'.repeat(96)}`,
				validator_index: '12',
				slot: '64',
			},
			{
				pubkey: `0x${'2'.repeat(96)}`,
				validator_index: '13',
				slot: '65',
			},
		])

		const snapshot = await epochSlotsResolver.resolve.EvmNetworkEpoch.resolve({
			$network: network,
			epoch: 2,
		}, {
			filters: [],
			sorts: [],
			pagination: {
				limit: 2,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			publicEnv: {},
		})
		const slots = epochSlotsResolver.projections.$$beaconSlots.select(snapshot)

		expect(slots).toHaveLength(2)
		expect(slots).toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					slot: 64,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.BeaconSlot, [], 'epoch')]: 2,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					slot: 65,
				},
			},
		])
		expect(slots[0][EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BeaconSlot, [], 'root')]).toBeUndefined()
		expect(epochSlotsResolver.projections.$$beaconSlots.resolveCount(snapshot)).toBe(2)
		expect(getProposerDuties).toHaveBeenCalledWith(1, 2)
		expect(getHeadersAtSlot).not.toHaveBeenCalled()
		expect(getBlockRewards).not.toHaveBeenCalled()
	})

	it('materializes source-owned PeerDAS columns and custody observations from one slot read', async () => {
		getHeadersAtSlot.mockResolvedValue([{
			root: `0x${'1'.repeat(64)}`,
		}])
		getDataColumnSidecars.mockResolvedValue({
			version: 'fulu',
			executionOptimistic: false,
			finalized: true,
			endpointUrl: 'https://ethereum-beacon-api.publicnode.com',
			sidecars: [{
				index: 7,
				columns: [`0x${'ab'.repeat(2_048)}`],
				kzgProofs: [`0x${'cd'.repeat(48)}`],
				kzgCommitments: [`0x${'ef'.repeat(48)}`],
				beaconBlockRoot: undefined,
				slot: 64,
			}],
		})
		const slotColumnsResolver = beaconRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.BeaconSlot
			&& '$$dataColumns' in resolver.projections
		))
		const dataColumnResolver = beaconRest.resolvers.find((resolver) => (
			resolver.entityType === EntityType.BeaconDataColumn
		))
		if (slotColumnsResolver == null || dataColumnResolver == null)
			throw new Error('Beacon REST data-column resolvers are not registered')

		const snapshot = await slotColumnsResolver.resolve.EvmNetworkSlot.resolve({
			$network: network,
			slot: 64,
		}, {
			filters: [],
			sorts: [],
			pagination: { limit: 1 },
			selectorKeys: [],
			parentSelectorKeys: [],
			publicEnv: {},
		})
		const columns = slotColumnsResolver.projections.$$dataColumns.select(snapshot)
		expect(columns).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$block: {
					$network: network,
					root: `0x${'1'.repeat(64)}`,
				},
				columnIndex: 7,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconDataColumn, [], 'forkVersion')]: 'fulu',
				[entityFieldAddressKey(EntityType.BeaconDataColumn, [], 'columnCount')]: 1,
				[entityFieldAddressKey(EntityType.BeaconDataColumn, [], '$$timestamps')]: [{
					[EntityMetaKey.Selector]: {
						$dataColumn: {
							$block: {
								$network: network,
								root: `0x${'1'.repeat(64)}`,
							},
							columnIndex: 7,
						},
						timestampMs: expect.any(Number),
						source: Source.Beacon_Rest,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.BeaconDataColumn_Timestamp, [], 'endpointUrl')]: 'https://ethereum-beacon-api.publicnode.com',
						[entityFieldAddressKey(EntityType.BeaconDataColumn_Timestamp, [], 'finalized')]: true,
					},
				}],
			},
		}])
		expect(slotColumnsResolver.projections.$$dataColumns.resolveCount(snapshot)).toBe(1)

		await expect(dataColumnResolver.resolve.BlockColumnIndex.resolve({
			$block: {
				$network: network,
				root: `0x${'1'.repeat(64)}`,
			},
			columnIndex: 7,
		})).resolves.toMatchObject({
			columnIndex: 7,
			forkVersion: 'fulu',
			columnCount: 1,
		})
		expect(getHeadersAtSlot).toHaveBeenCalledWith(1, 64)
		expect(getDataColumnSidecars).toHaveBeenNthCalledWith(1, 1, `0x${'1'.repeat(64)}`)
		expect(getDataColumnSidecars).toHaveBeenNthCalledWith(2, 1, `0x${'1'.repeat(64)}`, [7])
	})

	it('preserves missed proposer duties as native slot identities', async () => {
		getProposerDuties.mockResolvedValue([{
			pubkey: `0x${'1'.repeat(96)}`,
			validator_index: '22',
			slot: '96',
		}])
		getHeadersAtSlot.mockResolvedValue([])

		const snapshot = await epochSlotsResolver.resolve.EvmNetworkEpoch.resolve({
			$network: network,
			epoch: 3,
		}, {
			filters: [],
			sorts: [],
			pagination: { limit: 1 },
			selectorKeys: [],
			parentSelectorKeys: [],
			publicEnv: {},
		})
		expect(epochSlotsResolver.projections.$$beaconSlots.select(snapshot)).toEqual([{
			[EntityMetaKey.Selector]: {
				$network: network,
				slot: 96,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconSlot, [], 'epoch')]: 3,
				[entityFieldAddressKey(EntityType.BeaconSlot, [], '$epoch')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						epoch: 3,
					},
				},
			},
		}])
		expect(epochSlotsResolver.projections.$$beaconSlots.resolveCount(snapshot)).toBe(1)
		expect(getBlockRewards).not.toHaveBeenCalled()
		expect(getHeadersAtSlot).not.toHaveBeenCalled()
	})

	it('projects coordinate-bound proposer reward components onto the block root', async () => {
		getBlockRewards.mockResolvedValue({
			proposerIndex: 12,
			totalGwei: 1000n,
			attestationsGwei: 700n,
			syncAggregateGwei: 200n,
			proposerSlashingsGwei: 60n,
			attesterSlashingsGwei: 40n,
			executionOptimistic: false,
			finalized: true,
		})

		const rewards = await blockRewardsResolver.resolve.NetworkRoot.resolve({
			$network: network,
			root: `0x${'a'.repeat(64)}`,
		})
		expect(blockRewardsResolver.projections.rewardTotalGwei(rewards)).toBe(1000n)
		expect(blockRewardsResolver.projections.rewardAttestationsGwei(rewards)).toBe(700n)
		expect(blockRewardsResolver.projections.rewardSyncAggregateGwei(rewards)).toBe(200n)
		expect(blockRewardsResolver.projections.rewardProposerSlashingsGwei(rewards)).toBe(60n)
		expect(blockRewardsResolver.projections.rewardAttesterSlashingsGwei(rewards)).toBe(40n)
		expect(getBlockRewards).toHaveBeenCalledWith(
			1,
			`0x${'a'.repeat(64)}`
		)
	})

	it('resolves per-validator attestation and sync rewards at an epoch-end slot', async () => {
		getAttestationRewards.mockResolvedValue({
			executionOptimistic: false,
			finalized: true,
			rewards: [{
				validatorIndex: 12,
				headGwei: 20n,
				targetGwei: 30n,
				sourceGwei: 40n,
				inclusionDelayGwei: 5n,
				inactivityGwei: -2n,
			}],
		})
		getSyncCommitteeRewards.mockResolvedValue({
			executionOptimistic: false,
			finalized: true,
			rewards: [{
				validatorIndex: 12,
				rewardGwei: 9n,
			}],
		})
		const reward = await validatorRewardResolver.resolve.ValidatorSlotSource.resolve({
			$validator: {
				$network: network,
				indexInNetwork: 12,
			},
			slot: 63,
			source: Source.Beacon_Rest,
		})
		expect(validatorRewardResolver.projections.attestationHeadRewardGwei(reward)).toBe(20n)
		expect(validatorRewardResolver.projections.attestationInactivityRewardGwei(reward)).toBe(-2n)
		expect(validatorRewardResolver.projections.syncCommitteeRewardGwei(reward)).toBe(9n)
		expect(validatorRewardResolver.projections.rewardFinalized(reward)).toBe(true)
		expect(getAttestationRewards).toHaveBeenCalledWith(
			1,
			1,
			[12]
		)
		expect(getSyncCommitteeRewards).toHaveBeenCalledWith(
			1,
			63,
			[12]
		)
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

	it('resolves a slashing by its fork-safe block identity', async () => {
		getBlockDutySummary.mockResolvedValue({
			deposits: [],
			attestations: [],
			withdrawals: [],
			slashings: [{
				index: 0,
				indexInBlock: 0,
				indexInKind: 0,
				kind: 'proposer',
			}],
		})

		const slashing = await slashingResolver.resolve.BlockKindIndexInKind.resolve({
			$block: {
				$network: network,
				root: `0x${'11'.repeat(32)}`,
			},
			kind: 'proposer',
			indexInKind: 0,
		})

		expect(slashingResolver.projections.kind(slashing)).toBe('proposer')
		expect(slashingResolver.projections.indexInKind(slashing)).toBe(0)
		expect(getBlockDutySummary).toHaveBeenCalledWith(
			1,
			`0x${'11'.repeat(32)}`
		)
	})

	it('resolves a deposit route from its fork-safe block index', async () => {
		getBlockDutySummary.mockResolvedValue({
			deposits: [{
				index: 0,
				indexInBlock: 0,
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

		const deposit = await depositResolver.resolve.BlockIndexInBlock.resolve({
			$block: {
				$network: network,
				root: `0x${'11'.repeat(32)}`,
			},
			indexInBlock: 0,
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
			`0x${'11'.repeat(32)}`
		)
	})

	it('materializes native duty cards from one block summary', async () => {
		getBeaconBlockSnapshot.mockResolvedValue({
			root: `0x${'11'.repeat(32)}`,
			deposits: [{
				index: 0,
				indexInBlock: 0,
				pubkey: `0x${'22'.repeat(48)}`,
				withdrawalCredentials: `0x${'33'.repeat(32)}`,
				amountGwei: 32_000_000_000n,
				signature: `0x${'44'.repeat(96)}`,
				proof: [`0x${'11'.repeat(32)}`],
			}],
			attestations: [{
				index: 2,
				indexInBlock: 2,
				committeeIndex: 4,
				aggregationBits: '0x03',
			}],
			withdrawals: [{
				index: 5,
				indexInBlock: 5,
				withdrawalIndex: 100,
				validatorIndex: 12,
				address: '0000000000000000000000000000000000000001',
				amountGwei: 32_000_000_000n,
			}],
			slashings: [{
				index: 1,
				indexInBlock: 1,
				indexInKind: 0,
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
		expect(dutySummaryResolver.projections.$$beaconDeposits.select(dutySummary)).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$block: {
					$network: network,
					root: `0x${'11'.repeat(32)}`,
				},
				indexInBlock: 0,
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

		expect(dutySummaryResolver.projections.$$beaconAttestations.select(dutySummary)).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$block: {
					$network: network,
					root: `0x${'11'.repeat(32)}`,
				},
				indexInBlock: 2,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconAttestation, [], 'committeeIndex')]: 4,
				[entityFieldAddressKey(EntityType.BeaconAttestation, [], 'aggregationBits')]: '0x03',
			},
		}])
		expect(dutySummaryResolver.projections.$$beaconWithdrawals.select(dutySummary)).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$block: {
					$network: network,
					root: `0x${'11'.repeat(32)}`,
				},
				withdrawalIndex: 100,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], 'indexInBlock')]: 5,
				[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], 'amountGwei')]: 32_000_000_000n,
				[entityFieldAddressKey(EntityType.BeaconWithdrawal, [], '$validator')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						indexInNetwork: 12,
					},
				},
			},
		}])
		expect(dutySummaryResolver.projections.$$beaconSlashings.select(dutySummary)).toMatchObject([{
			[EntityMetaKey.Selector]: {
				$block: {
					$network: network,
					root: `0x${'11'.repeat(32)}`,
				},
				kind: 'attester',
				indexInKind: 0,
			},
		}])
		expect(dutySummaryResolver.projections.$$beaconDeposits.resolveCount(dutySummary)).toBe(1)
		expect(dutySummaryResolver.projections.$$beaconAttestations.resolveCount(dutySummary)).toBe(1)
		expect(dutySummaryResolver.projections.$$beaconWithdrawals.resolveCount(dutySummary)).toBe(1)
		expect(dutySummaryResolver.projections.$$beaconSlashings.resolveCount(dutySummary)).toBe(1)
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

		const snapshot = await resolveSyncCommitteesList(network, {
			filters: [],
			sorts: [],
			pagination: {
				limit: 3,
			},
			selectorKeys: [],
			parentSelectorKeys: [],
			publicEnv: {},
		})
		expect(syncCommitteesListResolver.projections.Evm.$$beaconSyncCommittees.select(snapshot)).toEqual([
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
		expect(syncCommitteesListResolver.projections.Evm.$$beaconSyncCommittees.resolveCount(snapshot)).toBe(3)
		expect(syncCommitteesListResolver.projections.Evm.$$beaconSyncCommittees.continuation(snapshot)).toEqual({
			operation: 'network-beacon-sync-committees',
			terminal: true,
		})
		expect(getSyncCommittee).toHaveBeenCalledTimes(3)
	})

	it('preserves missing finality and unmatched fork behavior', async () => {
		getFinalityCheckpoints.mockResolvedValue(undefined)
		getForkSchedule.mockResolvedValue([])

		await expect(finalityTimestampsResolver.resolve.Caip2.resolve(network)).rejects.toThrow('finality checkpoints not returned')
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

describe('Beacon live consensus head', () => {
	const headHeaderWire = (slot: number, rootSuffix: string) => ({
		root: `0x${rootSuffix.repeat(64)}`,
		canonical: true,
		header: {
			message: {
				slot: String(slot),
				proposer_index: '12',
				parent_root: `0x${'b'.repeat(64)}`,
				state_root: `0x${'c'.repeat(64)}`,
				body_root: `0x${'d'.repeat(64)}`,
			},
			signature: `0x${'e'.repeat(192)}`,
		},
	})
	const finalityCheckpointsWire = {
		previous_justified: {
			epoch: '100',
			root: '0xAABBCCDDEEFF00112233445566778899AABBCCDDEEFF00112233445566778899',
		},
		current_justified: {
			epoch: '101',
			root: '0x112233445566778899AABBCCDDEEFF00112233445566778899AABBCCDDEEFF00',
		},
		finalized: {
			epoch: '99',
			root: '0xFFEEDDCCBBAA99887766554433221100FFEEDDCCBBAA99887766554433221100',
		},
	}
	const resolverContext = {
		filters: [],
		sorts: [],
		pagination: {
			limit: 2,
		},
		selectorKeys: [],
		parentSelectorKeys: [],
		sources: [],
		publicEnv: {},
	}

	beforeEach(() => {
		vi.clearAllMocks()
		vi.useFakeTimers()
	})

	it('publishes native head slot, derived epoch, and retrieval-clock finality rows', async () => {
		if (headSlotResolver.resolveLive?.beaconHead == null)
			throw new Error('Beacon_Rest missing Network.Evm beaconHead resolveLive')

		vi.spyOn(Date, 'now').mockReturnValue(1_800_000_000_000)
		getHeader.mockImplementation(async (_chainId, slot) => (
			slot === 'head' || slot === 64 ?
				headHeaderWire(64, 'a')
			:
				headHeaderWire(Number(slot), String(Number(slot)).padStart(64, '0'))
		))
		getFinalityCheckpoints.mockResolvedValue(finalityCheckpointsWire)
		const replaceSlots = vi.fn()
		const replaceSlotCount = vi.fn()
		const replaceEpochs = vi.fn()
		const replaceEpochCount = vi.fn()
		const replaceFinality = vi.fn()
		const abortController = new AbortController()
		const stop = headSlotResolver.resolveLive.beaconHead.start({
			fields: {
				'$$beaconSlots': {
					replaceRows: replaceSlots,
					invalidate: vi.fn(),
					count: {
						replaceRows: replaceSlotCount,
						invalidate: vi.fn(),
					},
				},
				'$$beaconEpochs': {
					replaceRows: replaceEpochs,
					invalidate: vi.fn(),
					count: {
						replaceRows: replaceEpochCount,
						invalidate: vi.fn(),
					},
				},
				'$$beaconFinalityTimestamps': {
					replaceRows: replaceFinality,
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				invalidate: vi.fn(),
			},
			parentEntitySelector: network,
			queryClient: {},
			signal: abortController.signal,
			trigger: resolverContext,
		})
		await vi.waitFor(() => {
			expect(replaceSlots).toHaveBeenCalledOnce()
			expect(replaceEpochs).toHaveBeenCalledOnce()
			expect(replaceFinality).toHaveBeenCalledOnce()
		})

		const slotRows = replaceSlots.mock.calls[0]?.[0]?.[0]?.value
		const epochRows = replaceEpochs.mock.calls[0]?.[0]?.[0]?.value
		const finalityRow = replaceFinality.mock.calls[0]?.[0]?.[0]?.value[0]
		if (slotRows == null || epochRows == null || finalityRow == null)
			throw new Error('Beacon live head did not publish rows')

		expect(slotRows).toHaveLength(2)
		expect(slotRows[0]).toMatchObject({
			[EntityMetaKey.Selector]: {
				$network: network,
				slot: 64,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconSlot, [], 'epoch')]: 2,
				[entityFieldAddressKey(EntityType.BeaconSlot, [], '$epoch')]: {
					[EntityMetaKey.Selector]: {
						$network: network,
						epoch: 2,
					},
				},
			},
		})
		expect(slotRows[0][EntityMetaKey.Fields][entityFieldAddressKey(EntityType.BeaconSlot, [], 'root')]).toBeUndefined()
		expect(epochRows).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					epoch: 2,
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					epoch: 1,
				},
			},
		])
		expect(finalityRow).toEqual({
			[EntityMetaKey.Selector]: {
				$network: network,
				timestampMs: 1_800_000_000_000,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'currentJustifiedCheckpointEpoch')]: 101,
				[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'currentJustifiedCheckpointRoot')]: '0x112233445566778899aabbccddeeff00112233445566778899aabbccddeeff00',
				[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'previousJustifiedCheckpointEpoch')]: 100,
				[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'previousJustifiedCheckpointRoot')]: '0xaabbccddeeff00112233445566778899aabbccddeeff00112233445566778899',
				[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'finalizedCheckpointEpoch')]: 99,
				[entityFieldAddressKey(EntityType.EthereumBeaconFinality_Timestamp, [], 'finalizedCheckpointRoot')]: '0xffeeddccbbaa99887766554433221100ffeeddccbbaa99887766554433221100',
			},
		})
		expect(getHeader).toHaveBeenCalledWith(1, 'head')
		expect(getHeader).not.toHaveBeenCalledWith(1, 63)
		expect(getFinalityCheckpoints).toHaveBeenCalledWith(1)
		expect(replaceSlotCount).toHaveBeenCalledWith([{
			source: Source.Beacon_Rest,
			value: 65,
		}])
		expect(replaceEpochCount).toHaveBeenCalledWith([{
			source: Source.Beacon_Rest,
			value: 3,
		}])

		abortController.abort()
		stop()
		vi.useRealTimers()
	})

	it('replaces head slots on reorg and epochs only when the head epoch advances', async () => {
		if (headSlotResolver.resolveLive?.beaconHead == null)
			throw new Error('Beacon_Rest missing Network.Evm beaconHead resolveLive')

		getHeader
			.mockResolvedValueOnce(headHeaderWire(63, 'a'))
			.mockResolvedValueOnce(headHeaderWire(63, 'b'))
			.mockResolvedValueOnce(headHeaderWire(64, 'c'))
		getFinalityCheckpoints.mockResolvedValue(finalityCheckpointsWire)
		const replaceSlots = vi.fn()
		const replaceEpochs = vi.fn()
		const replaceFinality = vi.fn()
		const abortController = new AbortController()
		const stop = headSlotResolver.resolveLive.beaconHead.start({
			fields: {
				'$$beaconSlots': {
					replaceRows: replaceSlots,
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				'$$beaconEpochs': {
					replaceRows: replaceEpochs,
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				'$$beaconFinalityTimestamps': {
					replaceRows: replaceFinality,
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				invalidate: vi.fn(),
			},
			parentEntitySelector: network,
			queryClient: {},
			signal: abortController.signal,
			trigger: resolverContext,
		})
		await vi.waitFor(() => expect(replaceSlots).toHaveBeenCalledOnce())
		expect(replaceEpochs).toHaveBeenCalledOnce()
		expect(replaceSlots.mock.calls[0]?.[0]?.[0]?.value[0]).toMatchObject({
			[EntityMetaKey.Selector]: { slot: 63 },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconSlot, [], 'epoch')]: 1,
			},
		})

		await vi.advanceTimersByTimeAsync(12_000)
		await vi.waitFor(() => expect(replaceSlots).toHaveBeenCalledTimes(2))
		expect(replaceEpochs).toHaveBeenCalledOnce()
		expect(replaceSlots.mock.calls[1]?.[0]?.[0]?.value[0]).toMatchObject({
			[EntityMetaKey.Selector]: { slot: 63 },
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.BeaconSlot, [], 'epoch')]: 1,
			},
		})

		await vi.advanceTimersByTimeAsync(12_000)
		await vi.waitFor(() => expect(replaceSlots).toHaveBeenCalledTimes(3))
		expect(replaceEpochs).toHaveBeenCalledTimes(2)
		expect(replaceEpochs.mock.calls[1]?.[0]?.[0]?.value[0]).toMatchObject({
			[EntityMetaKey.Selector]: { epoch: 2 },
		})

		abortController.abort()
		stop()
		vi.useRealTimers()
	})

	it('publishes a fresh retrieval-clock finality row on every poll without replaying history', async () => {
		if (headSlotResolver.resolveLive?.beaconHead == null)
			throw new Error('Beacon_Rest missing Network.Evm beaconHead resolveLive')

		vi.spyOn(Date, 'now')
			.mockReturnValueOnce(1_800_000_000_000)
			.mockReturnValueOnce(1_800_000_012_001)
		getHeader.mockResolvedValue(headHeaderWire(64, 'a'))
		getFinalityCheckpoints.mockResolvedValue(finalityCheckpointsWire)
		const replaceFinality = vi.fn()
		const abortController = new AbortController()
		const stop = headSlotResolver.resolveLive.beaconHead.start({
			fields: {
				'$$beaconSlots': {
					replaceRows: vi.fn(),
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				'$$beaconEpochs': {
					replaceRows: vi.fn(),
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				'$$beaconFinalityTimestamps': {
					replaceRows: replaceFinality,
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				invalidate: vi.fn(),
			},
			parentEntitySelector: network,
			queryClient: {},
			signal: abortController.signal,
			trigger: resolverContext,
		})
		await vi.waitFor(() => expect(replaceFinality).toHaveBeenCalledOnce())
		await vi.advanceTimersByTimeAsync(12_000)
		await vi.waitFor(() => expect(replaceFinality).toHaveBeenCalledTimes(2))
		expect(replaceFinality.mock.calls[0]?.[0]?.[0]?.value[0][EntityMetaKey.Selector].timestampMs).toBe(1_800_000_000_000)
		expect(replaceFinality.mock.calls[1]?.[0]?.[0]?.value[0][EntityMetaKey.Selector].timestampMs).toBe(1_800_000_012_001)
		expect(replaceFinality.mock.calls[1]?.[0]?.[0]?.value).toHaveLength(1)

		abortController.abort()
		stop()
		vi.useRealTimers()
	})

	it('stops polling after abort cleanup', async () => {
		if (headSlotResolver.resolveLive?.beaconHead == null)
			throw new Error('Beacon_Rest missing Network.Evm beaconHead resolveLive')

		getHeader.mockResolvedValue(headHeaderWire(64, 'a'))
		getFinalityCheckpoints.mockResolvedValue(finalityCheckpointsWire)
		const abortController = new AbortController()
		const stop = headSlotResolver.resolveLive.beaconHead.start({
			fields: {
				'$$beaconSlots': {
					replaceRows: vi.fn(),
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				'$$beaconEpochs': {
					replaceRows: vi.fn(),
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				'$$beaconFinalityTimestamps': {
					replaceRows: vi.fn(),
					invalidate: vi.fn(),
					count: {
						replaceRows: vi.fn(),
						invalidate: vi.fn(),
					},
				},
				invalidate: vi.fn(),
			},
			parentEntitySelector: network,
			queryClient: {},
			signal: abortController.signal,
			trigger: resolverContext,
		})
		await vi.waitFor(() => expect(getFinalityCheckpoints).toHaveBeenCalledOnce())
		getHeader.mockClear()
		getFinalityCheckpoints.mockClear()
		abortController.abort()
		stop()
		await vi.advanceTimersByTimeAsync(24_000)
		expect(getHeader).not.toHaveBeenCalled()
		expect(getFinalityCheckpoints).not.toHaveBeenCalled()
		vi.useRealTimers()
	})
})

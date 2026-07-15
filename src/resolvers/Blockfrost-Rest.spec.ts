import { beforeEach, describe, expect, it, vi } from 'vitest'

import blockFixture from '$/sources/Blockfrost/Rest/fixtures/block.json'
import { CardanoBlockSelector } from '$/schema/CardanoBlock.ts'
import { CardanoNetwork_TimestampSelector } from '$/schema/CardanoNetwork_Timestamp.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import { NetworkNamespace, networkBySlug } from '$/constants/Network.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import type {
	BlockfrostAssets,
	BlockfrostBlock,
	BlockfrostCommittee,
	BlockfrostDReps,
	BlockfrostGovernanceProposals,
	BlockfrostProtocolParameters,
	BlockfrostStakePools,
	BlockfrostTransactions,
} from '$/sources/Blockfrost/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'

const getHealth = vi.fn()
const getLatestBlock = vi.fn()
const getLatestEpoch = vi.fn()
const getLatestProtocolParameters = vi.fn()
const getNetwork = vi.fn()
const getCommittee = vi.fn()
const listBlocks = vi.fn()
const listLatestBlockTransactions = vi.fn()
const listStakePools = vi.fn()
const listDReps = vi.fn()
const listGovernanceProposals = vi.fn()
const listAssets = vi.fn()
const getBlock = vi.fn()

vi.mock('$/sources/Blockfrost/Rest/queries.ts', () => ({
	getHealth,
	getLatestBlock,
	getLatestEpoch,
	getLatestProtocolParameters,
	getNetwork,
	getCommittee,
	listBlocks,
	listLatestBlockTransactions,
	listStakePools,
	listDReps,
	listGovernanceProposals,
	listAssets,
	getBlock,
}))

const { default: blockfrostResolvers } = await import('$/resolvers/Blockfrost-Rest.ts')

const cardanoNetworkObservationResolver = blockfrostResolvers.resolvers.find((
	resolver
): resolver is Extract<
	typeof blockfrostResolvers.resolvers[number],
	{ entityType: EntityType.CardanoNetwork_Timestamp }
> => resolver.entityType === EntityType.CardanoNetwork_Timestamp)

if (cardanoNetworkObservationResolver == null)
	throw new Error('Blockfrost-Rest spec missing CardanoNetwork_Timestamp resolver')

const cardanoBlockResolver = blockfrostResolvers.resolvers.find((
	resolver
): resolver is Extract<
	typeof blockfrostResolvers.resolvers[number],
	{ entityType: EntityType.CardanoBlock }
> => resolver.entityType === EntityType.CardanoBlock)

if (cardanoBlockResolver == null)
	throw new Error('Blockfrost-Rest spec missing CardanoBlock resolver')

const blockfrostBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.Blockfrost_Rest)

if (blockfrostBinding == null)
	throw new Error('Blockfrost-Rest spec missing source binding')

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}

const latestBlock = blockFixture satisfies BlockfrostBlock
const transactions = ['transaction-hash'] satisfies BlockfrostTransactions
const stakePools = ['pool1example'] satisfies BlockfrostStakePools
const dReps = [
	{
		drep_id: 'drep1example',
		hex: 'ab',
		amount: '1000000',
		has_script: false,
		retired: false,
		expired: false,
		last_active_epoch: 500,
		metadata: null,
	},
] satisfies BlockfrostDReps
const governanceProposals = [
	{
		id: 'gov_action1example',
		tx_hash: 'proposal-transaction-hash',
		cert_index: 1,
		governance_type: 'info_action',
	},
] satisfies BlockfrostGovernanceProposals
const assets = [
	{
		asset: `${'a'.repeat(56)}746f6b656e`,
		quantity: '1',
	},
] satisfies BlockfrostAssets
const protocolParameters = {
	epoch: 500,
	min_fee_a: 44,
	min_fee_b: 155_381,
	max_block_size: 65_536,
	max_tx_size: 16_384,
	max_block_header_size: 1_100,
	key_deposit: '2000000',
	pool_deposit: '500000000',
	e_max: 18,
	n_opt: 500,
	a0: 0.3,
	rho: 0.003,
	tau: 0.2,
	decentralisation_param: 0,
	extra_entropy: null,
	protocol_major_ver: 9,
	protocol_minor_ver: 0,
	min_utxo: '1000000',
	min_pool_cost: '170000000',
	nonce: 'nonce',
	cost_models: null,
	cost_models_raw: {
		PlutusV3: [1],
	},
	price_mem: 0.0577,
	price_step: 0.0000721,
	max_tx_ex_mem: '10000000',
	max_tx_ex_steps: '10000000000',
	max_block_ex_mem: '50000000',
	max_block_ex_steps: '40000000000',
	max_val_size: '5000',
	collateral_percent: 150,
	max_collateral_inputs: 3,
	coins_per_utxo_size: '4310',
	coins_per_utxo_word: null,
	pvt_motion_no_confidence: 0.51,
	pvt_committee_normal: 0.51,
	pvt_committee_no_confidence: 0.51,
	pvt_hard_fork_initiation: 0.51,
	dvt_motion_no_confidence: 0.67,
	dvt_committee_normal: 0.67,
	dvt_committee_no_confidence: 0.67,
	dvt_update_to_constitution: 0.75,
	dvt_hard_fork_initiation: 0.6,
	dvt_p_p_network_group: 0.67,
	dvt_p_p_economic_group: 0.67,
	dvt_p_p_technical_group: 0.67,
	dvt_p_p_gov_group: 0.75,
	dvt_treasury_withdrawal: 0.67,
	committee_min_size: '7',
	committee_max_term_length: '146',
	gov_action_lifetime: '6',
	gov_action_deposit: '100000000000',
	drep_deposit: '500000000',
	drep_activity: '20',
	pvtpp_security_group: 0.51,
	pvt_p_p_security_group: 0.51,
	min_fee_ref_script_cost_per_byte: 15,
} satisfies BlockfrostProtocolParameters
const committee = {
	gov_action_id: 'gov_action1committee',
	proposal_tx_hash: 'committee-proposal-transaction-hash',
	proposal_index: 2,
	is_dissolved: false,
	quorum: {
		numerator: 2,
		denominator: 3,
	},
	members: [
		{
			cc_cold_id: 'cc_cold1example',
			cc_cold_hex: 'ab',
			cc_cold_has_script: false,
			cc_hot_id: 'cc_hot1example',
			cc_hot_hex: 'cd',
			cc_hot_has_script: false,
			status: 'authorized',
			expiration_epoch: 600,
		},
	],
} satisfies BlockfrostCommittee

const resolveCardanoField = async (fieldName: string) => {
	const resolver = blockfrostResolvers.resolvers.find((candidate) => (
		candidate.entityType === EntityType.Network
		&& 'Cardano' in candidate.projections
		&& fieldName in candidate.projections.Cardano
	))

	if (resolver == null)
		throw new Error(`Blockfrost-Rest spec missing Network.Cardano.${fieldName} resolver`)

	return resolver.resolve[NetworkSelector.Slug](
		{ slug: 'cardano' },
		resolverContext
	)
}

describe('Blockfrost Cardano network facet', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('keeps Cardano on canonical Network identity', () => {
		expect(networkBySlug.cardano).toMatchObject({
			slug: 'cardano',
			name: 'Cardano',
			namespace: NetworkNamespace.Cardano,
		})
		expect(blockfrostResolvers.resolvers.some((resolver) => (
			resolver.entityType === EntityType.Network
			&& 'Cardano' in resolver.projections
		))).toBe(true)
	})

	it('maps a nonempty $$transactions source-shaped result', async () => {
		listLatestBlockTransactions.mockResolvedValueOnce(transactions)

		await expect(resolveCardanoField('$$transactions')).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: { slug: 'cardano' },
					hash: 'transaction-hash',
				},
				hash: 'transaction-hash',
			},
		])
	})

	it('maps a nonempty $$stakePools source-shaped result', async () => {
		listStakePools.mockResolvedValueOnce(stakePools)

		await expect(resolveCardanoField('$$stakePools')).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: { slug: 'cardano' },
					poolId: 'pool1example',
				},
				poolId: 'pool1example',
			},
		])
	})

	it('maps a nonempty $$dReps source-shaped result', async () => {
		listDReps.mockResolvedValueOnce(dReps)

		await expect(resolveCardanoField('$$dReps')).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: { slug: 'cardano' },
					drepCredential: 'drep1example',
				},
				drepCredential: 'drep1example',
				credentialKind: 'key',
			},
		])
	})

	it('maps a nonempty $$governanceProposals source-shaped result', async () => {
		listGovernanceProposals.mockResolvedValueOnce(governanceProposals)

		await expect(resolveCardanoField('$$governanceProposals')).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: { slug: 'cardano' },
					proposalTxHash: 'proposal-transaction-hash',
					proposalIndex: 1,
				},
				proposalTxHash: 'proposal-transaction-hash',
				proposalIndex: 1,
				proposalKind: 'info_action',
			},
		])
	})

	it('maps a nonempty $$assets source-shaped result', async () => {
		listAssets.mockResolvedValueOnce(assets)

		await expect(resolveCardanoField('$$assets')).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: { slug: 'cardano' },
					policyId: 'a'.repeat(56),
					assetName: '746f6b656e',
				},
				policyId: 'a'.repeat(56),
				assetName: '746f6b656e',
			},
		])
	})

	it('maps a nonempty $$protocolParameterEpochs source-shaped result', async () => {
		getLatestProtocolParameters.mockResolvedValueOnce(protocolParameters)

		await expect(resolveCardanoField('$$protocolParameterEpochs')).resolves.toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					$network: { slug: 'cardano' },
					epoch: 500,
					source: Source.Blockfrost_Rest,
				},
				epoch: 500,
				source: Source.Blockfrost_Rest,
				minFeeA: 44n,
				keyDeposit: 2_000_000n,
				coinsPerUtxoByte: 4_310n,
				maxValueSize: 5_000,
			},
		])
	})

	it('maps a nonempty $$committeeEpochs source-shaped result', async () => {
		getCommittee.mockResolvedValueOnce(committee)
		getLatestEpoch.mockResolvedValueOnce({
			epoch: 500,
		})

		await expect(resolveCardanoField('$$committeeEpochs')).resolves.toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					$network: { slug: 'cardano' },
					epoch: 500,
					source: Source.Blockfrost_Rest,
				},
				quorumNumerator: 2,
				quorumDenominator: 3,
				memberCount: 1,
			},
		])
	})

	it('does not fake unsupported Network.Cardano relationship enumerations', async () => {
		await expect(resolveCardanoField('$$addresses')).rejects.toThrow(
			'Blockfrost-Rest spec missing Network.Cardano.$$addresses resolver'
		)
		await expect(resolveCardanoField('$$stakeCredentials')).rejects.toThrow(
			'Blockfrost-Rest spec missing Network.Cardano.$$stakeCredentials resolver'
		)
		await expect(resolveCardanoField('$$constitutionEpochs')).rejects.toThrow(
			'Blockfrost-Rest spec missing Network.Cardano.$$constitutionEpochs resolver'
		)
	})

	it('rejects malformed asset identities and preserves source failures', async () => {
		listAssets.mockResolvedValueOnce([
			{
				asset: 'short',
				quantity: '1',
			},
		])
		await expect(resolveCardanoField('$$assets')).rejects.toThrow(
			'Blockfrost_Rest: asset identifier is malformed'
		)

		listDReps.mockRejectedValueOnce(new Error('Blockfrost_Rest: upstream unavailable'))
		await expect(resolveCardanoField('$$dReps')).rejects.toThrow(
			'Blockfrost_Rest: upstream unavailable'
		)
	})

	it('maps only source observations returned by Blockfrost', async () => {
		getLatestBlock.mockResolvedValueOnce(latestBlock)
		getLatestEpoch.mockResolvedValueOnce({
			epoch: 500,
			start_time: 1,
			end_time: 2,
			first_block_time: 1,
			last_block_time: 2,
			block_count: 21_600,
			tx_count: 350_000,
			output: '1',
			fees: '2',
			active_stake: '30000000000000000',
		})
		getNetwork.mockResolvedValueOnce({
			supply: {
				max: '45000000000000000',
				total: '37000000000000000',
				circulating: '36000000000000000',
				locked: '1',
				treasury: '2',
				reserves: '3',
			},
			stake: {
				live: '24000000000000000',
				active: '23000000000000000',
			},
		})
		getHealth.mockResolvedValueOnce({ is_healthy: true })

		expect(await cardanoNetworkObservationResolver.resolve[
			CardanoNetwork_TimestampSelector.NetworkTimestampMsSource
		](
			{
				$network: { slug: 'cardano' },
				timestampMs: 1_720_000_000_000,
				source: 'Blockfrost_Rest',
			},
			resolverContext
		)).toEqual({
			timestampMs: 1_720_000_000_000,
			latestSlot: 130_000_000n,
			latestBlockNo: 10_000_000n,
			latestBlockHash: 'block-hash',
			latestBlockTimeMs: 1_720_000_000_000,
			latestBlockTransactionCount: 42,
			epoch: 500,
			epochBlockCount: 21_600,
			epochTransactionCount: 350_000,
			circulatingSupplyLovelace: 36_000_000_000_000_000n,
			totalSupplyLovelace: 37_000_000_000_000_000n,
			liveStakeLovelace: 24_000_000_000_000_000n,
			activeStakeLovelace: 23_000_000_000_000_000n,
			backendHealthy: true,
		})
	})

	it('rejects unsupported or stale observation identities', async () => {
		await expect(cardanoNetworkObservationResolver.resolve[
			CardanoNetwork_TimestampSelector.NetworkTimestampMsSource
		](
			{
				$network: { slug: 'cardano' },
				timestampMs: 1_720_000_000_000,
				source: Source.Constants_Internal,
			},
			resolverContext
		)).rejects.toThrow('Blockfrost_Rest: observation source mismatch')
		expect(getLatestBlock).not.toHaveBeenCalled()

		getLatestBlock.mockResolvedValueOnce(latestBlock)
		getLatestEpoch.mockResolvedValueOnce({
			epoch: 500,
			block_count: 21_600,
			tx_count: 350_000,
		})
		getNetwork.mockResolvedValueOnce({
			supply: {
				total: '37000000000000000',
				circulating: '36000000000000000',
			},
			stake: {
				live: '24000000000000000',
				active: '23000000000000000',
			},
		})
		getHealth.mockResolvedValueOnce({ is_healthy: true })

		await expect(cardanoNetworkObservationResolver.resolve[
			CardanoNetwork_TimestampSelector.NetworkTimestampMsSource
		](
			{
				$network: { slug: 'cardano' },
				timestampMs: 1_719_999_999_000,
				source: Source.Blockfrost_Rest,
			},
			resolverContext
		)).rejects.toThrow('Blockfrost_Rest: historical observation is unavailable')

		getLatestBlock.mockResolvedValueOnce({
			...latestBlock,
			time: -1,
		})
		getLatestEpoch.mockResolvedValueOnce({
			epoch: 500,
			block_count: 21_600,
			tx_count: 350_000,
		})
		getNetwork.mockResolvedValueOnce({
			supply: {
				total: '37000000000000000',
				circulating: '36000000000000000',
			},
			stake: {
				live: '24000000000000000',
				active: '23000000000000000',
			},
		})
		getHealth.mockResolvedValueOnce({ is_healthy: true })

		await expect(cardanoNetworkObservationResolver.resolve[
			CardanoNetwork_TimestampSelector.NetworkTimestampMsSource
		](
			{
				$network: { slug: 'cardano' },
				timestampMs: 0,
				source: Source.Blockfrost_Rest,
			},
			resolverContext
		)).rejects.toThrow('Blockfrost_Rest: block has an invalid snapshot clock')
	})

	it('rejects non-Cardano network selectors before transport calls', async () => {
		await expect(cardanoNetworkObservationResolver.resolve[
			CardanoNetwork_TimestampSelector.NetworkTimestampMsSource
		](
			{
				$network: { slug: 'bitcoin' },
				timestampMs: 1,
				source: 'Blockfrost_Rest',
			},
			resolverContext
		)).rejects.toThrow('Blockfrost_Rest: unsupported network')
		expect(getLatestBlock).not.toHaveBeenCalled()
	})

	it('maps generated Blockfrost block coordinates by hash', async () => {
		getBlock.mockResolvedValueOnce(latestBlock)

		await expect(cardanoBlockResolver.resolve[CardanoBlockSelector.NetworkHash](
			{
				$network: { slug: 'cardano' },
				hash: 'block-hash',
			},
			resolverContext
		)).resolves.toEqual({
			hash: 'block-hash',
			slot: 130_000_000n,
			blockNo: 10_000_000n,
			epoch: 500,
		})
		expect(getBlock).toHaveBeenLastCalledWith(
			blockfrostBinding,
			'block-hash'
		)
	})

	it('passes slot and block-number selectors through without precision loss', async () => {
		getBlock.mockResolvedValueOnce(latestBlock).mockResolvedValueOnce(latestBlock)

		await cardanoBlockResolver.resolve[CardanoBlockSelector.NetworkSlot](
			{
				$network: { slug: 'cardano' },
				slot: 130_000_000n,
			},
			resolverContext
		)
		await cardanoBlockResolver.resolve[CardanoBlockSelector.NetworkBlockNo](
			{
				$network: { slug: 'cardano' },
				blockNo: 10_000_000n,
			},
			resolverContext
		)

		expect(getBlock).toHaveBeenNthCalledWith(
			1,
			blockfrostBinding,
			'130000000'
		)
		expect(getBlock).toHaveBeenNthCalledWith(
			2,
			blockfrostBinding,
			'10000000'
		)
	})

	it('keeps missing and malformed blocks distinct from unsupported networks', async () => {
		getBlock.mockRejectedValueOnce(new Error('Blockfrost_Rest: block not found'))
		await expect(cardanoBlockResolver.resolve[CardanoBlockSelector.NetworkHash](
			{
				$network: { slug: 'cardano' },
				hash: 'missing-block',
			},
			resolverContext
		)).rejects.toThrow('Blockfrost_Rest: block not found')

		getBlock.mockResolvedValueOnce({
			...latestBlock,
			slot: null,
		})
		await expect(cardanoBlockResolver.resolve[CardanoBlockSelector.NetworkHash](
			{
				$network: { slug: 'cardano' },
				hash: 'malformed-block',
			},
			resolverContext
		)).rejects.toThrow('Blockfrost_Rest: block is missing its Cardano ledger coordinates')

		await expect(cardanoBlockResolver.resolve[CardanoBlockSelector.NetworkHash](
			{
				$network: { slug: 'bitcoin' },
				hash: 'block-hash',
			},
			resolverContext
		)).rejects.toThrow('Blockfrost_Rest: unsupported network')
	})

	it('rejects responses that do not match the requested selector identity', async () => {
		getBlock.mockResolvedValueOnce({
			...latestBlock,
			hash: 'different-block-hash',
		})
		await expect(cardanoBlockResolver.resolve[CardanoBlockSelector.NetworkHash](
			{
				$network: { slug: 'cardano' },
				hash: 'block-hash',
			},
			resolverContext
		)).rejects.toThrow('Blockfrost_Rest: block hash does not match the requested selector')

		getBlock.mockResolvedValueOnce({
			...latestBlock,
			slot: latestBlock.slot + 1,
		})
		await expect(cardanoBlockResolver.resolve[CardanoBlockSelector.NetworkSlot](
			{
				$network: { slug: 'cardano' },
				slot: BigInt(latestBlock.slot),
			},
			resolverContext
		)).rejects.toThrow('Blockfrost_Rest: block slot does not match the requested selector')

		getBlock.mockResolvedValueOnce({
			...latestBlock,
			height: latestBlock.height + 1,
		})
		await expect(cardanoBlockResolver.resolve[CardanoBlockSelector.NetworkBlockNo](
			{
				$network: { slug: 'cardano' },
				blockNo: BigInt(latestBlock.height),
			},
			resolverContext
		)).rejects.toThrow('Blockfrost_Rest: block number does not match the requested selector')
	})

	it('rejects unsafe or negative Cardano ledger coordinates', async () => {
		getBlock.mockResolvedValueOnce({
			...latestBlock,
			slot: Number.MAX_SAFE_INTEGER + 1,
		})
		await expect(cardanoBlockResolver.resolve[CardanoBlockSelector.NetworkHash](
			{
				$network: { slug: 'cardano' },
				hash: 'block-hash',
			},
			resolverContext
		)).rejects.toThrow('Blockfrost_Rest: block has invalid Cardano ledger coordinates')

		getBlock.mockResolvedValueOnce({
			...latestBlock,
			height: -1,
		})
		await expect(cardanoBlockResolver.resolve[CardanoBlockSelector.NetworkHash](
			{
				$network: { slug: 'cardano' },
				hash: 'block-hash',
			},
			resolverContext
		)).rejects.toThrow('Blockfrost_Rest: block has invalid Cardano ledger coordinates')
	})
})

import { beforeEach, describe, expect, it, vi } from 'vitest'

import blockFixture from '$/sources/Blockfrost/Rest/fixtures/block.json'
import { EntityType } from '$/schema/EntityType.ts'
import { entityFieldAddressKey, EntityMetaKey } from '$/schema/$schema.ts'
import { NetworkNamespace, networkBySlug } from '$/constants/Network.ts'
import type {
	BlockfrostAddress,
	BlockfrostAddressTotal,
	BlockfrostAddressTransactions,
	BlockfrostAddressUtxos,
	BlockfrostAssets,
	BlockfrostBlock,
	BlockfrostCommittee,
	BlockfrostDRepListItem,
	BlockfrostGovernanceProposals,
	BlockfrostProtocolParameters,
	BlockfrostStakePools,
	BlockfrostTransaction,
	BlockfrostTransactionUtxos,
	BlockfrostTransactions,
} from '$/sources/Blockfrost/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
import bindings from '$/sources/Blockfrost/bindings.ts'

const getHealth = vi.fn()
const getAccount = vi.fn()
const getAddress = vi.fn()
const getAddressTotal = vi.fn()
const getAsset = vi.fn()
const getLatestBlock = vi.fn()
const getLatestEpoch = vi.fn()
const getLatestProtocolParameters = vi.fn()
const getNetwork = vi.fn()
const getCommittee = vi.fn()
const listCommitteeVotes = vi.fn()
const listAccountAddresses = vi.fn()
const listAddressTransactions = vi.fn()
const listAddressUtxos = vi.fn()
const listBlocks = vi.fn()
const listLatestBlockTransactions = vi.fn()
const listStakePools = vi.fn()
const listDReps = vi.fn()
const listGovernanceProposals = vi.fn()
const listAssets = vi.fn()
const getBlock = vi.fn()
const getDRep = vi.fn()
const getDRepMetadata = vi.fn()
const listDRepVotes = vi.fn()
const getGovernanceProposal = vi.fn()
const getGovernanceProposalMetadata = vi.fn()
const listGovernanceProposalVotes = vi.fn()
const getStakePool = vi.fn()
const getStakePoolMetadata = vi.fn()
const getTransaction = vi.fn()
const getTransactionUtxos = vi.fn()

vi.mock('$/sources/Blockfrost/Rest/queries.ts', () => ({
	getHealth,
	getAccount,
	getAddress,
	getAddressTotal,
	getAsset,
	getLatestBlock,
	getLatestEpoch,
	getLatestProtocolParameters,
	getNetwork,
	getCommittee,
	listCommitteeVotes,
	listAccountAddresses,
	listAddressTransactions,
	listAddressUtxos,
	listBlocks,
	listLatestBlockTransactions,
	listStakePools,
	listDReps,
	listGovernanceProposals,
	listAssets,
	getBlock,
	getDRep,
	getDRepMetadata,
	listDRepVotes,
	getGovernanceProposal,
	getGovernanceProposalMetadata,
	listGovernanceProposalVotes,
	getStakePool,
	getStakePoolMetadata,
	getTransaction,
	getTransactionUtxos,
}))

const { default: blockfrostResolvers } = await import('$/resolvers/Blockfrost-Rest.ts')

const cardanoAddressResolver = blockfrostResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CardanoAddress
	&& 'addressKind' in resolver.projections
))

if (cardanoAddressResolver == null)
	throw new Error('Blockfrost-Rest spec missing CardanoAddress resolver')

const cardanoAddressTransactionsResolver = blockfrostResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CardanoAddress
	&& '$$transactions' in resolver.projections
))

if (cardanoAddressTransactionsResolver == null)
	throw new Error('Blockfrost-Rest spec missing CardanoAddress.$$transactions resolver')

const cardanoAddressUtxosResolver = blockfrostResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CardanoAddress
	&& '$$utxos' in resolver.projections
	&& '$$assets' in resolver.projections
))

if (cardanoAddressUtxosResolver == null)
	throw new Error('Blockfrost-Rest spec missing CardanoAddress UTXO relationship resolver')

const cardanoTransactionResolver = blockfrostResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CardanoTransaction
))

if (cardanoTransactionResolver == null)
	throw new Error('Blockfrost-Rest spec missing CardanoTransaction resolver')

const cardanoTransactionRelationshipsResolver = blockfrostResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CardanoTransaction
	&& '$$inputs' in resolver.projections
	&& '$$outputs' in resolver.projections
	&& '$$assets' in resolver.projections
))

if (cardanoTransactionRelationshipsResolver == null)
	throw new Error('Blockfrost-Rest spec missing CardanoTransaction relationship resolver')

const cardanoTxInputResolver = blockfrostResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CardanoTxInput
))

if (cardanoTxInputResolver == null)
	throw new Error('Blockfrost-Rest spec missing CardanoTxInput resolver')

const cardanoTxOutputResolver = blockfrostResolvers.resolvers.find((resolver) => (
	resolver.entityType === EntityType.CardanoTxOutput
))

if (cardanoTxOutputResolver == null)
	throw new Error('Blockfrost-Rest spec missing CardanoTxOutput resolver')

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

const cardanoCommitteeEpochResolver = blockfrostResolvers.resolvers.find((
	resolver
): resolver is Extract<
	typeof blockfrostResolvers.resolvers[number],
	{ entityType: EntityType.CardanoCommittee_Epoch }
> => resolver.entityType === EntityType.CardanoCommittee_Epoch)

if (cardanoCommitteeEpochResolver == null)
	throw new Error('Blockfrost-Rest spec missing CardanoCommittee_Epoch resolver')

const blockfrostBinding = bindings[Source.Blockfrost_Rest][0]

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
const cardanoNetwork = {
	caip2: networkBySlug.cardano.caip2,
}
const cardanoAddress = {
	$network: cardanoNetwork,
	address: 'addr1qxqs59lphg8g6qndelq8xwqn60ag3aeyfcp33c2kdp46a09re5df3pzwwmyq946axfcejy5n4x0y99wqpgtp2gd0k09qsgy6pz',
}
const cardanoTransaction = {
	$network: cardanoNetwork,
	hash: 'transaction-hash',
}
const cardanoNativeAssetUnit = `${'a'.repeat(56)}746f6b656e`
const cardanoTransactionUtxos = {
	hash: cardanoTransaction.hash,
	inputs: [
		{
			address: 'addr1input',
			amount: [
				{
					unit: 'lovelace',
					quantity: '5000000',
				},
				{
					unit: cardanoNativeAssetUnit,
					quantity: '2',
				},
			],
			tx_hash: 'spent-transaction-hash',
			output_index: 3,
			data_hash: null,
			inline_datum: null,
			reference_script_hash: null,
			collateral: false,
			reference: true,
		},
	],
	outputs: [
		{
			address: 'addr1output',
			amount: [
				{
					unit: 'lovelace',
					quantity: '3000000',
				},
				{
					unit: cardanoNativeAssetUnit,
					quantity: '2',
				},
			],
			output_index: 1,
			data_hash: 'datum-hash',
			inline_datum: '19a6aa',
			collateral: false,
			reference_script_hash: 'reference-script-hash',
			consumed_by_tx: 'consuming-transaction-hash',
		},
	],
} satisfies BlockfrostTransactionUtxos
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
		displayName: 'Example DRep',
	},
] satisfies BlockfrostDRepListItem[]
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

	return resolver.resolve['Caip2'].resolve(
		cardanoNetwork,
		resolverContext
	)
}

describe('Blockfrost Cardano address facet', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('materializes address facts and the latest source observation', async () => {
		getAddress.mockResolvedValueOnce({
			address: cardanoAddress.address,
			amount: [
				{
					unit: 'lovelace',
					quantity: '42000000',
				},
				{
					unit: `${'a'.repeat(56)}746f6b656e`,
					quantity: '12',
				},
			],
			stake_address: 'stake1ux3g2c9dx2nhhehyrezyxpkstartcqmu9hk63qgfkccw5rqttygt7',
			type: 'shelley',
			script: false,
		} satisfies BlockfrostAddress)
		getAddressTotal.mockResolvedValueOnce({
			address: cardanoAddress.address,
			received_sum: [],
			sent_sum: [],
			tx_count: 12,
		} satisfies BlockfrostAddressTotal)
		getLatestBlock.mockResolvedValueOnce(latestBlock)

		await expect(cardanoAddressResolver.resolve[
			'NetworkAddress'
		].resolve(
			cardanoAddress,
			resolverContext
		)).resolves.toEqual({
			addressKind: 'shelley-key',
			$stakeCredential: {
				[EntityMetaKey.Selector]: {
					$network: cardanoNetwork,
					credential: 'stake1ux3g2c9dx2nhhehyrezyxpkstartcqmu9hk63qgfkccw5rqttygt7',
				},
			},
			$$timestamps: [
				{
					[EntityMetaKey.Selector]: {
						$address: cardanoAddress,
						blockSlot: 130_000_000n,
						source: Source.Blockfrost_Rest,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoAddress_Timestamp, [], 'timestampMs')]: 1_720_000_000_000,
						[entityFieldAddressKey(EntityType.CardanoAddress_Timestamp, [], 'blockHash')]: 'block-hash',
						[entityFieldAddressKey(EntityType.CardanoAddress_Timestamp, [], 'lovelaceBalance')]: 42_000_000n,
						[entityFieldAddressKey(EntityType.CardanoAddress_Timestamp, [], 'nativeAssetCount')]: 1,
						[entityFieldAddressKey(EntityType.CardanoAddress_Timestamp, [], 'transactionCount')]: 12,
					},
				},
			],
		})
		expect(getAddress).toHaveBeenCalledWith(cardanoAddress.address)
		expect(getAddressTotal).toHaveBeenCalledWith(cardanoAddress.address)
	})

	it('preserves the absence of a stake credential for addresses without one', async () => {
		getAddress.mockResolvedValueOnce({
			address: cardanoAddress.address,
			amount: [],
			stake_address: null,
			type: 'byron',
			script: false,
		} satisfies BlockfrostAddress)
		getAddressTotal.mockResolvedValueOnce({
			address: cardanoAddress.address,
			received_sum: [],
			sent_sum: [],
			tx_count: 0,
		} satisfies BlockfrostAddressTotal)
		getLatestBlock.mockResolvedValueOnce(latestBlock)

		const address = await cardanoAddressResolver.resolve[
			'NetworkAddress'
		].resolve(
			cardanoAddress,
			resolverContext
		)

		expect(cardanoAddressResolver.projections.$stakeCredential(
			address,
			cardanoAddress,
			resolverContext
		)).toBeUndefined()
	})

	it('maps address transactions and UTXOs with subject-scoped pagination', async () => {
		listAddressTransactions.mockResolvedValueOnce([
			{
				tx_hash: 'newest-transaction-hash',
				tx_index: 1,
				block_height: 10_000_000,
				block_time: 1_720_000_000,
			},
			{
				tx_hash: 'older-transaction-hash',
				tx_index: 0,
				block_height: 9_999_999,
				block_time: 1_719_999_980,
			},
		] satisfies BlockfrostAddressTransactions)
		listAddressUtxos.mockResolvedValueOnce([
			{
				address: cardanoAddress.address,
				tx_hash: 'utxo-transaction-hash',
				tx_index: 0,
				output_index: 2,
				amount: [
					{
						unit: 'lovelace',
						quantity: '729235000',
					},
					{
						unit: assets[0].asset,
						quantity: '3',
					},
					{
						unit: `${'b'.repeat(56)}6e6674`,
						quantity: '1',
					},
				],
				block: 'utxo-block-hash',
				data_hash: 'datum-hash',
				inline_datum: '19a6aa',
				reference_script_hash: 'reference-script-hash',
			},
			{
				address: cardanoAddress.address,
				tx_hash: 'second-utxo-transaction-hash',
				tx_index: 0,
				output_index: 3,
				amount: [
					{
						unit: 'lovelace',
						quantity: '1000000',
					},
					{
						unit: assets[0].asset,
						quantity: '2',
					},
				],
				block: 'second-utxo-block-hash',
				data_hash: null,
				inline_datum: null,
				reference_script_hash: null,
			},
		] satisfies BlockfrostAddressUtxos)

		const transactionSnapshot = await cardanoAddressTransactionsResolver.resolve[
			'NetworkAddress'
		].resolve(
			cardanoAddress,
			{
				...resolverContext,
				pagination: {
					limit: 2,
				},
				providerContinuationToken: '2',
			}
		)
		const transactionProjection = cardanoAddressTransactionsResolver.projections.$$transactions
		if (
			typeof transactionProjection === 'function'
			|| transactionProjection.select == null
			|| transactionProjection.continuation == null
		)
			throw new Error('Blockfrost-Rest spec missing Cardano address transaction pagination')

		expect(transactionProjection.select(
			transactionSnapshot,
			cardanoAddress,
			resolverContext
		).map((row) => row[EntityMetaKey.Selector])).toEqual([
			{
				$network: cardanoNetwork,
				hash: 'newest-transaction-hash',
			},
			{
				$network: cardanoNetwork,
				hash: 'older-transaction-hash',
			},
		])
		expect(transactionProjection.continuation(
			transactionSnapshot,
			cardanoAddress,
			resolverContext
		)).toEqual({
			operation: 'address-transactions',
			target: cardanoAddress.address,
			terminal: false,
			token: '3',
		})
		expect(listAddressTransactions).toHaveBeenCalledWith(
			cardanoAddress.address,
			2,
			2
		)

		const utxoSnapshot = await cardanoAddressUtxosResolver.resolve[
			'NetworkAddress'
		].resolve(
			cardanoAddress,
			{
				...resolverContext,
				pagination: {
					limit: 3,
				},
			}
		)
		const utxoProjection = cardanoAddressUtxosResolver.projections.$$utxos
		if (
			typeof utxoProjection === 'function'
			|| utxoProjection.select == null
			|| utxoProjection.continuation == null
		)
			throw new Error('Blockfrost-Rest spec missing Cardano address UTXO pagination')

		expect(utxoProjection.select(
			utxoSnapshot,
			cardanoAddress,
			resolverContext
		)[0]).toMatchObject(
			{
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network: cardanoNetwork,
						hash: 'utxo-transaction-hash',
					},
					outputIndex: 2,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'lovelace')]: 729_235_000n,
					[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'datumHash')]: 'datum-hash',
					[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'referenceScriptHash')]: 'reference-script-hash',
				},
			}
		)
		expect(utxoProjection.continuation(
			utxoSnapshot,
			cardanoAddress,
			resolverContext
		)).toEqual({
			operation: 'address-utxos',
			target: cardanoAddress.address,
			terminal: true,
		})
		const assetProjection = cardanoAddressUtxosResolver.projections.$$assets
		if (
			typeof assetProjection === 'function'
			|| assetProjection.select == null
			|| assetProjection.continuation == null
		)
			throw new Error('Blockfrost-Rest spec missing Cardano address asset pagination')

		expect(assetProjection.select(
			utxoSnapshot,
			cardanoAddress,
			resolverContext
		).map((row) => row[EntityMetaKey.Selector])).toEqual([
			{
				$network: cardanoNetwork,
				policyId: 'a'.repeat(56),
				assetName: '746f6b656e',
			},
			{
				$network: cardanoNetwork,
				policyId: 'b'.repeat(56),
				assetName: '6e6674',
			},
		])
		expect(assetProjection.continuation(
			utxoSnapshot,
			cardanoAddress,
			resolverContext
		)).toEqual({
			operation: 'address-utxos',
			target: cardanoAddress.address,
			terminal: true,
		})
		expect(listAddressUtxos).toHaveBeenCalledWith(
			cardanoAddress.address,
			3,
			1
		)
	})

	it.each([
		[
			'address transactions',
			cardanoAddressTransactionsResolver,
			cardanoAddress,
			'address transaction',
		],
		[
			'address UTXOs',
			cardanoAddressUtxosResolver,
			cardanoAddress,
			'address UTXO',
		],
	])('rejects non-canonical %s continuation tokens', async (
		_name,
		resolver,
		selector,
		label
	) => {
		await expect(resolver.resolve['NetworkAddress'].resolve(
			selector,
			{
				...resolverContext,
				providerContinuationToken: '1e2',
			}
		)).rejects.toThrow(`Blockfrost_Rest: invalid ${label} continuation`)
	})

	it('materializes transaction summary fields from the transaction detail operation', async () => {
		getTransaction.mockResolvedValueOnce({
			hash: cardanoTransaction.hash,
			block: 'block-hash',
			block_height: 10_000_000,
			block_time: 1_720_000_000,
			slot: 130_000_000,
			index: 1,
			output_amount: [],
			fees: '182485',
			deposit: '2000000',
			size: 433,
			invalid_before: '129999000',
			invalid_hereafter: '130001000',
			utxo_count: 4,
			withdrawal_count: 0,
			mir_cert_count: 0,
			delegation_count: 0,
			stake_cert_count: 0,
			pool_update_count: 0,
			pool_retire_count: 0,
			asset_mint_or_burn_count: 0,
			redeemer_count: 0,
			valid_contract: true,
			treasury_donation: '0',
		} satisfies BlockfrostTransaction)

		const transaction = await cardanoTransactionResolver.resolve[
			'NetworkHash'
		].resolve(
			cardanoTransaction,
			resolverContext
		)

		expect(getTransaction).toHaveBeenCalledWith(cardanoTransaction.hash)
		expect(cardanoTransactionResolver.projections.blockSlot(transaction, cardanoTransaction, resolverContext)).toBe(130_000_000n)
		expect(cardanoTransactionResolver.projections.fee(transaction, cardanoTransaction, resolverContext)).toBe(182_485n)
		expect(cardanoTransactionResolver.projections.deposit(transaction, cardanoTransaction, resolverContext)).toBe(2_000_000n)
		expect(cardanoTransactionResolver.projections.sizeBytes(transaction, cardanoTransaction, resolverContext)).toBe(433)
		expect(cardanoTransactionResolver.projections.validityStartSlot(transaction, cardanoTransaction, resolverContext)).toBe(129_999_000n)
		expect(cardanoTransactionResolver.projections.ttlSlot(transaction, cardanoTransaction, resolverContext)).toBe(130_001_000n)
	})

	it('materializes transaction inputs, outputs, and native assets from the exact UTXO snapshot', async () => {
		getTransactionUtxos.mockResolvedValueOnce(cardanoTransactionUtxos)

		const transactionUtxos = await cardanoTransactionRelationshipsResolver.resolve[
			'NetworkHash'
		].resolve(
			cardanoTransaction,
			resolverContext
		)

		expect(getTransactionUtxos).toHaveBeenCalledWith(
			cardanoTransaction.hash
		)
		expect(cardanoTransactionRelationshipsResolver.projections.$$inputs(
			transactionUtxos,
			cardanoTransaction,
			resolverContext
		)).toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					$transaction: cardanoTransaction,
					inputIndex: 0,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoTxInput, [], 'inputKind')]: 'reference',
					[entityFieldAddressKey(EntityType.CardanoTxInput, [], 'spentTxHash')]: 'spent-transaction-hash',
					[entityFieldAddressKey(EntityType.CardanoTxInput, [], 'spentOutputIndex')]: 3,
					[entityFieldAddressKey(EntityType.CardanoTxInput, [], '$spentOutput')]: {
						[EntityMetaKey.Selector]: {
							$transaction: {
								$network: cardanoNetwork,
								hash: 'spent-transaction-hash',
							},
							outputIndex: 3,
						},
					},
				},
			},
		])
		expect(cardanoTransactionRelationshipsResolver.projections.$$outputs(
			transactionUtxos,
			cardanoTransaction,
			resolverContext
		)).toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					$transaction: cardanoTransaction,
					outputIndex: 1,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'address')]: 'addr1output',
					[entityFieldAddressKey(EntityType.CardanoTxOutput, [], '$address')]: {
						[EntityMetaKey.Selector]: {
							$network: cardanoNetwork,
							address: 'addr1output',
						},
					},
					[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'lovelace')]: 3_000_000n,
					[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'datumHash')]: 'datum-hash',
					[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'spentByTxHash')]: 'consuming-transaction-hash',
				},
			},
		])
		expect(cardanoTransactionRelationshipsResolver.projections.$$assets(
			transactionUtxos,
			cardanoTransaction,
			resolverContext
		).map((row) => row[EntityMetaKey.Selector])).toEqual([
			{
				$network: cardanoNetwork,
				policyId: 'a'.repeat(56),
				assetName: '746f6b656e',
			},
		])
	})

	it('resolves cold transaction input and output selectors from the same UTXO operation', async () => {
		getTransactionUtxos
			.mockResolvedValueOnce(cardanoTransactionUtxos)
			.mockResolvedValueOnce(cardanoTransactionUtxos)

		const cardanoTxInput = {
			$transaction: cardanoTransaction,
			inputIndex: 0,
		}
		const input = await cardanoTxInputResolver.resolve[
			'TransactionInputIndex'
		].resolve(
			cardanoTxInput,
			resolverContext
		)
		expect(cardanoTxInputResolver.projections.inputKind(
			input,
			cardanoTxInput,
			resolverContext
		)).toBe('reference')
		expect(cardanoTxInputResolver.projections.$spentOutput(
			input,
			cardanoTxInput,
			resolverContext
		)).toEqual({
			[EntityMetaKey.Selector]: {
				$transaction: {
					$network: cardanoNetwork,
					hash: 'spent-transaction-hash',
				},
				outputIndex: 3,
			},
		})

		const cardanoTxOutput = {
			$transaction: cardanoTransaction,
			outputIndex: 1,
		}
		const output = await cardanoTxOutputResolver.resolve[
			'TransactionOutputIndex'
		].resolve(
			cardanoTxOutput,
			resolverContext
		)
		expect(cardanoTxOutputResolver.projections.lovelace(
			output,
			cardanoTxOutput,
			resolverContext
		)).toBe(3_000_000n)
		expect(cardanoTxOutputResolver.projections.$$assets(
			output,
			cardanoTxOutput,
			resolverContext
		)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$output: cardanoTxOutput,
					$asset: {
						$network: cardanoNetwork,
						policyId: 'a'.repeat(56),
						assetName: '746f6b656e',
					},
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoTxOutputAsset, [], 'quantity')]: 2n,
				},
			},
		])
	})
})

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

	it('resolves Cardano network fields from both public route selectors', () => {
		for (const resolver of blockfrostResolvers.resolvers.filter(({ entityType }) => (
			entityType === EntityType.Network
		))) {
			expect(resolver.resolve).toHaveProperty('Slug')
			expect(resolver.resolve).toHaveProperty('Caip2')
		}
	})

	it('maps a nonempty $$transactions source-shaped result', async () => {
		listLatestBlockTransactions.mockResolvedValueOnce(transactions)

		await expect(resolveCardanoField('$$transactions')).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: cardanoNetwork,
					hash: 'transaction-hash',
				},
			},
		])
	})

	it('maps a nonempty $$stakePools source-shaped result', async () => {
		listStakePools.mockResolvedValueOnce(stakePools)

		await expect(resolveCardanoField('$$stakePools')).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: cardanoNetwork,
					poolId: 'pool1example',
				},
			},
		])
	})

	it('maps a nonempty $$dReps source-shaped result', async () => {
		listDReps.mockResolvedValueOnce(dReps)

		await expect(resolveCardanoField('$$dReps')).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: cardanoNetwork,
					drepCredential: 'drep1example',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoDRep, [], 'credentialKind')]: 'key',
					[entityFieldAddressKey(EntityType.CardanoDRep, [], 'displayName')]: 'Example DRep',
				},
			},
		])
	})

	it('maps a nonempty $$governanceProposals source-shaped result', async () => {
		listGovernanceProposals.mockResolvedValueOnce(governanceProposals)
		const resolver = blockfrostResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Cardano' in candidate.projections
			&& '$$governanceProposals' in candidate.projections.Cardano
		))
		if (
			resolver == null
			|| typeof resolver.projections.Cardano.$$governanceProposals === 'function'
			|| resolver.projections.Cardano.$$governanceProposals.select == null
		)
			throw new Error('Blockfrost-Rest spec missing governance proposal pagination')
		const snapshot = await resolver.resolve['Caip2'].resolve(
			cardanoNetwork,
			resolverContext
		)

		expect(resolver.projections.Cardano.$$governanceProposals.select(
			snapshot,
			cardanoNetwork,
			resolverContext
		)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: cardanoNetwork,
					proposalTxHash: 'proposal-transaction-hash',
					proposalIndex: 1,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'governanceActionId')]: 'gov_action1example',
					[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'proposalKind')]: 'info_action',
				},
			},
		])
		expect(listGovernanceProposals).toHaveBeenCalledWith(64, 1)
	})

	it('continues governance proposal pages and rejects malformed or duplicate pages', async () => {
		const resolver = blockfrostResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Cardano' in candidate.projections
			&& '$$governanceProposals' in candidate.projections.Cardano
		))
		if (
			resolver == null
			|| typeof resolver.projections.Cardano.$$governanceProposals === 'function'
			|| resolver.projections.Cardano.$$governanceProposals.continuation == null
		)
			throw new Error('Blockfrost-Rest spec missing governance proposal continuation')
		listGovernanceProposals.mockResolvedValueOnce(governanceProposals)
		const context = {
			...resolverContext,
			pagination: { limit: 1 },
			providerContinuationToken: 'after=previous-hash%3A0&page=2',
		}
		const snapshot = await resolver.resolve['Caip2'].resolve(
			cardanoNetwork,
			context
		)
		expect(listGovernanceProposals).toHaveBeenCalledWith(1, 2)
		expect(resolver.projections.Cardano.$$governanceProposals.continuation(
			snapshot,
			cardanoNetwork,
			context
		)).toEqual({
			operation: 'cardano-governance-proposals',
			target: networkBySlug.cardano.slug,
			terminal: false,
			token: 'after=proposal-transaction-hash%3A1&page=3',
		})

		await expect(resolver.resolve['Caip2'].resolve(
			cardanoNetwork,
			{
				...resolverContext,
				providerContinuationToken: '2.5',
			}
		)).rejects.toThrow('invalid governance proposals continuation')
		listGovernanceProposals.mockResolvedValueOnce(governanceProposals)
		await expect(resolver.resolve['Caip2'].resolve(
			cardanoNetwork,
			{
				...resolverContext,
				providerContinuationToken: 'after=proposal-transaction-hash%3A1&page=2',
			}
		)).rejects.toThrow('governance proposals continuation did not advance')
		listGovernanceProposals.mockResolvedValueOnce([
			governanceProposals[0],
			governanceProposals[0],
		])
		await expect(resolver.resolve['Caip2'].resolve(
			cardanoNetwork,
			resolverContext
		)).rejects.toThrow('governance proposals page contains duplicate identities')
	})

	it('maps a nonempty $$assets source-shaped result', async () => {
		listAssets.mockResolvedValueOnce(assets)

		await expect(resolveCardanoField('$$assets')).resolves.toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: cardanoNetwork,
					policyId: 'a'.repeat(56),
					assetName: '746f6b656e',
				},
			},
		])
	})

	it('maps a nonempty $$protocolParameterEpochs source-shaped result', async () => {
		getLatestProtocolParameters.mockResolvedValueOnce(protocolParameters)

		await expect(resolveCardanoField('$$protocolParameterEpochs')).resolves.toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					$network: cardanoNetwork,
					epoch: 500,
					source: Source.Blockfrost_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'minFeeA')]: 44n,
					[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'keyDeposit')]: 2_000_000n,
					[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'coinsPerUtxoByte')]: 4_310n,
					[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxValueSize')]: 5_000,
					[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'costModels')]: {
						PlutusV3: [1],
					},
				},
			},
		])
	})

	it('maps a nonempty $$committeeEpochs source-shaped result', async () => {
		getCommittee.mockResolvedValueOnce(committee)
		listCommitteeVotes.mockResolvedValueOnce([
			{
				tx_hash: 'committee-vote-hash',
				voter_hot_id: 'cc_hot1example',
				proposal_id: 'gov_action1example',
				proposal_tx_hash: 'proposal-hash',
				proposal_index: 1,
				governance_type: 'info_action',
				vote: 'yes',
				metadata_url: 'https://example.com/vote.json',
				metadata_hash: 'vote-metadata-hash',
				block_height: 1_000,
				block_time: 1_700_000_000,
			},
		])
		getLatestEpoch.mockResolvedValueOnce({
			epoch: 500,
		})

		await expect(resolveCardanoField('$$committeeEpochs')).resolves.toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					$network: cardanoNetwork,
					epoch: 500,
					source: Source.Blockfrost_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'govActionId')]: 'gov_action1committee',
					[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], '$seatingProposal')]: {
						[EntityMetaKey.Selector]: {
							$network: cardanoNetwork,
							proposalTxHash: 'committee-proposal-transaction-hash',
							proposalIndex: 2,
						},
					},
					[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'dissolved')]: false,
					[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'quorumNumerator')]: 2,
					[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'quorumDenominator')]: 3,
					[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'memberCount')]: 1,
					[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], '$$votes')]: [{
						[EntityMetaKey.Selector]: {
							voterKind: 'constitutional-committee',
							voteTxHash: 'committee-vote-hash',
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], 'timestampMs')]: 1_700_000_000_000,
						},
					}],
				},
			},
		])
	})

	it('resolves the current committee epoch through its own selector', async () => {
		getCommittee.mockResolvedValueOnce(committee)
		listCommitteeVotes.mockResolvedValueOnce([])
		getLatestEpoch.mockResolvedValueOnce({
			epoch: 500,
		})

		await expect(cardanoCommitteeEpochResolver.resolve[
			'NetworkEpochSource'
		].resolve(
			{
				$network: cardanoNetwork,
				epoch: 500,
				source: Source.Blockfrost_Rest,
			},
			resolverContext
		)).resolves.toMatchObject({
			epoch: 500,
			source: Source.Blockfrost_Rest,
			govActionId: 'gov_action1committee',
			memberCount: 1,
			$$votes: [],
		})
	})

	it('rejects unsupported and historical committee epoch identities', async () => {
		await expect(cardanoCommitteeEpochResolver.resolve[
			'NetworkEpochSource'
		].resolve(
			{
				$network: cardanoNetwork,
				epoch: 500,
				source: Source.Constants_Internal,
			},
			resolverContext
		)).rejects.toThrow('Blockfrost_Rest: observation source mismatch')
		expect(getCommittee).not.toHaveBeenCalled()

		getCommittee.mockResolvedValueOnce(committee)
		listCommitteeVotes.mockResolvedValueOnce([])
		getLatestEpoch.mockResolvedValueOnce({
			epoch: 500,
		})

		await expect(cardanoCommitteeEpochResolver.resolve[
			'NetworkEpochSource'
		].resolve(
			{
				$network: cardanoNetwork,
				epoch: 499,
				source: Source.Blockfrost_Rest,
			},
			resolverContext
		)).rejects.toThrow('Blockfrost_Rest: historical committee epoch is unavailable')
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
			'NetworkTimestampMsSource'
		].resolve(
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
			'NetworkTimestampMsSource'
		].resolve(
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
			'NetworkTimestampMsSource'
		].resolve(
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
			'NetworkTimestampMsSource'
		].resolve(
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
			'NetworkTimestampMsSource'
		].resolve(
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

		await expect(cardanoBlockResolver.resolve['NetworkHash'].resolve(
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
			'block-hash'
		)
	})

	it('projects enrolled issuerVkey from a nonempty block_vrf leftover', async () => {
		getBlock.mockResolvedValueOnce({
			...latestBlock,
			block_vrf: 'vrf_vk1blockfrost',
		})

		await expect(cardanoBlockResolver.resolve['NetworkHash'].resolve(
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
			issuerVkey: 'vrf_vk1blockfrost',
		})
	})

	it('passes slot and block-number selectors through without precision loss', async () => {
		getBlock.mockResolvedValueOnce(latestBlock).mockResolvedValueOnce(latestBlock)

		await cardanoBlockResolver.resolve['NetworkSlot'].resolve(
			{
				$network: { slug: 'cardano' },
				slot: 130_000_000n,
			},
			resolverContext
		)
		await cardanoBlockResolver.resolve['NetworkBlockNo'].resolve(
			{
				$network: { slug: 'cardano' },
				blockNo: 10_000_000n,
			},
			resolverContext
		)

		expect(getBlock).toHaveBeenNthCalledWith(
			1,
			'130000000'
		)
		expect(getBlock).toHaveBeenNthCalledWith(
			2,
			'10000000'
		)
	})

	it('keeps missing and malformed blocks distinct from unsupported networks', async () => {
		getBlock.mockRejectedValueOnce(new Error('Blockfrost_Rest: block not found'))
		await expect(cardanoBlockResolver.resolve['NetworkHash'].resolve(
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
		await expect(cardanoBlockResolver.resolve['NetworkHash'].resolve(
			{
				$network: { slug: 'cardano' },
				hash: 'malformed-block',
			},
			resolverContext
		)).rejects.toThrow('Blockfrost_Rest: block is missing its Cardano ledger coordinates')

		await expect(cardanoBlockResolver.resolve['NetworkHash'].resolve(
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
		await expect(cardanoBlockResolver.resolve['NetworkHash'].resolve(
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
		await expect(cardanoBlockResolver.resolve['NetworkSlot'].resolve(
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
		await expect(cardanoBlockResolver.resolve['NetworkBlockNo'].resolve(
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
		await expect(cardanoBlockResolver.resolve['NetworkHash'].resolve(
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
		await expect(cardanoBlockResolver.resolve['NetworkHash'].resolve(
			{
				$network: { slug: 'cardano' },
				hash: 'block-hash',
			},
			resolverContext
		)).rejects.toThrow('Blockfrost_Rest: block has invalid Cardano ledger coordinates')
	})
})

describe('Blockfrost Cardano governance details', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		getLatestEpoch.mockResolvedValue({ epoch: 599 })
	})

	it('materializes proposal metadata and an empty vote list', async () => {
		getGovernanceProposal.mockResolvedValue({
			id: 'gov_action1example',
			tx_hash: 'proposal-hash',
			cert_index: 1,
			governance_type: 'info_action',
			governance_description: null,
			deposit: '1000000',
			return_address: 'stake1return',
			ratified_epoch: null,
			enacted_epoch: null,
			dropped_epoch: null,
			expired_epoch: null,
			expiration: 600,
		})
		getGovernanceProposalMetadata.mockResolvedValueOnce({
			id: 'gov_action1example',
			tx_hash: 'proposal-hash',
			cert_index: 1,
			url: 'https://example.com/proposal.json',
			hash: 'metadata-hash',
			json_metadata: null,
			bytes: '',
		})
		listGovernanceProposalVotes.mockResolvedValueOnce([])
		const proposalResolvers = blockfrostResolvers.resolvers.filter(({ entityType }) => entityType === EntityType.CardanoGovernanceProposal)
		const resolver = proposalResolvers.find((candidate) => '$$timestamps' in candidate.projections)
		const metadataResolver = proposalResolvers.find((candidate) => 'anchorUrl' in candidate.projections)

		if (resolver == null || metadataResolver == null)
			throw new Error('missing proposal resolver')

		const resolvedProposal = await resolver.resolve['NetworkProposalTxHashProposalIndex'].resolve(
			{
				$network: cardanoNetwork,
				proposalTxHash: 'proposal-hash',
				proposalIndex: 1,
			},
			resolverContext
		)
		expect(resolvedProposal).toMatchObject({
			governanceActionId: 'gov_action1example',
			proposalKind: 'info_action',
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					epoch: 599,
					source: Source.Blockfrost_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoGovernanceProposal_Timestamp, [], 'expirationEpoch')]: 600,
				},
			}],
			$$votes: [],
		})
		expect(resolvedProposal).not.toHaveProperty('proposalPayload')
		expect(resolvedProposal.$$timestamps[0]).not.toHaveProperty('status')
		await expect(metadataResolver.resolve['NetworkProposalTxHashProposalIndex'].resolve(
			{
				$network: cardanoNetwork,
				proposalTxHash: 'proposal-hash',
				proposalIndex: 1,
			},
			resolverContext
		)).resolves.toMatchObject({
			anchorUrl: 'https://example.com/proposal.json',
		})
	})

	it('keeps proposal lifecycle on one current-epoch observation and never relabels history', async () => {
		getGovernanceProposal.mockResolvedValue({
			id: 'gov_action1example',
			tx_hash: 'proposal-hash',
			cert_index: 1,
			governance_type: 'info_action',
			governance_description: {
				tag: 'InfoAction',
			},
			deposit: '1000000',
			return_address: 'stake1return',
			ratified_epoch: 590,
			enacted_epoch: 591,
			dropped_epoch: null,
			expired_epoch: null,
			expiration: 600,
		})
		getGovernanceProposalMetadata.mockRejectedValueOnce(new Error('metadata transport unavailable'))
		listGovernanceProposalVotes.mockResolvedValueOnce([])
		const proposalResolver = blockfrostResolvers.resolvers.find(({ entityType }) => entityType === EntityType.CardanoGovernanceProposal)
		const observationResolver = blockfrostResolvers.resolvers.find(({ entityType }) => entityType === EntityType.CardanoGovernanceProposal_Timestamp)

		if (proposalResolver == null || observationResolver == null)
			throw new Error('missing proposal lifecycle resolver')

		const proposal = await proposalResolver.resolve['NetworkProposalTxHashProposalIndex'].resolve({
			$network: cardanoNetwork,
			proposalTxHash: 'proposal-hash',
			proposalIndex: 1,
		}, resolverContext)
		expect(proposal).toMatchObject({
			governanceActionId: 'gov_action1example',
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					epoch: 599,
					source: Source.Blockfrost_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoGovernanceProposal_Timestamp, [], 'ratifiedEpoch')]: 590,
					[entityFieldAddressKey(EntityType.CardanoGovernanceProposal_Timestamp, [], 'enactedEpoch')]: 591,
					[entityFieldAddressKey(EntityType.CardanoGovernanceProposal_Timestamp, [], 'expirationEpoch')]: 600,
				},
			}],
		})
		expect(proposal).not.toHaveProperty('proposalPayload')
		expect(proposal.$$timestamps[0]).not.toHaveProperty('status')
		await expect(observationResolver.resolve['ProposalEpochSource'].resolve({
			$proposal: {
				$network: cardanoNetwork,
				proposalTxHash: 'proposal-hash',
				proposalIndex: 1,
			},
			epoch: 599,
			source: Source.Blockfrost_Rest,
		}, resolverContext)).resolves.toMatchObject({
			epoch: 599,
			source: Source.Blockfrost_Rest,
			ratifiedEpoch: 590,
			enactedEpoch: 591,
			expirationEpoch: 600,
		})
		await expect(observationResolver.resolve['ProposalEpochSource'].resolve({
			$proposal: {
				$network: cardanoNetwork,
				proposalTxHash: 'proposal-hash',
				proposalIndex: 1,
			},
			epoch: 598,
			source: Source.Blockfrost_Rest,
		}, resolverContext)).rejects.toThrow('historical proposal observation is unavailable')
		expect(getGovernanceProposal).toHaveBeenCalledTimes(3)
	})

	it('projects every typed governance action into named semantic fields', async () => {
		const proposalResolver = blockfrostResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.CardanoGovernanceProposal
			&& '$$timestamps' in candidate.projections
		))

		if (proposalResolver == null)
			throw new Error('missing proposal resolver')

		for (const [governanceType, governanceDescription, expected] of [
			[
				'parameter_change',
				{
					tag: 'ParameterChange',
					contents: [{ txId: 'prior-parameter', govActionIx: 2 }, {}, 'parameter-policy'],
				},
				{
					$previousAction: { proposalTxHash: 'prior-parameter', proposalIndex: 2 },
					policyHash: 'parameter-policy',
				},
			],
			[
				'hard_fork_initiation',
				{
					tag: 'HardForkInitiation',
					contents: [{ txId: 'prior-fork', govActionIx: 3 }, { major: 11, minor: 2 }],
				},
				{
					$previousAction: { proposalTxHash: 'prior-fork', proposalIndex: 3 },
					hardForkMajor: 11,
					hardForkMinor: 2,
				},
			],
			[
				'treasury_withdrawals',
				{
					tag: 'TreasuryWithdrawals',
					contents: [[[{ network: 'Mainnet', credential: { keyHash: 'treasury-key' } }, 42]], 'treasury-policy'],
				},
				{
					policyHash: 'treasury-policy',
					treasuryWithdrawals: [{ recipientNetwork: 'Mainnet', recipientCredential: 'key:treasury-key', lovelace: 42n }],
				},
			],
			[
				'no_confidence',
				{
					tag: 'NoConfidence',
					contents: { txId: 'prior-confidence', govActionIx: 4 },
				},
				{
					$previousAction: { proposalTxHash: 'prior-confidence', proposalIndex: 4 },
				},
			],
			[
				'new_committee',
				{
					tag: 'UpdateCommittee',
					contents: [{ txId: 'prior-committee', govActionIx: 5 }, [{ scriptHash: 'removed-script' }], { 'added-cold': 777 }, { numerator: 2, denominator: 3 }],
				},
				{
					$previousAction: { proposalTxHash: 'prior-committee', proposalIndex: 5 },
					committeeRemovedCredentials: ['script:removed-script'],
					committeeAdditions: [{ credential: 'added-cold', expirationEpoch: 777 }],
					committeeQuorumNumerator: 2,
					committeeQuorumDenominator: 3,
				},
			],
			[
				'new_constitution',
				{
					tag: 'NewConstitution',
					contents: [{ txId: 'prior-constitution', govActionIx: 6 }, { anchor: { url: 'https://constitution.example', dataHash: 'constitution-hash' }, script: 'constitution-script' }],
				},
				{
					$previousAction: { proposalTxHash: 'prior-constitution', proposalIndex: 6 },
					constitutionAnchorUrl: 'https://constitution.example',
					constitutionAnchorHash: 'constitution-hash',
					constitutionScript: 'constitution-script',
				},
			],
			[
				'info_action',
				{ tag: 'InfoAction' },
				{},
			],
		] as const) {
			const proposalTxHash = `proposal-${governanceType}`
			getGovernanceProposal.mockResolvedValueOnce({
				id: `gov_action1${governanceType}`,
				tx_hash: proposalTxHash,
				cert_index: 0,
				governance_type: governanceType,
				governance_description: governanceDescription,
				deposit: '1000000',
				return_address: 'stake1return',
				ratified_epoch: null,
				enacted_epoch: null,
				dropped_epoch: null,
				expired_epoch: null,
				expiration: 600,
			})
			listGovernanceProposalVotes.mockResolvedValueOnce([])

			const proposal = await proposalResolver.resolve['NetworkProposalTxHashProposalIndex'].resolve({
				$network: cardanoNetwork,
				proposalTxHash,
				proposalIndex: 0,
			}, resolverContext)
			expect(proposal).toMatchObject(expected)
			expect(proposal).not.toHaveProperty('proposalPayload')
		}
	})

	it('preserves natural expiry and dropped lifecycle facts without inferring status', async () => {
		getGovernanceProposal
			.mockResolvedValueOnce({
				id: 'gov_action1expired',
				tx_hash: 'expired-proposal-hash',
				cert_index: 0,
				governance_type: 'info_action',
				governance_description: null,
				deposit: '1000000',
				return_address: 'stake1return',
				ratified_epoch: null,
				enacted_epoch: null,
				dropped_epoch: 594,
				expired_epoch: 593,
				expiration: 593,
			})
			.mockResolvedValueOnce({
				id: 'gov_action1dropped',
				tx_hash: 'dropped-proposal-hash',
				cert_index: 0,
				governance_type: 'parameter_change',
				governance_description: null,
				deposit: '1000000',
				return_address: 'stake1return',
				ratified_epoch: null,
				enacted_epoch: null,
				dropped_epoch: 592,
				expired_epoch: null,
				expiration: 600,
			})
		listGovernanceProposalVotes.mockResolvedValue([])
		const proposalResolver = blockfrostResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.CardanoGovernanceProposal
			&& '$$timestamps' in candidate.projections
		))

		if (proposalResolver == null)
			throw new Error('missing proposal lifecycle resolver')

		const expiredProposal = await proposalResolver.resolve['NetworkProposalTxHashProposalIndex'].resolve({
			$network: cardanoNetwork,
			proposalTxHash: 'expired-proposal-hash',
			proposalIndex: 0,
		}, resolverContext)
		expect(expiredProposal).toEqual(expect.objectContaining({
			$$timestamps: [expect.objectContaining({
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.CardanoGovernanceProposal_Timestamp, [], 'droppedEpoch')]: 594,
					[entityFieldAddressKey(EntityType.CardanoGovernanceProposal_Timestamp, [], 'expiredEpoch')]: 593,
				}),
			})],
		}))
		expect(expiredProposal.$$timestamps[0]).not.toHaveProperty('status')
		const droppedProposal = await proposalResolver.resolve['NetworkProposalTxHashProposalIndex'].resolve({
			$network: cardanoNetwork,
			proposalTxHash: 'dropped-proposal-hash',
			proposalIndex: 0,
		}, resolverContext)
		expect(droppedProposal).toEqual(expect.objectContaining({
			$$timestamps: [expect.objectContaining({
				[EntityMetaKey.Fields]: expect.objectContaining({
					[entityFieldAddressKey(EntityType.CardanoGovernanceProposal_Timestamp, [], 'droppedEpoch')]: 592,
				}),
			})],
		}))
		expect(droppedProposal.$$timestamps[0]).not.toHaveProperty('status')
	})

	it('rejects governance proposal detail for a different transaction occurrence', async () => {
		getGovernanceProposal.mockResolvedValueOnce({
			id: 'gov_action1wrong',
			tx_hash: 'different-proposal-hash',
			cert_index: 2,
			governance_type: 'info_action',
			governance_description: null,
			deposit: '1000000',
			return_address: 'stake1return',
			ratified_epoch: null,
			enacted_epoch: null,
			dropped_epoch: null,
			expired_epoch: null,
			expiration: 600,
		})
		listGovernanceProposalVotes.mockResolvedValueOnce([])
		const proposalResolver = blockfrostResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.CardanoGovernanceProposal
			&& '$$timestamps' in candidate.projections
		))
		if (proposalResolver == null)
			throw new Error('missing proposal lifecycle resolver')

		await expect(proposalResolver.resolve['NetworkProposalTxHashProposalIndex'].resolve({
			$network: cardanoNetwork,
			proposalTxHash: 'proposal-hash',
			proposalIndex: 1,
		}, resolverContext)).rejects.toThrow('governance proposal response does not match the subject')
	})

	it('preserves proposal detail and votes when optional metadata fails', async () => {
		getGovernanceProposal.mockResolvedValueOnce({
			id: 'gov_action1example',
			tx_hash: 'proposal-hash',
			cert_index: 1,
			governance_type: 'info_action',
			governance_description: null,
			deposit: '1000000',
			return_address: 'stake1return',
			ratified_epoch: null,
			enacted_epoch: null,
			dropped_epoch: null,
			expired_epoch: null,
			expiration: 600,
		})
		getGovernanceProposalMetadata.mockResolvedValueOnce(undefined)
		listGovernanceProposalVotes.mockResolvedValueOnce([
			{
				tx_hash: 'vote-hash',
				cert_index: 2,
				voter_role: 'drep',
				voter: 'drep1example',
				vote: 'yes',
			},
		])
		const proposalResolvers = blockfrostResolvers.resolvers.filter(({ entityType }) => entityType === EntityType.CardanoGovernanceProposal)
		const resolver = proposalResolvers.find((candidate) => '$$votes' in candidate.projections)
		const metadataResolver = proposalResolvers.find((candidate) => 'anchorUrl' in candidate.projections)

		if (resolver == null || metadataResolver == null)
			throw new Error('missing proposal resolver')

		await expect(resolver.resolve['NetworkProposalTxHashProposalIndex'].resolve(
			{
				$network: cardanoNetwork,
				proposalTxHash: 'proposal-hash',
				proposalIndex: 1,
			},
			resolverContext
		)).resolves.toMatchObject({
			proposalKind: 'info_action',
			$$votes: [
				expect.objectContaining({
					[EntityMetaKey.Selector]: expect.objectContaining({
						voterCredential: 'drep1example',
						voteTxHash: 'vote-hash',
					}),
					[EntityMetaKey.Fields]: expect.objectContaining({
						[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], '$transaction')]: {
							[EntityMetaKey.Selector]: {
								$network: cardanoNetwork,
								hash: 'vote-hash',
							},
						},
						[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], '$drep')]: {
							[EntityMetaKey.Selector]: {
								$network: cardanoNetwork,
								drepCredential: 'drep1example',
							},
						},
					}),
				}),
			],
		})
		await expect(metadataResolver.resolve['NetworkProposalTxHashProposalIndex'].resolve(
			{
				$network: cardanoNetwork,
				proposalTxHash: 'proposal-hash',
				proposalIndex: 1,
			},
			resolverContext
		)).rejects.toThrow('metadata transport unavailable')
	})

	it('links SPO votes to their transaction and stake pool', async () => {
		getGovernanceProposal.mockResolvedValueOnce({
			id: 'gov_action1example',
			tx_hash: 'proposal-hash',
			cert_index: 1,
			governance_type: 'info_action',
			governance_description: null,
			deposit: '1000000',
			return_address: 'stake1return',
			ratified_epoch: null,
			enacted_epoch: null,
			dropped_epoch: null,
			expired_epoch: null,
			expiration: 600,
		})
		listGovernanceProposalVotes.mockResolvedValueOnce([{
			tx_hash: 'spo-vote-hash',
			cert_index: 3,
			voter_role: 'spo',
			voter: 'pool1example',
			vote: 'no',
		}])
		const proposalResolver = blockfrostResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.CardanoGovernanceProposal
			&& '$$votes' in candidate.projections
		))

		if (proposalResolver == null)
			throw new Error('missing proposal vote resolver')

		const context = {
			...resolverContext,
			pagination: { limit: 1 },
			providerContinuationToken: 'after=previous-vote%3A0%3Adrep%3Adrep1previous&page=2',
		}
		const snapshot = await proposalResolver.resolve[
			'NetworkProposalTxHashProposalIndex'
		].resolve({
			$network: cardanoNetwork,
			proposalTxHash: 'proposal-hash',
			proposalIndex: 1,
		}, context)
		expect(snapshot).toMatchObject({
			$$votes: [{
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], '$transaction')]: {
						[EntityMetaKey.Selector]: {
							$network: cardanoNetwork,
							hash: 'spo-vote-hash',
						},
					},
					[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], '$stakePool')]: {
						[EntityMetaKey.Selector]: {
							$network: cardanoNetwork,
							poolId: 'pool1example',
						},
					},
				},
			}],
		})
		expect(listGovernanceProposalVotes).toHaveBeenCalledWith(
			'proposal-hash',
			1,
			1,
			2
		)
		if (
			typeof proposalResolver.projections.$$votes === 'function'
			|| proposalResolver.projections.$$votes.continuation == null
		)
			throw new Error('missing proposal vote continuation')
		expect(proposalResolver.projections.$$votes.continuation(
			snapshot,
			{
				$network: cardanoNetwork,
				proposalTxHash: 'proposal-hash',
				proposalIndex: 1,
			},
			context
		)).toEqual({
			operation: 'cardano-governance-proposal-votes',
			target: 'proposal-hash:1',
			terminal: false,
			token: 'after=spo-vote-hash%3A3%3Aspo%3Apool1example&page=3',
		})
		getGovernanceProposal.mockResolvedValueOnce({
			id: 'gov_action1example',
			tx_hash: 'proposal-hash',
			cert_index: 1,
			governance_type: 'info_action',
			governance_description: null,
			deposit: '1000000',
			return_address: 'stake1return',
			ratified_epoch: null,
			enacted_epoch: null,
			dropped_epoch: null,
			expired_epoch: null,
			expiration: 600,
		})
		listGovernanceProposalVotes.mockResolvedValueOnce([{
			tx_hash: 'spo-vote-hash',
			cert_index: 3,
			voter_role: 'spo',
			voter: 'pool1example',
			vote: 'no',
		}])
		await expect(proposalResolver.resolve[
			'NetworkProposalTxHashProposalIndex'
		].resolve({
			$network: cardanoNetwork,
			proposalTxHash: 'proposal-hash',
			proposalIndex: 1,
		}, {
			...resolverContext,
			providerContinuationToken: 'after=spo-vote-hash%3A3%3Aspo%3Apool1example&page=3',
		})).rejects.toThrow('governance proposal votes continuation did not advance')
	})

	it('rejects metadata for a different proposal occurrence', async () => {
		getGovernanceProposalMetadata.mockReset().mockResolvedValueOnce({
			id: 'gov_action1wrong',
			tx_hash: 'different-proposal-hash',
			cert_index: 2,
			url: 'https://example.com/wrong.json',
			hash: 'wrong-metadata-hash',
			json_metadata: null,
			bytes: '',
		})
		const metadataResolver = blockfrostResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.CardanoGovernanceProposal
			&& 'anchorUrl' in candidate.projections
		))

		if (metadataResolver == null)
			throw new Error('missing proposal metadata resolver')

		await expect(metadataResolver.resolve[
			'NetworkProposalTxHashProposalIndex'
		].resolve({
			$network: cardanoNetwork,
			proposalTxHash: 'proposal-hash',
			proposalIndex: 1,
		}, resolverContext)).rejects.toThrow('governance proposal metadata does not match the subject')
	})

	it('keeps missing pool metadata optional and rejects a wrong network', async () => {
		getStakePool.mockResolvedValueOnce({
			pool_id: 'pool1example',
			vrf_key: 'vrf-key',
		})
		getStakePoolMetadata.mockResolvedValueOnce({})
		const poolResolver = blockfrostResolvers.resolvers.find(({ entityType }) => entityType === EntityType.CardanoStakePool)
		const drepResolver = blockfrostResolvers.resolvers.find(({ entityType }) => entityType === EntityType.CardanoDRep)

		if (poolResolver == null || drepResolver == null)
			throw new Error('missing Cardano detail resolver')

		await expect(poolResolver.resolve['NetworkPoolId'].resolve(
			{
				$network: cardanoNetwork,
				poolId: 'pool1example',
			},
			resolverContext
		)).resolves.toMatchObject({
			vrf_key: 'vrf-key',
		})
		await expect(drepResolver.resolve['NetworkDrepCredential'].resolve(
			{
				$network: { slug: 'ethereum' },
				drepCredential: 'drep1example',
			},
			resolverContext
		)).rejects.toThrow('Blockfrost_Rest: unsupported network')
	})

	it('projects validated CIP-119 display identity on DRep detail', async () => {
		getDRepMetadata.mockResolvedValueOnce({
			url: 'https://example.com/drep.json',
			hash: 'metadata-hash',
			displayName: 'Example DRep',
		})
		const drepIdentityResolver = blockfrostResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.CardanoDRep
			&& 'displayName' in resolver.projections
		))

		if (drepIdentityResolver == null)
			throw new Error('missing Cardano DRep identity resolver')

		await expect(drepIdentityResolver.resolve['NetworkDrepCredential'].resolve(
			{
				$network: cardanoNetwork,
				drepCredential: 'drep1example',
			},
			resolverContext
		)).resolves.toEqual({
			displayName: 'Example DRep',
			anchorUrl: 'https://example.com/drep.json',
			anchorHash: 'metadata-hash',
		})
	})

	it('materializes DRep observations and continues native vote pages', async () => {
		getDRep.mockResolvedValueOnce({
			drep_id: 'drep1example',
			hex: 'ab',
			amount: '4200000000',
			active: true,
			active_epoch: 500,
			has_script: false,
			retired: false,
			expired: false,
			last_active_epoch: 500,
		})
		getLatestEpoch.mockResolvedValueOnce({
			epoch: 500,
		})
		listDRepVotes.mockResolvedValueOnce([{
			tx_hash: 'drep-vote-hash',
			cert_index: 2,
			proposal_tx_hash: 'proposal-hash',
			proposal_cert_index: 1,
			vote: 'yes',
		}])
		const drepResolver = blockfrostResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.CardanoDRep
			&& '$$timestamps' in resolver.projections
		))
		if (drepResolver == null)
			throw new Error('missing Cardano DRep observation resolver')

		const context = {
			...resolverContext,
			pagination: { limit: 1 },
			providerContinuationToken: 'after=previous-proposal%3A0%3Aprevious-vote&page=2',
		}
		const snapshot = await drepResolver.resolve['NetworkDrepCredential'].resolve(
			{
				$network: cardanoNetwork,
				drepCredential: 'drep1example',
			},
			context
		)
		expect(snapshot).toMatchObject({
			credentialKind: 'key',
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					epoch: 500,
					source: Source.Blockfrost_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoDRep_Timestamp, [], 'votingPowerLovelace')]: 4_200_000_000n,
					[entityFieldAddressKey(EntityType.CardanoDRep_Timestamp, [], 'active')]: true,
					[entityFieldAddressKey(EntityType.CardanoDRep_Timestamp, [], 'registered')]: true,
				},
			}],
			$$votes: [{
				[EntityMetaKey.Selector]: {
					$proposal: {
						$network: cardanoNetwork,
						proposalTxHash: 'proposal-hash',
						proposalIndex: 1,
					},
					voterKind: 'drep',
					voterCredential: 'drep1example',
					voteTxHash: 'drep-vote-hash',
					source: Source.Blockfrost_Rest,
				},
			}],
		})
		expect(listDRepVotes).toHaveBeenCalledWith('drep1example', 1, 2)
		if (
			typeof drepResolver.projections.$$votes === 'function'
			|| drepResolver.projections.$$votes.continuation == null
		)
			throw new Error('missing DRep vote continuation')
		expect(drepResolver.projections.$$votes.continuation(
			snapshot,
			{
				$network: cardanoNetwork,
				drepCredential: 'drep1example',
			},
			context
		)).toEqual({
			operation: 'cardano-drep-votes',
			target: 'drep1example',
			terminal: false,
			token: 'after=proposal-hash%3A1%3Adrep-vote-hash&page=3',
		})
	})

	it('materializes native asset fingerprints and current supply observations', async () => {
		const policyId = 'a'.repeat(56)
		const assetName = '746f6b656e'
		getAsset.mockResolvedValueOnce({
			asset: `${policyId}${assetName}`,
			policy_id: policyId,
			asset_name: assetName,
			fingerprint: 'asset1example',
			quantity: '12',
			initial_mint_tx_hash: 'mint-hash',
			mint_or_burn_count: 3,
			onchain_metadata: {
				name: 'Token',
			},
			metadata: null,
		})
		getLatestBlock.mockResolvedValueOnce(latestBlock)
		const assetResolver = blockfrostResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.CardanoNativeAsset
		))
		if (assetResolver == null)
			throw new Error('missing Cardano native asset resolver')

		await expect(assetResolver.resolve['NetworkPolicyIdAssetName'].resolve(
			{
				$network: cardanoNetwork,
				policyId,
				assetName,
			},
			resolverContext
		)).resolves.toEqual({
			fingerprint: 'asset1example',
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					$asset: {
						$network: cardanoNetwork,
						policyId,
						assetName,
					},
					slot: 130_000_000n,
					source: Source.Blockfrost_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoNativeAsset_Timestamp, [], 'timestampMs')]: 1_720_000_000_000,
					[entityFieldAddressKey(EntityType.CardanoNativeAsset_Timestamp, [], 'blockHash')]: 'block-hash',
					[entityFieldAddressKey(EntityType.CardanoNativeAsset_Timestamp, [], 'supply')]: 12n,
					[entityFieldAddressKey(EntityType.CardanoNativeAsset_Timestamp, [], 'transactionCount')]: 3,
					[entityFieldAddressKey(EntityType.CardanoNativeAsset_Timestamp, [], 'metadata')]: {
						name: 'Token',
					},
				},
			}],
		})
	})

	it('materializes stake credential reward address, delegation epoch, and addresses', async () => {
		getAccount.mockResolvedValueOnce({
			stake_address: 'stake1example',
			active: true,
			registered: true,
			active_epoch: 500,
			controlled_amount: '1000000',
			rewards_sum: '200',
			withdrawals_sum: '50',
			reserves_sum: '0',
			treasury_sum: '0',
			withdrawable_amount: '150',
			pool_id: 'pool1example',
			drep_id: 'drep1example',
		})
		getLatestEpoch.mockResolvedValueOnce({
			epoch: 500,
		})
		listAccountAddresses.mockResolvedValueOnce([
			{
				address: 'addr1a',
			},
			{
				address: 'addr1b',
			},
		])
		const stakeCredentialResolver = blockfrostResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.CardanoStakeCredential
			&& 'rewardAddress' in resolver.projections
		))
		const stakeCredentialAddressesResolver = blockfrostResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.CardanoStakeCredential
			&& '$$addresses' in resolver.projections
		))
		if (stakeCredentialResolver == null || stakeCredentialAddressesResolver == null)
			throw new Error('missing Cardano stake credential resolvers')

		await expect(stakeCredentialResolver.resolve['NetworkCredential'].resolve(
			{
				$network: cardanoNetwork,
				credential: 'stake1example',
			},
			resolverContext
		)).resolves.toMatchObject({
			rewardAddress: 'stake1example',
			$$delegationEpochs: [{
				[EntityMetaKey.Selector]: {
					epoch: 500,
					source: Source.Blockfrost_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoStakeDelegation_Epoch, [], 'activeStake')]: 1_000_000n,
					[entityFieldAddressKey(EntityType.CardanoStakeDelegation_Epoch, [], 'registered')]: true,
				},
			}],
		})
		const addressSnapshot = await stakeCredentialAddressesResolver.resolve['NetworkCredential'].resolve(
			{
				$network: cardanoNetwork,
				credential: 'stake1example',
			},
			{
				...resolverContext,
				pagination: {
					limit: 2,
				},
			}
		)
		const addressProjection = stakeCredentialAddressesResolver.projections.$$addresses
		if (
			typeof addressProjection === 'function'
			|| addressProjection.select == null
		)
			throw new Error('missing stake credential address projection')

		expect(addressProjection.select(
			addressSnapshot,
			{
				$network: cardanoNetwork,
				credential: 'stake1example',
			},
			resolverContext
		).map((row) => row[EntityMetaKey.Selector])).toEqual([
			{
				$network: cardanoNetwork,
				address: 'addr1a',
			},
			{
				$network: cardanoNetwork,
				address: 'addr1b',
			},
		])
	})

	it('materializes stake pool live observations for the current epoch', async () => {
		getStakePool.mockResolvedValueOnce({
			pool_id: 'pool1example',
			hex: 'ab',
			vrf_key: 'vrf-key',
			blocks_minted: 10,
			blocks_epoch: 1,
			live_stake: '5000000',
			live_size: 0.1,
			live_saturation: 0.2,
			live_delegators: 3,
			active_stake: '4000000',
			active_size: 0.09,
			declared_pledge: '1000000',
			live_pledge: '1000000',
			margin_cost: 0.05,
			fixed_cost: '340000000',
			reward_account: 'stake1reward',
			owners: [
				'stake1owner',
			],
			registration: [],
			retirement: [],
		})
		getLatestEpoch.mockResolvedValueOnce({
			epoch: 500,
		})
		const poolObservationResolver = blockfrostResolvers.resolvers.find((resolver) => (
			resolver.entityType === EntityType.CardanoStakePool
			&& '$$timestamps' in resolver.projections
		))
		if (poolObservationResolver == null)
			throw new Error('missing Cardano stake pool observation resolver')

		await expect(poolObservationResolver.resolve['NetworkPoolId'].resolve(
			{
				$network: cardanoNetwork,
				poolId: 'pool1example',
			},
			resolverContext
		)).resolves.toMatchObject({
			$$timestamps: [{
				[EntityMetaKey.Selector]: {
					epoch: 500,
					source: Source.Blockfrost_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'liveStake')]: 5_000_000n,
					[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'retired')]: false,
				},
			}],
		})
	})
})

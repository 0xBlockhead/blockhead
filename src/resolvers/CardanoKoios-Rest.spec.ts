import {
	beforeEach,
	describe,
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
import type {
	CardanoKoiosStakePool,
	CardanoKoiosTransactionInfo,
} from '$/sources/CardanoKoios/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const getTransactionInfo = vi.fn()
const getCommittee = vi.fn()
const getLatestProtocolParameters = vi.fn()
const getTip = vi.fn()
const listAssets = vi.fn()
const listBlocks = vi.fn()
const listDReps = vi.fn()
const listGovernanceProposals = vi.fn()
const listStakePools = vi.fn()

vi.mock('$/sources/CardanoKoios/Rest/queries.ts', () => ({
	getCommittee,
	getLatestProtocolParameters,
	getTip,
	getTransactionInfo,
	listAssets,
	listBlocks,
	listDReps,
	listGovernanceProposals,
	listStakePools,
}))

const { default: cardanoKoiosResolvers } = await import('$/resolvers/CardanoKoios-Rest.ts')

const cardanoTransactionRelationshipResolver = cardanoKoiosResolvers.resolvers.find((
	resolver
): resolver is Extract<
	typeof cardanoKoiosResolvers.resolvers[number],
	{ entityType: EntityType.CardanoTransaction }
> => resolver.entityType === EntityType.CardanoTransaction)

if (cardanoTransactionRelationshipResolver == null)
	throw new Error('CardanoKoios-Rest spec missing CardanoTransaction relationship resolver')

const cardanoGovernanceProposalResolver = cardanoKoiosResolvers.resolvers.find((
	resolver
): resolver is Extract<
	typeof cardanoKoiosResolvers.resolvers[number],
	{ entityType: EntityType.CardanoGovernanceProposal }
> => resolver.entityType === EntityType.CardanoGovernanceProposal)

if (cardanoGovernanceProposalResolver == null)
	throw new Error('CardanoKoios-Rest spec missing CardanoGovernanceProposal resolver')

const resolverContext = {
	filters: [],
	sorts: [],
	pagination: {},
	selectorKeys: [],
	parentSelectorKeys: [],
	sources: [],
	publicEnv: {},
}
const cardanoTransaction = {
	$network: {
		slug: networkBySlug.cardano.slug,
	},
	hash: 'transaction-hash',
}
const cardanoNetwork = {
	caip2: networkBySlug.cardano.caip2,
}
const transactionInfo = {
	tx_hash: cardanoTransaction.hash,
	epoch_no: 500,
	absolute_slot: 130_000_000,
	tx_timestamp: 1_700_000_000,
	tx_size: 512,
	fee: '170000',
	deposit: '2000000',
	invalid_before: '100',
	invalid_after: '200',
	certificates: [
		{
			info: {
				pool_id_bech32: 'pool1example',
			},
			type: 'pool_update',
			index: 3,
		},
	],
	native_scripts: [
		{
			script_hash: 'native-script-hash',
			type: 'timelock',
			script: {
				type: 'all',
			},
		},
	],
	plutus_contracts: [
		{
			script_hash: 'plutus-script-hash',
			input: {
				datum: {
					constructor: 0,
				},
				redeemer: {
					fee: '100',
					unit: {
						mem: '200',
						steps: '300',
					},
					datum: {
						constructor: 1,
					},
					purpose: 'spend',
				},
			},
		},
		{
			script_hash: 'plutus-script-hash',
			input: {
				datum: null,
				redeemer: {
					fee: '110',
					unit: {
						mem: '210',
						steps: '310',
					},
					datum: {
						constructor: 2,
					},
					purpose: 'mint',
				},
			},
		},
	],
	voting_procedures: [
		{
			vote: 'Yes',
			voter: 'drep1example',
			voter_hex: 'drep-credential',
			voter_role: 'DRep',
			proposal_index: 5,
			proposal_tx_hash: 'proposal-transaction-hash',
		},
	],
	proposal_procedures: [
		{
			type: 'TreasuryWithdrawals',
			index: 2,
			deposit: '100000000000',
			meta_url: 'ipfs://proposal',
			meta_hash: 'proposal-metadata-hash',
			description: {
				tag: 'TreasuryWithdrawals',
				contents: [
					[[
						{
							network: 'Mainnet',
							credential: {
								keyHash: 'treasury-key',
							},
						},
						42,
					]],
					'treasury-policy',
				],
			},
			return_address: 'stake1return',
		},
	],
} satisfies CardanoKoiosTransactionInfo

describe('Cardano Koios transaction relationships', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('materializes all four decoded relationship collections with stable identities', async () => {
		getTransactionInfo.mockResolvedValueOnce(transactionInfo)

		const snapshot = await cardanoTransactionRelationshipResolver.resolve[
			'NetworkHash'
		].resolve(
			cardanoTransaction,
			resolverContext
		)

		expect(cardanoTransactionRelationshipResolver.projections.blockSlot(snapshot)).toBe(130_000_000n)
		expect(cardanoTransactionRelationshipResolver.projections.fee(snapshot)).toBe(170_000n)
		expect(cardanoTransactionRelationshipResolver.projections.deposit(snapshot)).toBe(2_000_000n)
		expect(cardanoTransactionRelationshipResolver.projections.sizeBytes(snapshot)).toBe(512)
		expect(cardanoTransactionRelationshipResolver.projections.validityStartSlot(snapshot)).toBe(100n)
		expect(cardanoTransactionRelationshipResolver.projections.ttlSlot(snapshot)).toBe(200n)
		expect(cardanoTransactionRelationshipResolver.projections.$$certificates(snapshot)).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$transaction: cardanoTransaction,
					certificateIndex: 3,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoCertificate, [], 'certificateKind')]: 'pool_update',
					[entityFieldAddressKey(EntityType.CardanoCertificate, [], 'payload')]: {
						pool_id_bech32: 'pool1example',
					},
				},
			},
		])
		expect(cardanoTransactionRelationshipResolver.projections.$$scripts(snapshot).map((script) => ({
			selector: script[EntityMetaKey.Selector],
			kind: script[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.CardanoScriptWitness, [], 'scriptKind')],
			hash: script[EntityMetaKey.Fields][entityFieldAddressKey(EntityType.CardanoScriptWitness, [], 'scriptHash')],
		}))).toEqual([
			{
				selector: {
					$transaction: cardanoTransaction,
					witnessIndex: 0,
				},
				kind: 'timelock',
				hash: 'native-script-hash',
			},
			{
				selector: {
					$transaction: cardanoTransaction,
					witnessIndex: 1,
				},
				kind: 'plutus',
				hash: 'plutus-script-hash',
			},
			{
				selector: {
					$transaction: cardanoTransaction,
					witnessIndex: 2,
				},
				kind: 'plutus',
				hash: 'plutus-script-hash',
			},
		])
		expect(cardanoTransactionRelationshipResolver.projections.$$governanceProposals(snapshot)).toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					$network: cardanoTransaction.$network,
					proposalTxHash: cardanoTransaction.hash,
					proposalIndex: 2,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'proposalKind')]: 'TreasuryWithdrawals',
					[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], '$transaction')]: {
						[EntityMetaKey.Selector]: cardanoTransaction,
					},
					[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'depositLovelace')]: 100_000_000_000n,
				},
			},
		])
		expect(cardanoTransactionRelationshipResolver.projections.$$governanceVotes(snapshot)).toMatchObject([
			{
				[EntityMetaKey.Selector]: {
					$proposal: {
						$network: cardanoTransaction.$network,
						proposalTxHash: 'proposal-transaction-hash',
						proposalIndex: 5,
					},
					voterKind: 'DRep',
					voterCredential: 'drep1example',
					voteTxHash: cardanoTransaction.hash,
					source: Source.CardanoKoios_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], 'vote')]: 'Yes',
					[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], '$transaction')]: {
						[EntityMetaKey.Selector]: cardanoTransaction,
					},
					[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], '$drep')]: {
						[EntityMetaKey.Selector]: {
							$network: cardanoTransaction.$network,
							drepCredential: 'drep1example',
						},
					},
					[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], 'epoch')]: 500,
					[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], 'slot')]: 130_000_000n,
					[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], 'timestampMs')]: 1_700_000_000_000,
				},
			},
		])
	})

	it('resolves all four collections as empty from an authoritative empty snapshot', async () => {
		getTransactionInfo.mockResolvedValueOnce({
			...transactionInfo,
			certificates: [],
			native_scripts: [],
			plutus_contracts: [],
			voting_procedures: [],
			proposal_procedures: [],
		})

		const snapshot = await cardanoTransactionRelationshipResolver.resolve[
			'NetworkHash'
		].resolve(
			cardanoTransaction,
			resolverContext
		)

		expect(cardanoTransactionRelationshipResolver.projections.$$certificates(snapshot)).toEqual([])
		expect(cardanoTransactionRelationshipResolver.projections.$$scripts(snapshot)).toEqual([])
		expect(cardanoTransactionRelationshipResolver.projections.$$governanceProposals(snapshot)).toEqual([])
		expect(cardanoTransactionRelationshipResolver.projections.$$governanceVotes(snapshot)).toEqual([])
	})

	it('rejects unsupported networks before transport and mismatched subjects after transport', async () => {
		await expect(cardanoTransactionRelationshipResolver.resolve[
			'NetworkHash'
		].resolve(
			{
				$network: {
					caip2: networkBySlug.ethereum.caip2,
				},
				hash: cardanoTransaction.hash,
			},
			resolverContext
		)).rejects.toThrow('CardanoKoios_Rest: unsupported network')
		expect(getTransactionInfo).not.toHaveBeenCalled()

		getTransactionInfo.mockResolvedValueOnce({
			...transactionInfo,
			tx_hash: 'different-transaction-hash',
		})
		await expect(cardanoTransactionRelationshipResolver.resolve[
			'NetworkHash'
		].resolve(
			cardanoTransaction,
			resolverContext
		)).rejects.toThrow('CardanoKoios_Rest: transaction response does not match the subject')
	})
})

describe('Cardano Koios governance proposal detail', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('selects the addressed proposal procedure and maps only transaction-backed detail fields', async () => {
		getTransactionInfo.mockResolvedValueOnce({
			...transactionInfo,
			proposal_procedures: [
				{
					...transactionInfo.proposal_procedures[0],
					index: 1,
					type: 'InfoAction',
				},
				transactionInfo.proposal_procedures[0],
			],
		})
		const proposal = {
			$network: cardanoNetwork,
			proposalTxHash: cardanoTransaction.hash,
			proposalIndex: 2,
		}

		await expect(cardanoGovernanceProposalResolver.resolve[
			'NetworkProposalTxHashProposalIndex'
		].resolve(
			proposal,
			resolverContext
		)).resolves.toEqual({
			proposalKind: 'TreasuryWithdrawals',
			$transaction: {
				$network: cardanoNetwork,
				hash: cardanoTransaction.hash,
			},
			depositLovelace: 100_000_000_000n,
			returnAddress: 'stake1return',
			anchorUrl: 'ipfs://proposal',
			anchorHash: 'proposal-metadata-hash',
			policyHash: 'treasury-policy',
			treasuryWithdrawals: [{
				recipientNetwork: 'Mainnet',
				recipientCredential: 'key:treasury-key',
				lovelace: 42n,
			}],
		})
		expect(getTransactionInfo).toHaveBeenCalledWith(
			cardanoTransaction.hash
		)
		expect(cardanoGovernanceProposalResolver.projections).not.toHaveProperty('governanceActionId')
		expect(cardanoGovernanceProposalResolver.projections).not.toHaveProperty('$$timestamps')
		expect(cardanoGovernanceProposalResolver.projections).not.toHaveProperty('$$votes')
	})

	it('rejects unsupported networks and responses that do not own the exact proposal identity', async () => {
		await expect(cardanoGovernanceProposalResolver.resolve[
			'NetworkProposalTxHashProposalIndex'
		].resolve(
			{
				$network: {
					caip2: networkBySlug.ethereum.caip2,
				},
				proposalTxHash: cardanoTransaction.hash,
				proposalIndex: 2,
			},
			resolverContext
		)).rejects.toThrow('CardanoKoios_Rest: unsupported network')
		expect(getTransactionInfo).not.toHaveBeenCalled()

		getTransactionInfo.mockResolvedValueOnce({
			...transactionInfo,
			tx_hash: 'different-transaction-hash',
		})
		await expect(cardanoGovernanceProposalResolver.resolve[
			'NetworkProposalTxHashProposalIndex'
		].resolve(
			{
				$network: cardanoNetwork,
				proposalTxHash: cardanoTransaction.hash,
				proposalIndex: 2,
			},
			resolverContext
		)).rejects.toThrow('transaction response does not match the proposal subject')

		getTransactionInfo.mockResolvedValueOnce({
			...transactionInfo,
			proposal_procedures: [{
				...transactionInfo.proposal_procedures[0],
				index: 1,
			}],
		})
		await expect(cardanoGovernanceProposalResolver.resolve[
			'NetworkProposalTxHashProposalIndex'
		].resolve(
			{
				$network: cardanoNetwork,
				proposalTxHash: cardanoTransaction.hash,
				proposalIndex: 2,
			},
			resolverContext
		)).rejects.toThrow('proposal response does not match the subject')

		getTransactionInfo.mockResolvedValueOnce({
			...transactionInfo,
			proposal_procedures: [
				transactionInfo.proposal_procedures[0],
				transactionInfo.proposal_procedures[0],
			],
		})
		await expect(cardanoGovernanceProposalResolver.resolve[
			'NetworkProposalTxHashProposalIndex'
		].resolve(
			{
				$network: cardanoNetwork,
				proposalTxHash: cardanoTransaction.hash,
				proposalIndex: 2,
			},
			resolverContext
		)).rejects.toThrow('proposal response does not match the subject')
	})
})

describe('Cardano Koios network relationships', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('resolves Cardano network fields from both public route selectors', () => {
		for (const resolver of cardanoKoiosResolvers.resolvers.filter(({ entityType }) => (
			entityType === EntityType.Network
		))) {
			expect(resolver.resolve).toHaveProperty('Slug')
			expect(resolver.resolve).toHaveProperty('Caip2')
		}
	})

	it('continues governance proposals by exact Koios offset and rejects non-progressing pages', async () => {
		listGovernanceProposals.mockResolvedValueOnce([{
			proposal_tx_hash: 'proposal-hash',
			proposal_index: 0,
			proposal_type: 'InfoAction',
		}])
		const resolver = cardanoKoiosResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Cardano' in candidate.projections
			&& '$$governanceProposals' in candidate.projections.Cardano
		))
		if (
			resolver == null
			|| typeof resolver.projections.Cardano.$$governanceProposals === 'function'
			|| resolver.projections.Cardano.$$governanceProposals.continuation == null
		)
			throw new Error('CardanoKoios-Rest spec missing governance proposal continuation')
		const context = {
			...resolverContext,
			pagination: { limit: 1 },
			providerContinuationToken: 'after=previous-hash%3A0&offset=1',
		}
		const snapshot = await resolver.resolve['Caip2'].resolve(
			cardanoNetwork,
			context
		)
		expect(listGovernanceProposals).toHaveBeenCalledWith(
			1,
			1
		)
		expect(listDReps).not.toHaveBeenCalled()
		expect(listAssets).not.toHaveBeenCalled()
		expect(resolver.projections.Cardano.$$governanceProposals.continuation(
			snapshot,
			cardanoNetwork,
			context
		)).toEqual({
			operation: 'cardano-governance-proposals',
			target: networkBySlug.cardano.slug,
			terminal: false,
			token: 'after=proposal-hash%3A0&offset=2',
		})

		await expect(resolver.resolve['Caip2'].resolve(
			cardanoNetwork,
			{
				...resolverContext,
				providerContinuationToken: 'not-an-offset',
			}
		)).rejects.toThrow('invalid governance proposals continuation')
		listGovernanceProposals.mockResolvedValueOnce([{
			proposal_tx_hash: 'proposal-hash',
			proposal_index: 0,
			proposal_type: 'InfoAction',
		}])
		await expect(resolver.resolve['Caip2'].resolve(
			cardanoNetwork,
			{
				...resolverContext,
				providerContinuationToken: 'after=proposal-hash%3A0&offset=1',
			}
		)).rejects.toThrow('governance proposals continuation did not advance')
		listGovernanceProposals.mockResolvedValueOnce([
			{
				proposal_tx_hash: 'duplicate-hash',
				proposal_index: 0,
				proposal_type: 'InfoAction',
			},
			{
				proposal_tx_hash: 'duplicate-hash',
				proposal_index: 0,
				proposal_type: 'InfoAction',
			},
		])
		await expect(resolver.resolve['Caip2'].resolve(
			cardanoNetwork,
			resolverContext
		)).rejects.toThrow('governance proposals page contains duplicate identities')
	})

	it('isolates every independently rendered Network.Cardano collection snapshot', () => {
		const collectionFieldNames = [
			'$$timestamps',
			'$$blocks',
			'$$transactions',
			'$$stakePools',
			'$$dReps',
			'$$governanceProposals',
			'$$assets',
			'$$protocolParameterEpochs',
			'$$committeeEpochs',
		]
		const networkResolvers = cardanoKoiosResolvers.resolvers.filter((resolver) => (
			resolver.entityType === EntityType.Network
			&& 'Cardano' in resolver.projections
		))

		for (const collectionFieldName of collectionFieldNames) {
			const owners = networkResolvers.filter((resolver) => (
				collectionFieldName in resolver.projections.Cardano
			))
			expect(owners).toHaveLength(1)
			expect(Object.keys(owners[0].projections.Cardano)).toEqual([collectionFieldName])
		}
	})

	it('keeps unrelated collections resolvable when one Koios endpoint fails', async () => {
		const dRepResolver = cardanoKoiosResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Cardano' in candidate.projections
			&& '$$dReps' in candidate.projections.Cardano
		))
		const assetResolver = cardanoKoiosResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Cardano' in candidate.projections
			&& '$$assets' in candidate.projections.Cardano
		))
		const protocolParametersResolver = cardanoKoiosResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Cardano' in candidate.projections
			&& '$$protocolParameterEpochs' in candidate.projections.Cardano
		))
		const committeeResolver = cardanoKoiosResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Cardano' in candidate.projections
			&& '$$committeeEpochs' in candidate.projections.Cardano
		))
		if (
			dRepResolver == null
			|| assetResolver == null
			|| protocolParametersResolver == null
			|| committeeResolver == null
		)
			throw new Error('CardanoKoios-Rest spec missing isolated Network.Cardano collection resolvers')

		listAssets.mockRejectedValueOnce(new Error('asset endpoint unavailable'))
		listDReps.mockResolvedValueOnce([{
			drep_id: 'drep1example',
			has_script: false,
		}])
		await expect(assetResolver.resolve['Caip2'].resolve(
			cardanoNetwork,
			resolverContext
		)).rejects.toThrow('asset endpoint unavailable')
		await expect(dRepResolver.resolve['Caip2'].resolve(
			cardanoNetwork,
			resolverContext
		)).resolves.toMatchObject([{
			[EntityMetaKey.Selector]: {
				drepCredential: 'drep1example',
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.CardanoDRep, [], 'credentialKind')]: 'key',
			},
		}])
		expect(listGovernanceProposals).not.toHaveBeenCalled()

		getLatestProtocolParameters.mockRejectedValueOnce(new Error('protocol parameters unavailable'))
		getCommittee.mockResolvedValueOnce([{
			quorum_numerator: 2,
			quorum_denominator: 3,
			members: [],
		}])
		getTip.mockResolvedValueOnce([{
			epoch_no: 500,
		}])
		await expect(protocolParametersResolver.resolve['Caip2'].resolve(
			cardanoNetwork,
			resolverContext
		)).rejects.toThrow('protocol parameters unavailable')
		await expect(committeeResolver.resolve['Caip2'].resolve(
			cardanoNetwork,
			resolverContext
		)).resolves.toMatchObject({
			committee: {
				quorum_numerator: 2,
			},
			tip: {
				epoch_no: 500,
			},
		})
	})

	it('embeds stake-pool ticker identity from the list snapshot', async () => {
		const stakePools = [
			{
				pool_id_bech32: 'pool1example',
				ticker: 'EXAMPLE',
			},
			{
				pool_id_bech32: 'pool1null',
				ticker: null,
			},
			{
				pool_id_bech32: 'pool1absent',
			},
		] satisfies CardanoKoiosStakePool[]
		listStakePools.mockResolvedValueOnce(stakePools)
		const resolver = cardanoKoiosResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Cardano' in candidate.projections
			&& '$$stakePools' in candidate.projections.Cardano
		))

		if (resolver == null)
			throw new Error('CardanoKoios-Rest spec missing Network.Cardano.$$stakePools resolver')

		const snapshot = await resolver.resolve['Caip2'].resolve(
			cardanoNetwork,
			resolverContext
		)

		expect(snapshot).toEqual([
			{
				[EntityMetaKey.Selector]: {
					$network: cardanoNetwork,
					poolId: 'pool1example',
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoStakePool, [], 'ticker')]: 'EXAMPLE',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: cardanoNetwork,
					poolId: 'pool1null',
				},
			},
			{
				[EntityMetaKey.Selector]: {
					$network: cardanoNetwork,
					poolId: 'pool1absent',
				},
			},
		])
		expect(resolver.projections.Cardano.$$stakePools(snapshot)).toBe(snapshot)
	})

	it('projects tip leftovers from the newest block page and protocol-parameter leftovers', async () => {
		const timestampsResolver = cardanoKoiosResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Cardano' in candidate.projections
			&& '$$timestamps' in candidate.projections.Cardano
		))
		const blocksResolver = cardanoKoiosResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Cardano' in candidate.projections
			&& '$$blocks' in candidate.projections.Cardano
		))
		const protocolParametersResolver = cardanoKoiosResolvers.resolvers.find((candidate) => (
			candidate.entityType === EntityType.Network
			&& 'Cardano' in candidate.projections
			&& '$$protocolParameterEpochs' in candidate.projections.Cardano
		))
		if (
			timestampsResolver == null
			|| blocksResolver == null
			|| protocolParametersResolver == null
		)
			throw new Error('CardanoKoios-Rest spec missing tip/block/protocol leftover resolvers')

		listBlocks
			.mockResolvedValueOnce([{
				hash: 'tip-block-hash',
				epoch_no: 500,
				era: 'Conway',
				abs_slot: 130_000_102,
				block_height: 102,
				block_time: 1_700_000_102,
				tx_count: 7,
				vrf_key: 'vrf_vk1example',
			}])
			.mockResolvedValueOnce([{
				hash: 'tip-block-hash',
				epoch_no: 500,
				era: 'Conway',
				abs_slot: 130_000_102,
				block_height: 102,
				block_time: 1_700_000_102,
				tx_count: 7,
				vrf_key: 'vrf_vk1example',
			}])
		getLatestProtocolParameters.mockResolvedValueOnce([{
			epoch_no: 500,
			min_fee_a: 44,
			min_fee_b: 155_381,
			max_block_size: 90_112,
			max_tx_size: 16_384,
			max_bh_size: 1_100,
			key_deposit: '2000000',
			pool_deposit: '500000000',
			max_epoch: 18,
			optimal_pool_count: 500,
			monetary_expand_rate: 0.003,
			treasury_growth_rate: 0.2,
			decentralisation: 0,
			protocol_major: 9,
			protocol_minor: 0,
			min_pool_cost: '170000000',
			coins_per_utxo_size: '4310',
			cost_models: {
				PlutusV3: [1, 2, 3],
			},
			price_mem: 0.0577,
			price_step: 7.21e-5,
			max_tx_ex_mem: 14_000_000,
			max_tx_ex_steps: 10_000_000_000,
			max_block_ex_mem: 62_000_000,
			max_block_ex_steps: 20_000_000_000,
			max_val_size: 5_000,
			collateral_percent: 150,
			max_collateral_inputs: 3,
		}])

		await expect(timestampsResolver.resolve['Caip2'].resolve(
			cardanoNetwork,
			resolverContext
		)).resolves.toMatchObject([{
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockTransactionCount')]: 7,
				[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockHash')]: 'tip-block-hash',
			},
		}])
		await expect(blocksResolver.resolve['Caip2'].resolve(
			cardanoNetwork,
			resolverContext
		)).resolves.toMatchObject([{
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.CardanoBlock, [], 'issuerVkey')]: 'vrf_vk1example',
				[entityFieldAddressKey(EntityType.CardanoBlock, [], 'era')]: 'Conway',
			},
		}])
		const protocolSnapshot = await protocolParametersResolver.resolve['Caip2'].resolve(
			cardanoNetwork,
			resolverContext
		)
		expect(
			protocolParametersResolver.projections.Cardano.$$protocolParameterEpochs(protocolSnapshot)
		).toMatchObject([{
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'costModels')]: {
					PlutusV3: [1, 2, 3],
				},
				[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'executionPrices')]: {
					memory: 0.0577,
					steps: 7.21e-5,
				},
				[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxValueSize')]: 5_000,
				[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'collateralPercentage')]: 150,
				[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxCollateralInputs')]: 3,
			},
		}])
	})
})

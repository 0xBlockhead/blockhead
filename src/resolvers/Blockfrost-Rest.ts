import { networkBySlug } from '$/constants/Network.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { CardanoBlockSelector } from '$/schema/CardanoBlock.ts'
import { CardanoCommittee_EpochSelector } from '$/schema/CardanoCommittee_Epoch.ts'
import { CardanoDRepSelector } from '$/schema/CardanoDRep.ts'
import { CardanoGovernanceProposalSelector } from '$/schema/CardanoGovernanceProposal.ts'
import { CardanoGovernanceProposal_TimestampSelector } from '$/schema/CardanoGovernanceProposal_Timestamp.ts'
import { CardanoNetwork_TimestampSelector } from '$/schema/CardanoNetwork_Timestamp.ts'
import { CardanoStakePoolSelector } from '$/schema/CardanoStakePool.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { Source } from '$/sources/Source.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import type { BlockfrostBlock } from '$/sources/Blockfrost/Rest/types.ts'

const blockfrostBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.Blockfrost_Rest)

if (blockfrostBinding == null)
	throw new Error('Blockfrost_Rest: source binding is missing')

const assertCardanoMainnet = (
	network: EntitySelector<typeof schema, EntityType.Network>
) => {
	if (
		!(
			'slug' in network
			&& network.slug === networkBySlug.cardano.slug
		)
		&& !(
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.cardano.caip2.namespace
			&& network.caip2.reference === networkBySlug.cardano.caip2.reference
		)
	)
		throw new Error('Blockfrost_Rest: unsupported network')
}

const blockFields = (
	block: BlockfrostBlock
) => {
	if (block.slot == null || block.height == null)
		throw new Error('Blockfrost_Rest: block is missing its Cardano ledger coordinates')
	if (
		!Number.isSafeInteger(block.slot)
		|| block.slot < 0
		|| !Number.isSafeInteger(block.height)
		|| block.height < 0
		|| (
			block.epoch != null
			&& (!Number.isSafeInteger(block.epoch) || block.epoch < 0)
		)
	)
		throw new Error('Blockfrost_Rest: block has invalid Cardano ledger coordinates')

	return {
		hash: block.hash,
		slot: BigInt(block.slot),
		blockNo: BigInt(block.height),
		epoch: block.epoch ?? undefined,
	}
}

const networkObservation = async () => {
	const {
		getHealth,
		getLatestBlock,
		getLatestEpoch,
		getNetwork,
	} = await import('$/sources/Blockfrost/Rest/queries.ts')
	const [
		block,
		epoch,
		network,
		health,
	] = await Promise.all([
		getLatestBlock(blockfrostBinding),
		getLatestEpoch(blockfrostBinding),
		getNetwork(blockfrostBinding),
		getHealth(blockfrostBinding),
	])
	const timestampMs = block.time * 1_000
	if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
		throw new Error('Blockfrost_Rest: block has an invalid snapshot clock')

	return {
		timestampMs,
		latestSlot: block.slot == null ? undefined : BigInt(block.slot),
		latestBlockNo: block.height == null ? undefined : BigInt(block.height),
		latestBlockHash: block.hash,
		latestBlockTimeMs: timestampMs,
		latestBlockTransactionCount: block.tx_count,
		epoch: epoch.epoch,
		epochBlockCount: epoch.block_count,
		epochTransactionCount: epoch.tx_count,
		circulatingSupplyLovelace: BigInt(network.supply.circulating),
		totalSupplyLovelace: BigInt(network.supply.total),
		liveStakeLovelace: BigInt(network.stake.live),
		activeStakeLovelace: BigInt(network.stake.active),
		backendHealthy: health.is_healthy,
	}
}

const committeeEpoch = async (
	network: EntitySelector<typeof schema, EntityType.Network>,
	limit: number
) => {
	const {
		getCommittee,
		getLatestEpoch,
		listCommitteeVotes,
	} = await import('$/sources/Blockfrost/Rest/queries.ts')
	const [
		committee,
		epoch,
		votes,
	] = await Promise.all([
		getCommittee(blockfrostBinding),
		getLatestEpoch(blockfrostBinding),
		listCommitteeVotes(blockfrostBinding, limit),
	])

	return {
		[EntityMetaKey.Selector]: {
			$network: network,
			epoch: epoch.epoch,
			source: Source.Blockfrost_Rest,
		},
		epoch: epoch.epoch,
		source: Source.Blockfrost_Rest,
		govActionId: committee.gov_action_id ?? undefined,
		$seatingProposal: committee.proposal_tx_hash == null || committee.proposal_index == null ? undefined : {
			$network: network,
			proposalTxHash: committee.proposal_tx_hash,
			proposalIndex: committee.proposal_index,
		},
		dissolved: committee.is_dissolved,
		quorumNumerator: committee.quorum.numerator,
		quorumDenominator: committee.quorum.denominator,
		memberCount: committee.members.length,
		members: committee.members,
		$$votes: votes.map((vote) => ({
			$proposal: {
				$network: network,
				proposalTxHash: vote.proposal_tx_hash,
				proposalIndex: vote.proposal_index,
			},
			voterKind: 'constitutional-committee',
			voterCredential: vote.voter_hot_id,
			source: Source.Blockfrost_Rest,
			vote: vote.vote,
			voteTxHash: vote.tx_hash,
			anchorUrl: vote.metadata_url ?? undefined,
			anchorHash: vote.metadata_hash ?? undefined,
			timestampMs: vote.block_time * 1_000,
		})),
	}
}

export default {
	source: Source.Blockfrost_Rest,

	resolvers: [
		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network) => {
						assertCardanoMainnet(network)

						return [
							{
								url: firstHttpUrlForBinding(blockfrostBinding),
								transportType: TransportType.Http,
								providerName: 'Blockfrost',
							},
						]
					},
					},
				},
		})({
			Cardano: {
				restEndpoints: (restEndpoints) => restEndpoints,
			},
		}),

		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network) => {
						assertCardanoMainnet(network)
						const observation = await networkObservation()

						return [
							{
								[EntityMetaKey.Selector]: {
									$network: network,
									timestampMs: observation.timestampMs,
									source: Source.Blockfrost_Rest,
								},
								...observation,
							},
						]
					},
				}
			},
		})({
			Cardano: {
				$$timestamps: (timestamps) => timestamps.map((timestamp) => ({
					[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'timestampMs')]: timestamp.timestampMs,
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestSlot')]: timestamp.latestSlot,
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockNo')]: timestamp.latestBlockNo,
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockHash')]: timestamp.latestBlockHash,
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockTimeMs')]: timestamp.latestBlockTimeMs,
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockTransactionCount')]: timestamp.latestBlockTransactionCount,
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'epoch')]: timestamp.epoch,
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'epochBlockCount')]: timestamp.epochBlockCount,
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'epochTransactionCount')]: timestamp.epochTransactionCount,
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'circulatingSupplyLovelace')]: timestamp.circulatingSupplyLovelace,
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'totalSupplyLovelace')]: timestamp.totalSupplyLovelace,
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'liveStakeLovelace')]: timestamp.liveStakeLovelace,
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'activeStakeLovelace')]: timestamp.activeStakeLovelace,
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'backendHealthy')]: timestamp.backendHealthy,
					},
				})),
			},
		}),

		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network, context) => {
						assertCardanoMainnet(network)
						const { listBlocks } = await import('$/sources/Blockfrost/Rest/queries.ts')

						return (await listBlocks(
							blockfrostBinding,
							Math.min(resolverContextRowLimit(context), 100)
						)).map((block) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								hash: block.hash,
							},
							...blockFields(block),
						}))
					},
				}
			},
		})({
			Cardano: {
				$$blocks: (blocks) => blocks.map((block) => ({
					[EntityMetaKey.Selector]: block[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoBlock, [], 'hash')]: block.hash,
						[entityFieldAddressKey(EntityType.CardanoBlock, [], 'slot')]: block.slot,
						[entityFieldAddressKey(EntityType.CardanoBlock, [], 'blockNo')]: block.blockNo,
						[entityFieldAddressKey(EntityType.CardanoBlock, [], 'epoch')]: block.epoch,
					},
				})),
			},
		}),

		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network, context) => {
						assertCardanoMainnet(network)
						const { listLatestBlockTransactions } = await import('$/sources/Blockfrost/Rest/queries.ts')

						return (await listLatestBlockTransactions(
							blockfrostBinding,
							Math.min(resolverContextRowLimit(context), 100)
						)).map((hash) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								hash,
							},
							hash,
						}))
					},
				}
			},
		})({
			Cardano: {
				$$transactions: (transactions) => transactions.map((transaction) => ({
					[EntityMetaKey.Selector]: transaction[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoTransaction, [], 'hash')]: transaction.hash,
					},
				})),
			},
		}),

		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network, context) => {
						assertCardanoMainnet(network)
						const { listStakePools } = await import('$/sources/Blockfrost/Rest/queries.ts')

						return (await listStakePools(
							blockfrostBinding,
							Math.min(resolverContextRowLimit(context), 100)
						)).map((poolId) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								poolId,
							},
							poolId,
						}))
					},
				}
			},
		})({
			Cardano: {
				$$stakePools: (stakePools) => stakePools.map((stakePool) => ({
					[EntityMetaKey.Selector]: stakePool[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoStakePool, [], 'poolId')]: stakePool.poolId,
					},
				})),
			},
		}),

		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network, context) => {
						assertCardanoMainnet(network)
						const { listDReps } = await import('$/sources/Blockfrost/Rest/queries.ts')

						return (await listDReps(
							blockfrostBinding,
							Math.min(resolverContextRowLimit(context), 100)
						)).map((dRep) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								drepCredential: dRep.drep_id,
							},
							drepCredential: dRep.drep_id,
							credentialKind: dRep.has_script ? 'script' : 'key',
						}))
					},
				}
			},
		})({
			Cardano: {
				$$dReps: (dReps) => dReps.map((dRep) => ({
					[EntityMetaKey.Selector]: dRep[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoDRep, [], 'drepCredential')]: dRep.drepCredential,
						[entityFieldAddressKey(EntityType.CardanoDRep, [], 'credentialKind')]: dRep.credentialKind,
					},
				})),
			},
		}),

		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network, context) => {
						assertCardanoMainnet(network)
						const { listGovernanceProposals } = await import('$/sources/Blockfrost/Rest/queries.ts')

						return (await listGovernanceProposals(
							blockfrostBinding,
							Math.min(resolverContextRowLimit(context), 100)
						)).map((proposal) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								proposalTxHash: proposal.tx_hash,
								proposalIndex: proposal.cert_index,
							},
							proposalTxHash: proposal.tx_hash,
							proposalIndex: proposal.cert_index,
							proposalKind: proposal.governance_type,
						}))
					},
				}
			},
		})({
			Cardano: {
				$$governanceProposals: (proposals) => proposals.map((proposal) => ({
					[EntityMetaKey.Selector]: proposal[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'proposalTxHash')]: proposal.proposalTxHash,
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'proposalIndex')]: proposal.proposalIndex,
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'proposalKind')]: proposal.proposalKind,
					},
				})),
			},
		}),

		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network, context) => {
						assertCardanoMainnet(network)
						const { listAssets } = await import('$/sources/Blockfrost/Rest/queries.ts')

						return (await listAssets(
							blockfrostBinding,
							Math.min(resolverContextRowLimit(context), 100)
						)).map(({ asset }) => {
							if (asset.length < 56 || asset.length % 2 !== 0 || !/^[0-9a-f]+$/u.test(asset))
								throw new Error('Blockfrost_Rest: asset identifier is malformed')

							return {
								[EntityMetaKey.Selector]: {
									$network: network,
									policyId: asset.slice(0, 56),
									assetName: asset.slice(56),
								},
								policyId: asset.slice(0, 56),
								assetName: asset.slice(56),
							}
						})
					},
				}
			},
		})({
			Cardano: {
				$$assets: (assets) => assets.map((asset) => ({
					[EntityMetaKey.Selector]: asset[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoNativeAsset, [], 'policyId')]: asset.policyId,
						[entityFieldAddressKey(EntityType.CardanoNativeAsset, [], 'assetName')]: asset.assetName,
					},
				})),
			},
		}),

		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network) => {
						assertCardanoMainnet(network)
						const { getLatestProtocolParameters } = await import('$/sources/Blockfrost/Rest/queries.ts')
						const parameters = await getLatestProtocolParameters(blockfrostBinding)

						if (
							parameters.max_val_size != null
							&& !Number.isSafeInteger(Number(parameters.max_val_size))
						)
							throw new Error('Blockfrost_Rest: protocol parameter max value size is malformed')

						return [
							{
								[EntityMetaKey.Selector]: {
									$network: network,
									epoch: parameters.epoch,
									source: Source.Blockfrost_Rest,
								},
								epoch: parameters.epoch,
								source: Source.Blockfrost_Rest,
								minFeeA: BigInt(parameters.min_fee_a),
								minFeeB: BigInt(parameters.min_fee_b),
								maxBlockBodySize: parameters.max_block_size,
								maxTxSize: parameters.max_tx_size,
								maxBlockHeaderSize: parameters.max_block_header_size,
								keyDeposit: BigInt(parameters.key_deposit),
								poolDeposit: BigInt(parameters.pool_deposit),
								maxEpoch: parameters.e_max,
								nOpt: parameters.n_opt,
								rho: parameters.rho.toString(),
								tau: parameters.tau.toString(),
								decentralisation: parameters.decentralisation_param.toString(),
								protocolMajor: parameters.protocol_major_ver,
								protocolMinor: parameters.protocol_minor_ver,
								minPoolCost: BigInt(parameters.min_pool_cost),
								coinsPerUtxoByte: parameters.coins_per_utxo_size == null
									? undefined
									: BigInt(parameters.coins_per_utxo_size),
								costModels: parameters.cost_models_raw ?? parameters.cost_models ?? undefined,
								executionPrices: parameters.price_mem == null && parameters.price_step == null
									? undefined
									: {
										memory: parameters.price_mem,
										steps: parameters.price_step,
									},
								maxTxExUnits: parameters.max_tx_ex_mem == null && parameters.max_tx_ex_steps == null
									? undefined
									: {
										memory: parameters.max_tx_ex_mem,
										steps: parameters.max_tx_ex_steps,
									},
								maxBlockExUnits: parameters.max_block_ex_mem == null && parameters.max_block_ex_steps == null
									? undefined
									: {
										memory: parameters.max_block_ex_mem,
										steps: parameters.max_block_ex_steps,
									},
								maxValueSize: parameters.max_val_size == null
									? undefined
									: Number(parameters.max_val_size),
								collateralPercentage: parameters.collateral_percent ?? undefined,
								maxCollateralInputs: parameters.max_collateral_inputs ?? undefined,
							},
						]
					},
				}
			},
		})({
			Cardano: {
				$$protocolParameterEpochs: (parameterEpochs) => parameterEpochs.map((parameters) => ({
					[EntityMetaKey.Selector]: parameters[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'epoch')]: parameters.epoch,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'source')]: parameters.source,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'minFeeA')]: parameters.minFeeA,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'minFeeB')]: parameters.minFeeB,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxBlockBodySize')]: parameters.maxBlockBodySize,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxTxSize')]: parameters.maxTxSize,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxBlockHeaderSize')]: parameters.maxBlockHeaderSize,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'keyDeposit')]: parameters.keyDeposit,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'poolDeposit')]: parameters.poolDeposit,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxEpoch')]: parameters.maxEpoch,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'nOpt')]: parameters.nOpt,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'rho')]: parameters.rho,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'tau')]: parameters.tau,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'decentralisation')]: parameters.decentralisation,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'protocolMajor')]: parameters.protocolMajor,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'protocolMinor')]: parameters.protocolMinor,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'minPoolCost')]: parameters.minPoolCost,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'coinsPerUtxoByte')]: parameters.coinsPerUtxoByte,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'costModels')]: parameters.costModels,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'executionPrices')]: parameters.executionPrices,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxTxExUnits')]: parameters.maxTxExUnits,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxBlockExUnits')]: parameters.maxBlockExUnits,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxValueSize')]: parameters.maxValueSize,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'collateralPercentage')]: parameters.collateralPercentage,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxCollateralInputs')]: parameters.maxCollateralInputs,
					},
				})),
			},
		}),

		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network, context) => {
						assertCardanoMainnet(network)

						return [
							await committeeEpoch(
								network,
								Math.min(resolverContextRowLimit(context), 100)
							),
						]
					},
				}
			},
		})({
			Cardano: {
				$$committeeEpochs: (committeeEpochs) => committeeEpochs.map((committee) => ({
					[EntityMetaKey.Selector]: committee[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'epoch')]: committee.epoch,
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'source')]: committee.source,
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'govActionId')]: committee.govActionId,
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], '$seatingProposal')]: committee.$seatingProposal,
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'dissolved')]: committee.dissolved,
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'quorumNumerator')]: committee.quorumNumerator,
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'quorumDenominator')]: committee.quorumDenominator,
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'memberCount')]: committee.memberCount,
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'members')]: committee.members,
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], '$$votes')]: committee.$$votes,
					},
				})),
			},
		}),

		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.CardanoCommittee_Epoch,
			resolve: {
				[CardanoCommittee_EpochSelector.NetworkEpochSource]: {
					resolve: async ({
						$network,
						epoch,
						source,
					}, context) => {
						assertCardanoMainnet($network)
						if (source !== Source.Blockfrost_Rest)
							throw new Error('Blockfrost_Rest: observation source mismatch')

						const currentCommitteeEpoch = await committeeEpoch(
							$network,
							Math.min(resolverContextRowLimit(context), 100)
						)
						if (currentCommitteeEpoch.epoch !== epoch)
							throw new Error('Blockfrost_Rest: historical committee epoch is unavailable')

						return currentCommitteeEpoch
					},
				},
			},
		})({
			epoch: (committee) => committee.epoch,
			source: (committee) => committee.source,
			govActionId: (committee) => committee.govActionId,
			$seatingProposal: (committee) => committee.$seatingProposal,
			dissolved: (committee) => committee.dissolved,
			quorumNumerator: (committee) => committee.quorumNumerator,
			quorumDenominator: (committee) => committee.quorumDenominator,
			memberCount: (committee) => committee.memberCount,
			members: (committee) => committee.members,
			$$votes: (committee) => committee.$$votes,
		}),

		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.CardanoGovernanceProposal,
			resolve: {
				[CardanoGovernanceProposalSelector.NetworkProposalTxHashProposalIndex]: {
					resolve: async ({
						$network,
						proposalTxHash,
						proposalIndex,
					}, context) => {
						assertCardanoMainnet($network)
						const {
							getGovernanceProposal,
							getLatestEpoch,
							listGovernanceProposalVotes,
						} = await import('$/sources/Blockfrost/Rest/queries.ts')
						const [
							proposal,
							epoch,
							votes,
						] = await Promise.all([
							getGovernanceProposal(blockfrostBinding, proposalTxHash, proposalIndex),
							getLatestEpoch(blockfrostBinding),
							listGovernanceProposalVotes(blockfrostBinding, proposalTxHash, proposalIndex, Math.min(resolverContextRowLimit(context), 100)),
						])

						return {
							proposalKind: proposal.governance_type,
							$transaction: {
								$network,
								hash: proposal.tx_hash,
							},
							depositLovelace: BigInt(proposal.deposit),
							returnAddress: proposal.return_address,
							$$timestamps: [{
								$proposal: {
									$network,
									proposalTxHash,
									proposalIndex,
								},
								epoch: epoch.epoch,
								source: Source.Blockfrost_Rest,
								ratifiedEpoch: proposal.ratified_epoch ?? undefined,
								enactedEpoch: proposal.enacted_epoch ?? undefined,
								droppedEpoch: proposal.dropped_epoch ?? undefined,
								expiredEpoch: proposal.expired_epoch ?? undefined,
								expirationEpoch: proposal.expiration,
							}],
							$$votes: votes.map((vote) => ({
								$proposal: {
									$network,
									proposalTxHash,
									proposalIndex,
								},
								voterKind: vote.voter_role,
								voterCredential: vote.voter,
								source: Source.Blockfrost_Rest,
								vote: vote.vote,
								voteTxHash: vote.tx_hash,
								voteIndex: vote.cert_index,
							})),
						}
					},
				}
			},
		})({
			proposalKind: (proposal) => proposal.proposalKind,
			$transaction: (proposal) => proposal.$transaction,
			depositLovelace: (proposal) => proposal.depositLovelace,
			returnAddress: (proposal) => proposal.returnAddress,
			$$timestamps: (proposal) => proposal.$$timestamps,
			$$votes: (proposal) => proposal.$$votes,
		}),

		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.CardanoGovernanceProposal,
			resolve: {
				[CardanoGovernanceProposalSelector.NetworkProposalTxHashProposalIndex]: {
					resolve: async ({
						$network,
						proposalTxHash,
						proposalIndex,
					}) => {
						assertCardanoMainnet($network)
						const { getGovernanceProposalMetadata } = await import('$/sources/Blockfrost/Rest/queries.ts')
						const metadata = await getGovernanceProposalMetadata(blockfrostBinding, proposalTxHash, proposalIndex)
						return {
							anchorUrl: metadata?.url,
							anchorHash: metadata?.hash,
						}
					},
				},
			},
		})({
			anchorUrl: (proposal) => proposal.anchorUrl,
			anchorHash: (proposal) => proposal.anchorHash,
		}),

		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.CardanoGovernanceProposal_Timestamp,
			resolve: {
				[CardanoGovernanceProposal_TimestampSelector.ProposalEpochSource]: {
					resolve: async ({ $proposal, source }) => {
						assertCardanoMainnet($proposal.$network)
						if (source !== Source.Blockfrost_Rest)
							throw new Error('Blockfrost_Rest: observation source mismatch')

						throw new Error('Blockfrost_Rest: historical proposal observation is unavailable')
					},
				},
			},
		})({
			epoch: (observation) => observation.epoch,
			source: (observation) => observation.source,
			ratifiedEpoch: (observation) => observation.ratifiedEpoch,
			enactedEpoch: (observation) => observation.enactedEpoch,
			droppedEpoch: (observation) => observation.droppedEpoch,
			expiredEpoch: (observation) => observation.expiredEpoch,
			expirationEpoch: (observation) => observation.expirationEpoch,
		}),

		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.CardanoDRep,
			resolve: {
				[CardanoDRepSelector.NetworkDrepCredential]: {
					resolve: async ({ $network, drepCredential }, context) => {
						assertCardanoMainnet($network)
						const {
							getDRep,
							listDRepVotes,
						} = await import('$/sources/Blockfrost/Rest/queries.ts')
						const [
							drep,
							votes,
						] = await Promise.all([
							getDRep(blockfrostBinding, drepCredential),
							listDRepVotes(blockfrostBinding, drepCredential, Math.min(resolverContextRowLimit(context), 100)),
						])
						return {
							credentialKind: drep.has_script ? 'script' : 'key',
							$$votes: votes.map((vote) => ({
								$proposal: {
									$network,
									proposalTxHash: vote.proposal_tx_hash,
									proposalIndex: vote.proposal_cert_index,
								},
								voterKind: 'drep',
								voterCredential: drepCredential,
								source: Source.Blockfrost_Rest,
								vote: vote.vote,
								$drep: {
									$network,
									drepCredential,
								},
								voteTxHash: vote.tx_hash,
								voteIndex: vote.cert_index,
							})),
						}
					},
				}
			},
		})({
			credentialKind: (drep) => drep.credentialKind,
			$$votes: (drep) => drep.$$votes,
		}),

		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.CardanoDRep,
			resolve: {
				[CardanoDRepSelector.NetworkDrepCredential]: {
					resolve: async ({ $network, drepCredential }) => {
						assertCardanoMainnet($network)
						const { getDRepMetadata } = await import('$/sources/Blockfrost/Rest/queries.ts')
						const metadata = await getDRepMetadata(blockfrostBinding, drepCredential)
						return {
							anchorUrl: metadata?.url,
							anchorHash: metadata?.hash,
						}
					},
				},
			},
		})({
			anchorUrl: (drep) => drep.anchorUrl,
			anchorHash: (drep) => drep.anchorHash,
		}),

		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.CardanoStakePool,
			resolve: {
				[CardanoStakePoolSelector.NetworkPoolId]: {
					resolve: async ({ $network, poolId }) => {
						assertCardanoMainnet($network)
						const {
							getStakePool,
						} = await import('$/sources/Blockfrost/Rest/queries.ts')
						const pool = await getStakePool(blockfrostBinding, poolId)

						return pool
					},
				}
			},
		})({
			vrfKeyHash: (pool) => pool.vrf_key,
		}),

		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.CardanoStakePool,
			resolve: {
				[CardanoStakePoolSelector.NetworkPoolId]: {
					resolve: async ({ $network, poolId }) => {
						assertCardanoMainnet($network)
						const { getStakePoolMetadata } = await import('$/sources/Blockfrost/Rest/queries.ts')
						const metadata = await getStakePoolMetadata(blockfrostBinding, poolId)
						return {
							name: metadata?.name,
							ticker: metadata?.ticker,
							description: metadata?.description,
							homepage: metadata?.homepage,
						}
					},
				},
			},
		})({
			name: (pool) => pool.name ?? undefined,
			ticker: (pool) => pool.ticker ?? undefined,
			description: (pool) => pool.description ?? undefined,
			homepage: (pool) => pool.homepage ?? undefined,
		}),

		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.CardanoNetwork_Timestamp,
			resolve: {
				[CardanoNetwork_TimestampSelector.NetworkTimestampMsSource]: {
					resolve: async ({
						$network,
						timestampMs,
						source,
					}) => {
						assertCardanoMainnet($network)
						if (source !== Source.Blockfrost_Rest)
							throw new Error('Blockfrost_Rest: observation source mismatch')

						const observation = await networkObservation()
						if (observation.timestampMs !== timestampMs)
							throw new Error('Blockfrost_Rest: historical observation is unavailable')

						return observation
					},
				}
			},
		})({
			latestSlot: (observation) => observation.latestSlot,
			latestBlockNo: (observation) => observation.latestBlockNo,
			latestBlockHash: (observation) => observation.latestBlockHash,
			latestBlockTimeMs: (observation) => observation.latestBlockTimeMs,
			latestBlockTransactionCount: (observation) => observation.latestBlockTransactionCount,
			epoch: (observation) => observation.epoch,
			epochBlockCount: (observation) => observation.epochBlockCount,
			epochTransactionCount: (observation) => observation.epochTransactionCount,
			circulatingSupplyLovelace: (observation) => observation.circulatingSupplyLovelace,
			totalSupplyLovelace: (observation) => observation.totalSupplyLovelace,
			liveStakeLovelace: (observation) => observation.liveStakeLovelace,
			activeStakeLovelace: (observation) => observation.activeStakeLovelace,
			backendHealthy: (observation) => observation.backendHealthy,
		}),

		defineResolver(Source.Blockfrost_Rest, {
			entityType: EntityType.CardanoBlock,
			resolve: {
				[CardanoBlockSelector.NetworkHash]: {
					resolve: async ({ $network, hash }) => {
						assertCardanoMainnet($network)
						const { getBlock } = await import('$/sources/Blockfrost/Rest/queries.ts')
						const block = blockFields(await getBlock(blockfrostBinding, hash))
						if (block.hash !== hash)
							throw new Error('Blockfrost_Rest: block hash does not match the requested selector')

						return block
					},
				},
				[CardanoBlockSelector.NetworkSlot]: {
					resolve: async ({ $network, slot }) => {
						assertCardanoMainnet($network)
						const { getBlock } = await import('$/sources/Blockfrost/Rest/queries.ts')
						const block = blockFields(await getBlock(blockfrostBinding, slot.toString()))
						if (block.slot !== slot)
							throw new Error('Blockfrost_Rest: block slot does not match the requested selector')

						return block
					},
				},
				[CardanoBlockSelector.NetworkBlockNo]: {
					resolve: async ({ $network, blockNo }) => {
						assertCardanoMainnet($network)
						const { getBlock } = await import('$/sources/Blockfrost/Rest/queries.ts')
						const block = blockFields(await getBlock(blockfrostBinding, blockNo.toString()))
						if (block.blockNo !== blockNo)
							throw new Error('Blockfrost_Rest: block number does not match the requested selector')

						return block
					},
				},
			},
		})({
			hash: (block) => block.hash,
			slot: (block) => block.slot,
			blockNo: (block) => block.blockNo,
			epoch: (block) => block.epoch,
		}),
	],
}

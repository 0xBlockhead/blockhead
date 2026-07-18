import { networkBySlug } from '$/constants/Network.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import { Source } from '$/sources/Source.ts'

const cardanoKoiosBinding = sourceProviderDefinitions
	.flatMap((provider) => provider.bindings)
	.find((binding) => binding.source === Source.CardanoKoios_Rest)

if (cardanoKoiosBinding == null)
	throw new Error('CardanoKoios_Rest: source binding is missing')

const assertCardanoMainnet = (
	network: EntitySelector<typeof schema, EntityType.Network>
) => {
	if (
		!(
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.cardano.caip2.namespace
			&& network.caip2.reference === networkBySlug.cardano.caip2.reference
		)
	)
		throw new Error('CardanoKoios_Rest: unsupported network')
}

const listLimit = (context: Parameters<typeof resolverContextRowLimit>[0]) => (
	Math.min(resolverContextRowLimit(context), 100)
)

export default {
	source: Source.CardanoKoios_Rest,

	resolvers: [
		defineResolver(Source.CardanoKoios_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network) => {
						assertCardanoMainnet(network)

						return [{
							url: firstHttpUrlForBinding(cardanoKoiosBinding),
							transportType: TransportType.Http,
							providerName: 'Koios',
						}]
					},
				}
			},
		})({
			Cardano: {
				restEndpoints: (restEndpoints) => restEndpoints,
			},
		}),

		defineResolver(Source.CardanoKoios_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network) => {
						assertCardanoMainnet(network)
						const { getTip } = await import('$/sources/CardanoKoios/Rest/queries.ts')
						const [tip] = await getTip(cardanoKoiosBinding)

						return [{
							[EntityMetaKey.Selector]: {
								$network: network,
								timestampMs: tip.block_time * 1_000,
								source: Source.CardanoKoios_Rest,
							},
							timestampMs: tip.block_time * 1_000,
							latestSlot: BigInt(tip.abs_slot),
							latestBlockNo: BigInt(tip.block_height),
							latestBlockHash: tip.hash,
							latestBlockTimeMs: tip.block_time * 1_000,
							epoch: tip.epoch_no,
						}]
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
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'epoch')]: timestamp.epoch,
					},
				})),
			},
		}),

		defineResolver(Source.CardanoKoios_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network, context) => {
						assertCardanoMainnet(network)
						const { listBlocks } = await import('$/sources/CardanoKoios/Rest/queries.ts')

						return (await listBlocks(cardanoKoiosBinding, listLimit(context))).map((block) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								hash: block.hash,
							},
							hash: block.hash,
							slot: BigInt(block.abs_slot),
							blockNo: BigInt(block.block_height),
							epoch: block.epoch_no,
							era: block.era,
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
						[entityFieldAddressKey(EntityType.CardanoBlock, [], 'era')]: block.era,
					},
				})),
			},
		}),

		defineResolver(Source.CardanoKoios_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network, context) => {
						assertCardanoMainnet(network)
						const { listLatestBlockTransactions } = await import('$/sources/CardanoKoios/Rest/queries.ts')

						return (await listLatestBlockTransactions(cardanoKoiosBinding, listLimit(context))).map(({ tx_hash }) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								hash: tx_hash,
							},
							hash: tx_hash,
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

		defineResolver(Source.CardanoKoios_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network, context) => {
						assertCardanoMainnet(network)
						const { listStakePools } = await import('$/sources/CardanoKoios/Rest/queries.ts')

						return (await listStakePools(cardanoKoiosBinding, listLimit(context))).map(({ pool_id_bech32 }) => ({
							[EntityMetaKey.Selector]: {
								$network: network,
								poolId: pool_id_bech32,
							},
							poolId: pool_id_bech32,
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

		defineResolver(Source.CardanoKoios_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network, context) => {
						assertCardanoMainnet(network)
						const {
							listAssets,
							listDReps,
							listGovernanceProposals,
						} = await import('$/sources/CardanoKoios/Rest/queries.ts')
						const [
							dReps,
							proposals,
							assets,
						] = await Promise.all([
							listDReps(cardanoKoiosBinding, listLimit(context)),
							listGovernanceProposals(cardanoKoiosBinding, listLimit(context)),
							listAssets(cardanoKoiosBinding, listLimit(context)),
						])

						return {
							network,
							dReps,
							proposals,
							assets,
						}
					},
				}
			},
		})({
			Cardano: {
				$$dReps: ({ network, dReps }) => dReps.map((dRep) => ({
					[EntityMetaKey.Selector]: {
						$network: network,
						drepCredential: dRep.drep_id,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoDRep, [], 'drepCredential')]: dRep.drep_id,
						[entityFieldAddressKey(EntityType.CardanoDRep, [], 'credentialKind')]: dRep.has_script ? 'script' : 'key',
					},
				})),
				$$governanceProposals: ({ network, proposals }) => proposals.map((proposal) => ({
					[EntityMetaKey.Selector]: {
						$network: network,
						proposalTxHash: proposal.proposal_tx_hash,
						proposalIndex: proposal.proposal_index,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'proposalTxHash')]: proposal.proposal_tx_hash,
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'proposalIndex')]: proposal.proposal_index,
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'proposalKind')]: proposal.proposal_type,
					},
				})),
				$$assets: ({ network, assets }) => assets.map((asset) => ({
					[EntityMetaKey.Selector]: {
						$network: network,
						policyId: asset.policy_id,
						assetName: asset.asset_name,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoNativeAsset, [], 'policyId')]: asset.policy_id,
						[entityFieldAddressKey(EntityType.CardanoNativeAsset, [], 'assetName')]: asset.asset_name,
					},
				})),
			},
		}),

		defineResolver(Source.CardanoKoios_Rest, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: {
					resolve: async (network) => {
						assertCardanoMainnet(network)
						const {
							getCommittee,
							getLatestProtocolParameters,
							getTip,
						} = await import('$/sources/CardanoKoios/Rest/queries.ts')
						const [
							[parameters],
							[committee],
							[tip],
						] = await Promise.all([
							getLatestProtocolParameters(cardanoKoiosBinding),
							getCommittee(cardanoKoiosBinding),
							getTip(cardanoKoiosBinding),
						])

						return {
							network,
							parameters,
							committee,
							tip,
						}
					},
				}
			},
		})({
			Cardano: {
				$$protocolParameterEpochs: ({ network, parameters }) => [{
					[EntityMetaKey.Selector]: {
						$network: network,
						epoch: parameters.epoch_no,
						source: Source.CardanoKoios_Rest,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'epoch')]: parameters.epoch_no,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'source')]: Source.CardanoKoios_Rest,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'minFeeA')]: BigInt(parameters.min_fee_a),
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'minFeeB')]: BigInt(parameters.min_fee_b),
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxBlockBodySize')]: parameters.max_block_size,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxTxSize')]: parameters.max_tx_size,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxBlockHeaderSize')]: parameters.max_bh_size,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'keyDeposit')]: BigInt(parameters.key_deposit),
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'poolDeposit')]: BigInt(parameters.pool_deposit),
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxEpoch')]: parameters.max_epoch,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'nOpt')]: parameters.optimal_pool_count,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'rho')]: parameters.monetary_expand_rate.toString(),
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'tau')]: parameters.treasury_growth_rate.toString(),
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'decentralisation')]: parameters.decentralisation.toString(),
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'protocolMajor')]: parameters.protocol_major,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'protocolMinor')]: parameters.protocol_minor,
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'minPoolCost')]: BigInt(parameters.min_pool_cost),
						[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'coinsPerUtxoByte')]: BigInt(parameters.coins_per_utxo_size),
					},
				}],
				$$committeeEpochs: ({ network, committee, tip }) => [{
					[EntityMetaKey.Selector]: {
						$network: network,
						epoch: tip.epoch_no,
						source: Source.CardanoKoios_Rest,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'epoch')]: tip.epoch_no,
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'source')]: Source.CardanoKoios_Rest,
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'quorumNumerator')]: committee.quorum_numerator,
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'quorumDenominator')]: committee.quorum_denominator,
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'memberCount')]: committee.members.length,
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'members')]: committee.members,
					},
				}],
			},
		}),
	],
}

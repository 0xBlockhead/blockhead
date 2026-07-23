import { networkBySlug } from '$/constants/Network.ts'
import { TransportType } from '$/constants/TransportType.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import { defineResolver, type SourceResolverContext } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { CardanoGovernanceProposalSelector } from '$/schema/CardanoGovernanceProposal.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { CardanoTransactionSelector } from '$/schema/CardanoTransaction.ts'
import { sourceProviderDefinitions } from '$/sources/$sourceProviders.ts'
import { firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import type { CardanoKoiosTransactionProposalProcedure } from '$/sources/CardanoKoios/Rest/types.ts'
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
			'slug' in network
			&& network.slug === networkBySlug.cardano.slug
		)
		&& !(
			'caip2' in network
			&& network.caip2.namespace === networkBySlug.cardano.caip2.namespace
			&& network.caip2.reference === networkBySlug.cardano.caip2.reference
		)
	)
		throw new Error('CardanoKoios_Rest: unsupported network')
}

const cardanoNetworkSelectors = <const _Snapshot extends object>(
	resolve: (
		network: EntitySelector<typeof schema, EntityType.Network>,
		context: SourceResolverContext<Source.CardanoKoios_Rest>
	) => Promise<_Snapshot>
) => ({
	[NetworkSelector.Slug]: { resolve },
	[NetworkSelector.Caip2]: { resolve },
})

const listLimit = (context: Parameters<typeof resolverContextRowLimit>[0]) => (
	Math.min(resolverContextRowLimit(context), 100)
)

const cardanoGovernanceProposalSnapshot = (
	network: EntitySelector<typeof schema, EntityType.Network>,
	transactionHash: string,
	proposal: CardanoKoiosTransactionProposalProcedure
) => ({
	proposalKind: proposal.type,
	$transaction: {
		$network: network,
		hash: transactionHash,
	},
	depositLovelace: BigInt(proposal.deposit),
	returnAddress: proposal.return_address,
	anchorUrl: proposal.meta_url ?? undefined,
	anchorHash: proposal.meta_hash ?? undefined,
	proposalPayload: proposal.description,
})

export default {
	source: Source.CardanoKoios_Rest,

	resolvers: [
		defineResolver(Source.CardanoKoios_Rest, {
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network) => {
				assertCardanoMainnet(network)

				return [{
					url: firstHttpUrlForBinding(cardanoKoiosBinding),
					transportType: TransportType.Http,
					providerName: 'Koios',
				}]
			}
			),
		})({
			Cardano: {
				restEndpoints: (restEndpoints) => restEndpoints,
			},
		}),

		defineResolver(Source.CardanoKoios_Rest, {
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network) => {
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
			}
			),
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
			resolve: cardanoNetworkSelectors(
				async (network, context) => {
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
			}
			),
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
			resolve: cardanoNetworkSelectors(
				async (network, context) => {
				assertCardanoMainnet(network)
				const { listLatestBlockTransactions } = await import('$/sources/CardanoKoios/Rest/queries.ts')

				return (await listLatestBlockTransactions(cardanoKoiosBinding, listLimit(context))).map(({ tx_hash }) => ({
					[EntityMetaKey.Selector]: {
						$network: network,
						hash: tx_hash,
					},
					hash: tx_hash,
				}))
			}
			),
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
			resolve: cardanoNetworkSelectors(
				async (network, context) => {
				assertCardanoMainnet(network)
				const { listStakePools } = await import('$/sources/CardanoKoios/Rest/queries.ts')

				return (await listStakePools(cardanoKoiosBinding, listLimit(context))).map(({
					pool_id_bech32,
					ticker,
				}) => ({
					[EntityMetaKey.Selector]: {
						$network: network,
						poolId: pool_id_bech32,
					},
					poolId: pool_id_bech32,
					...(ticker != null && { ticker }),
				}))
			}
			),
		})({
			Cardano: {
				$$stakePools: (stakePools) => stakePools.map((stakePool) => ({
					[EntityMetaKey.Selector]: stakePool[EntityMetaKey.Selector],
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoStakePool, [], 'poolId')]: stakePool.poolId,
						...(stakePool.ticker != null && {
							[entityFieldAddressKey(EntityType.CardanoStakePool, [], 'ticker')]: stakePool.ticker,
						}),
					},
				})),
			},
		}),

		defineResolver(Source.CardanoKoios_Rest, {
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network, context) => {
					assertCardanoMainnet(network)
					const { listDReps } = await import('$/sources/CardanoKoios/Rest/queries.ts')

					return {
						network,
						dReps: await listDReps(cardanoKoiosBinding, listLimit(context)),
					}
				}
			),
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
			},
		}),

		defineResolver(Source.CardanoKoios_Rest, {
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network, context) => {
					assertCardanoMainnet(network)
					const continuationParameters = context.providerContinuationToken == null ?
						undefined
					:
						new URLSearchParams(context.providerContinuationToken)
					const proposalOffset = continuationParameters == null ?
						0
					:
						Number(continuationParameters.get('offset'))
					const previousLastIdentity = continuationParameters?.get('after') ?? undefined
					if (
						!Number.isSafeInteger(proposalOffset)
						|| proposalOffset < 0
						|| (
							continuationParameters != null
							&& (
								proposalOffset < 1
								|| previousLastIdentity == null
								|| previousLastIdentity.length === 0
								|| continuationParameters.getAll('offset').length !== 1
								|| continuationParameters.getAll('after').length !== 1
								|| [...continuationParameters.keys()].some((key) => (
									key !== 'offset' && key !== 'after'
								))
							)
						)
					)
						throw new Error('CardanoKoios_Rest: invalid governance proposals continuation')
					const proposalLimit = listLimit(context)
					const { listGovernanceProposals } = await import('$/sources/CardanoKoios/Rest/queries.ts')
					const proposals = await listGovernanceProposals(
						cardanoKoiosBinding,
						proposalLimit,
						proposalOffset
					)
					if (new Set(proposals.map(({ proposal_tx_hash, proposal_index }) => (
						`${proposal_tx_hash}:${proposal_index.toString()}`
					))).size !== proposals.length)
						throw new Error('CardanoKoios_Rest: governance proposals page contains duplicate identities')
					if (
						previousLastIdentity != null
						&& proposals.some(({ proposal_tx_hash, proposal_index }) => (
							`${proposal_tx_hash}:${proposal_index.toString()}` === previousLastIdentity
						))
					)
						throw new Error('CardanoKoios_Rest: governance proposals continuation did not advance')

					return {
						network,
						proposals,
						proposalLimit,
						proposalOffset,
					}
				}
			),
		})({
			Cardano: {
				$$governanceProposals: {
					select: ({ network, proposals }) => proposals.map((proposal) => ({
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
					continuation: ({ proposalLimit, proposalOffset, proposals }) => (
						proposals.length < proposalLimit ?
							{
								operation: 'cardano-governance-proposals',
								target: networkBySlug.cardano.slug,
								terminal: true,
							}
						:
							{
								operation: 'cardano-governance-proposals',
								target: networkBySlug.cardano.slug,
								terminal: false,
								token: new URLSearchParams({
									after: `${proposals.at(-1)?.proposal_tx_hash}:${proposals.at(-1)?.proposal_index.toString()}`,
									offset: (proposalOffset + proposalLimit).toString(),
								}).toString(),
							}
						),
					},
				},
		}),

		defineResolver(Source.CardanoKoios_Rest, {
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network, context) => {
					assertCardanoMainnet(network)
					const { listAssets } = await import('$/sources/CardanoKoios/Rest/queries.ts')

					return {
						network,
						assets: await listAssets(cardanoKoiosBinding, listLimit(context)),
					}
				}
			),
		})({
			Cardano: {
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
			resolve: cardanoNetworkSelectors(
				async (network) => {
					assertCardanoMainnet(network)
					const { getLatestProtocolParameters } = await import('$/sources/CardanoKoios/Rest/queries.ts')
					const [parameters] = await getLatestProtocolParameters(cardanoKoiosBinding)

					return {
						network,
						parameters,
					}
				}
			),
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
			},
		}),

		defineResolver(Source.CardanoKoios_Rest, {
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network) => {
					assertCardanoMainnet(network)
					const {
						getCommittee,
						getTip,
					} = await import('$/sources/CardanoKoios/Rest/queries.ts')
					const [
						[committee],
						[tip],
					] = await Promise.all([
						getCommittee(cardanoKoiosBinding),
						getTip(cardanoKoiosBinding),
					])

					return {
						network,
						committee,
						tip,
					}
				}
			),
		})({
			Cardano: {
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

		defineResolver(Source.CardanoKoios_Rest, {
			entityType: EntityType.CardanoGovernanceProposal,
			resolve: {
				[CardanoGovernanceProposalSelector.NetworkProposalTxHashProposalIndex]: {
					resolve: async ({
						$network,
						proposalTxHash,
						proposalIndex,
					}) => {
						assertCardanoMainnet($network)
						const { getTransactionInfo } = await import('$/sources/CardanoKoios/Rest/queries.ts')
						const transaction = await getTransactionInfo(
							cardanoKoiosBinding,
							proposalTxHash
						)

						if (transaction.tx_hash !== proposalTxHash)
							throw new Error('CardanoKoios_Rest: transaction response does not match the proposal subject')

						const proposals = transaction.proposal_procedures.filter(({ index }) => (
							index === proposalIndex
						))
						if (proposals.length !== 1)
							throw new Error('CardanoKoios_Rest: proposal response does not match the subject')
						const [proposal] = proposals

						return cardanoGovernanceProposalSnapshot(
							$network,
							proposalTxHash,
							proposal
						)
					},
				}
			},
		})({
			proposalKind: (proposal) => proposal.proposalKind,
			$transaction: (proposal) => proposal.$transaction,
			depositLovelace: (proposal) => proposal.depositLovelace,
			returnAddress: (proposal) => proposal.returnAddress,
			anchorUrl: (proposal) => proposal.anchorUrl,
			anchorHash: (proposal) => proposal.anchorHash,
			proposalPayload: (proposal) => proposal.proposalPayload,
		}),

		defineResolver(Source.CardanoKoios_Rest, {
			entityType: EntityType.CardanoTransaction,
			resolve: {
				[CardanoTransactionSelector.NetworkHash]: {
					resolve: async (cardanoTransaction) => {
						assertCardanoMainnet(cardanoTransaction.$network)
						const { getTransactionInfo } = await import('$/sources/CardanoKoios/Rest/queries.ts')
						const transaction = await getTransactionInfo(
							cardanoKoiosBinding,
							cardanoTransaction.hash
						)

						if (transaction.tx_hash !== cardanoTransaction.hash)
							throw new Error('CardanoKoios_Rest: transaction response does not match the subject')

						return {
							cardanoTransaction,
							transaction,
						}
					},
				}
			},
		})({
			$$certificates: ({ cardanoTransaction, transaction }) => transaction.certificates.map((certificate) => ({
				[EntityMetaKey.Selector]: {
					$transaction: cardanoTransaction,
					certificateIndex: certificate.index,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoCertificate, [], 'certificateKind')]: certificate.type,
					[entityFieldAddressKey(EntityType.CardanoCertificate, [], 'payload')]: certificate.info,
				},
			})),
			$$scripts: ({ cardanoTransaction, transaction }) => [
				...transaction.native_scripts.map((nativeScript, witnessIndex) => ({
					[EntityMetaKey.Selector]: {
						$transaction: cardanoTransaction,
						witnessIndex,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoScriptWitness, [], 'scriptKind')]: nativeScript.type ?? 'native',
						[entityFieldAddressKey(EntityType.CardanoScriptWitness, [], 'scriptHash')]: nativeScript.script_hash,
					},
				})),
				...transaction.plutus_contracts.map((plutusContract, contractIndex) => {
					const witnessIndex = transaction.native_scripts.length + contractIndex

					return {
						[EntityMetaKey.Selector]: {
							$transaction: cardanoTransaction,
							witnessIndex,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.CardanoScriptWitness, [], 'scriptKind')]: 'plutus',
							[entityFieldAddressKey(EntityType.CardanoScriptWitness, [], 'scriptHash')]: plutusContract.script_hash,
							[entityFieldAddressKey(EntityType.CardanoScriptWitness, [], 'datum')]: plutusContract.input.datum ?? undefined,
							[entityFieldAddressKey(EntityType.CardanoScriptWitness, [], 'redeemer')]: plutusContract.input.redeemer,
							[entityFieldAddressKey(EntityType.CardanoScriptWitness, [], 'executionUnits')]: plutusContract.input.redeemer.unit,
						},
					}
				}),
			],
			$$governanceProposals: ({ cardanoTransaction, transaction }) => transaction.proposal_procedures.map((proposal) => {
				const snapshot = cardanoGovernanceProposalSnapshot(
					cardanoTransaction.$network,
					cardanoTransaction.hash,
					proposal
				)

				return {
					[EntityMetaKey.Selector]: {
						$network: cardanoTransaction.$network,
						proposalTxHash: cardanoTransaction.hash,
						proposalIndex: proposal.index,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'proposalKind')]: snapshot.proposalKind,
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], '$transaction')]: {
							[EntityMetaKey.Selector]: snapshot.$transaction,
						},
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'depositLovelace')]: snapshot.depositLovelace,
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'returnAddress')]: snapshot.returnAddress,
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'anchorUrl')]: snapshot.anchorUrl,
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'anchorHash')]: snapshot.anchorHash,
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'proposalPayload')]: snapshot.proposalPayload,
					},
				}
			}),
			$$governanceVotes: ({ cardanoTransaction, transaction }) => transaction.voting_procedures.map((votingProcedure) => ({
				[EntityMetaKey.Selector]: {
					$proposal: {
						$network: cardanoTransaction.$network,
						proposalTxHash: votingProcedure.proposal_tx_hash,
						proposalIndex: votingProcedure.proposal_index,
					},
					voterKind: votingProcedure.voter_role,
					voterCredential: votingProcedure.voter,
					voteTxHash: cardanoTransaction.hash,
					source: Source.CardanoKoios_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], 'vote')]: votingProcedure.vote,
					[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], '$transaction')]: {
						[EntityMetaKey.Selector]: cardanoTransaction,
					},
					...(votingProcedure.voter_role === 'DRep' && {
						[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], '$drep')]: {
							[EntityMetaKey.Selector]: {
								$network: cardanoTransaction.$network,
								drepCredential: votingProcedure.voter,
							},
						},
					}),
					...(votingProcedure.voter_role === 'SPO' && {
						[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], '$stakePool')]: {
							[EntityMetaKey.Selector]: {
								$network: cardanoTransaction.$network,
								poolId: votingProcedure.voter,
							},
						},
					}),
					[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], 'epoch')]: transaction.epoch_no,
					[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], 'slot')]: BigInt(transaction.absolute_slot),
					[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], 'timestampMs')]: transaction.tx_timestamp * 1_000,
				},
			})),
		}),
	],
}

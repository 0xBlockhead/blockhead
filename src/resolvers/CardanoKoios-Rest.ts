import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit, type ResolverContext } from '$/resolvers/$resolvers.ts'
import { cardanoGovernanceActionFields } from '$/resolvers/CardanoGovernance.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type { CardanoKoiosTransactionProposalProcedure } from '$/sources/CardanoKoios/Rest/types.ts'
import { Source } from '$/sources/Source.ts'
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
		context: ResolverContext
	) => Promise<_Snapshot>
) => ({
	Slug: { resolve },
	Caip2: { resolve },
})

const listLimit = (context: Parameters<typeof resolverContextRowLimit>[0]) => (
	Math.min(resolverContextRowLimit(context), 100)
)

const cardanoGovernanceProposalSnapshot = (
	network: EntitySelector<typeof schema, EntityType.Network>,
	transactionHash: string,
	proposal: CardanoKoiosTransactionProposalProcedure
) => ({
	...cardanoGovernanceActionFields(proposal.description, network),
	proposalKind: proposal.type,
	$transaction: {
		$network: network,
		hash: transactionHash,
	},
	depositLovelace: BigInt(proposal.deposit),
	returnAddress: proposal.return_address,
	anchorUrl: proposal.meta_url ?? undefined,
	anchorHash: proposal.meta_hash ?? undefined,
})

export default {
	source: Source.CardanoKoios_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network) => {
				assertCardanoMainnet(network)
				const { getRestEndpoints } = await import('$/sources/CardanoKoios/Rest/queries.ts')
				return getRestEndpoints()
			}
			),
		})({
			Cardano: {
				restEndpoints: (restEndpoints) => restEndpoints,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network) => {
				assertCardanoMainnet(network)
				const { getTip } = await import('$/sources/CardanoKoios/Rest/queries.ts')
				const [tip] = await getTip()

				return [{
					[EntityMetaKey.Selector]: {
						$network: network,
						timestampMs: tip.block_time * 1_000,
						source: Source.CardanoKoios_Rest,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestSlot')]: BigInt(tip.abs_slot),
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockNo')]: BigInt(tip.block_height),
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockHash')]: tip.hash,
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockTimeMs')]: tip.block_time * 1_000,
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'epoch')]: tip.epoch_no,
					},
				}]
			}
			),
		})({
			Cardano: {
				$$timestamps: (timestamps) => timestamps,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network, context) => {
				assertCardanoMainnet(network)
				const { listBlocks } = await import('$/sources/CardanoKoios/Rest/queries.ts')

				return (await listBlocks(listLimit(context))).map((block) => ({
					[EntityMetaKey.Selector]: {
						$network: network,
						hash: block.hash,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoBlock, [], 'slot')]: BigInt(block.abs_slot),
						[entityFieldAddressKey(EntityType.CardanoBlock, [], 'blockNo')]: BigInt(block.block_height),
						[entityFieldAddressKey(EntityType.CardanoBlock, [], 'epoch')]: block.epoch_no,
						[entityFieldAddressKey(EntityType.CardanoBlock, [], 'era')]: block.era,
					},
				}))
			}
			),
		})({
			Cardano: {
				$$blocks: (blocks) => blocks,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network, context) => {
				assertCardanoMainnet(network)
				const { listLatestBlockTransactions } = await import('$/sources/CardanoKoios/Rest/queries.ts')

				return (await listLatestBlockTransactions(listLimit(context))).map(({ tx_hash }) => ({
					[EntityMetaKey.Selector]: {
						$network: network,
						hash: tx_hash,
					},
				}))
			}
			),
		})({
			Cardano: {
				$$transactions: (transactions) => transactions,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network, context) => {
				assertCardanoMainnet(network)
				const { listStakePools } = await import('$/sources/CardanoKoios/Rest/queries.ts')

				return (await listStakePools(listLimit(context))).map(({
					pool_id_bech32,
					ticker,
				}) => ({
					[EntityMetaKey.Selector]: {
						$network: network,
						poolId: pool_id_bech32,
					},
					...(ticker != null && {
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.CardanoStakePool, [], 'ticker')]: ticker,
						},
					}),
				}))
			}
			),
		})({
			Cardano: {
				$$stakePools: (stakePools) => stakePools,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network, context) => {
					assertCardanoMainnet(network)
					const { listDReps } = await import('$/sources/CardanoKoios/Rest/queries.ts')

					return (await listDReps(listLimit(context))).map((dRep) => ({
						[EntityMetaKey.Selector]: {
							$network: network,
							drepCredential: dRep.drep_id,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.CardanoDRep, [], 'credentialKind')]: dRep.has_script ? 'script' : 'key',
						},
					}))
				}
			),
		})({
			Cardano: {
				$$dReps: (dReps) => dReps,
			},
		}),

		defineResolver({
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

		defineResolver({
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network, context) => {
					assertCardanoMainnet(network)
					const { listAssets } = await import('$/sources/CardanoKoios/Rest/queries.ts')

					return (await listAssets(listLimit(context))).map((asset) => ({
						[EntityMetaKey.Selector]: {
							$network: network,
							policyId: asset.policy_id,
							assetName: asset.asset_name,
						},
					}))
				}
			),
		})({
			Cardano: {
				$$assets: (assets) => assets,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network) => {
					assertCardanoMainnet(network)
					const { getLatestProtocolParameters } = await import('$/sources/CardanoKoios/Rest/queries.ts')
					const [parameters] = await getLatestProtocolParameters()

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

		defineResolver({
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
						getCommittee(),
						getTip(),
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
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'quorumNumerator')]: committee.quorum_numerator,
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'quorumDenominator')]: committee.quorum_denominator,
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'memberCount')]: committee.members.length,
						[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'members')]: committee.members,
					},
				}],
			},
		}),

		defineResolver({
			entityType: EntityType.CardanoGovernanceProposal,
			resolve: {
				NetworkProposalTxHashProposalIndex: {
					resolve: async ({
						$network,
						proposalTxHash,
						proposalIndex,
					}) => {
						assertCardanoMainnet($network)
						const { getTransactionInfo } = await import('$/sources/CardanoKoios/Rest/queries.ts')
						const transaction = await getTransactionInfo(
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
			$transaction: (proposal) => ({
				[EntityMetaKey.Selector]: proposal.$transaction,
			}),
			depositLovelace: (proposal) => proposal.depositLovelace,
			returnAddress: (proposal) => proposal.returnAddress,
			anchorUrl: (proposal) => proposal.anchorUrl,
			anchorHash: (proposal) => proposal.anchorHash,
			$previousAction: (proposal) => proposal.$previousAction == null ? undefined : ({
				[EntityMetaKey.Selector]: proposal.$previousAction,
			}),
			policyHash: (proposal) => proposal.policyHash,
			hardForkMajor: (proposal) => proposal.hardForkMajor,
			hardForkMinor: (proposal) => proposal.hardForkMinor,
			treasuryWithdrawals: (proposal) => proposal.treasuryWithdrawals ?? [],
			committeeRemovedCredentials: (proposal) => proposal.committeeRemovedCredentials ?? [],
			committeeAdditions: (proposal) => proposal.committeeAdditions ?? [],
			committeeQuorumNumerator: (proposal) => proposal.committeeQuorumNumerator,
			committeeQuorumDenominator: (proposal) => proposal.committeeQuorumDenominator,
			constitutionAnchorUrl: (proposal) => proposal.constitutionAnchorUrl,
			constitutionAnchorHash: (proposal) => proposal.constitutionAnchorHash,
			constitutionScript: (proposal) => proposal.constitutionScript,
		}),

		defineResolver({
			entityType: EntityType.CardanoTransaction,
			resolve: {
				NetworkHash: {
					resolve: async (cardanoTransaction) => {
						assertCardanoMainnet(cardanoTransaction.$network)
						const { getTransactionInfo } = await import('$/sources/CardanoKoios/Rest/queries.ts')
						const transaction = await getTransactionInfo(
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
							...(plutusContract.input.datum != null && {
								[entityFieldAddressKey(EntityType.CardanoScriptWitness, [], 'datum')]: plutusContract.input.datum,
							}),
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
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], '$previousAction')]: snapshot.$previousAction == null ? undefined : {
							[EntityMetaKey.Selector]: snapshot.$previousAction,
						},
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'policyHash')]: snapshot.policyHash,
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'hardForkMajor')]: snapshot.hardForkMajor,
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'hardForkMinor')]: snapshot.hardForkMinor,
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'treasuryWithdrawals')]: snapshot.treasuryWithdrawals ?? [],
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'committeeRemovedCredentials')]: snapshot.committeeRemovedCredentials ?? [],
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'committeeAdditions')]: snapshot.committeeAdditions ?? [],
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'committeeQuorumNumerator')]: snapshot.committeeQuorumNumerator,
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'committeeQuorumDenominator')]: snapshot.committeeQuorumDenominator,
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'constitutionAnchorUrl')]: snapshot.constitutionAnchorUrl,
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'constitutionAnchorHash')]: snapshot.constitutionAnchorHash,
						[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'constitutionScript')]: snapshot.constitutionScript,
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
} satisfies RegisteredSourceResolverModule

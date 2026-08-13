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
import type {
	CardanoKoiosTransactionInfo,
	CardanoKoiosTransactionProposalProcedure,
	CardanoKoiosTransactionUtxo,
} from '$/sources/CardanoKoios/Rest/types.ts'
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

const cardanoKoiosTransactionInputRows = (
	transaction: Pick<
		CardanoKoiosTransactionInfo,
		'inputs' | 'collateral_inputs' | 'reference_inputs'
	>
) => (
	[
		...transaction.inputs.map((input) => ({
			input,
			inputKind: 'spend' as const,
		})),
		...transaction.collateral_inputs.map((input) => ({
			input,
			inputKind: 'collateral' as const,
		})),
		...transaction.reference_inputs.map((input) => ({
			input,
			inputKind: 'reference' as const,
		})),
	]
)

const cardanoKoiosTransactionInfoSnapshot = async (
	cardanoTransaction: EntitySelector<typeof schema, EntityType.CardanoTransaction>
) => {
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
}

const cardanoTxInputFields = (
	input: CardanoKoiosTransactionUtxo,
	inputKind: 'spend' | 'collateral' | 'reference',
	cardanoTransaction: EntitySelector<typeof schema, EntityType.CardanoTransaction>
) => ({
	[entityFieldAddressKey(EntityType.CardanoTxInput, [], 'inputKind')]: inputKind,
	[entityFieldAddressKey(EntityType.CardanoTxInput, [], 'spentTxHash')]: input.tx_hash,
	[entityFieldAddressKey(EntityType.CardanoTxInput, [], 'spentOutputIndex')]: input.tx_index,
	[entityFieldAddressKey(EntityType.CardanoTxInput, [], '$spentOutput')]: {
		[EntityMetaKey.Selector]: {
			$transaction: {
				$network: cardanoTransaction.$network,
				hash: input.tx_hash,
			},
			outputIndex: input.tx_index,
		},
	},
})

const cardanoTxOutputFields = (
	output: CardanoKoiosTransactionUtxo,
	cardanoTransaction: EntitySelector<typeof schema, EntityType.CardanoTransaction>
) => ({
	[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'address')]: output.payment_addr.bech32,
	[entityFieldAddressKey(EntityType.CardanoTxOutput, [], '$address')]: {
		[EntityMetaKey.Selector]: {
			$network: cardanoTransaction.$network,
			address: output.payment_addr.bech32,
		},
	},
	[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'lovelace')]: BigInt(output.value),
	...(output.datum_hash != null && {
		[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'datumHash')]: output.datum_hash,
	}),
	...(output.inline_datum != null && {
		[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'inlineDatum')]: output.inline_datum,
	}),
	...(output.reference_script != null && {
		[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'referenceScriptHash')]: output.reference_script.hash,
	}),
})

export default {
	source: Source.CardanoKoios_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network) => {
					assertCardanoMainnet(network)
					return (await import('$/sources/CardanoKoios/Rest/queries.ts')).restEndpoints
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
				const { listBlocks } = await import('$/sources/CardanoKoios/Rest/queries.ts')
				const [block] = await listBlocks(1)
				if (block == null)
					throw new Error('CardanoKoios_Rest: tip block is missing')

				return [{
					[EntityMetaKey.Selector]: {
						$network: network,
						timestampMs: block.block_time * 1_000,
						source: Source.CardanoKoios_Rest,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestSlot')]: BigInt(block.abs_slot),
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockNo')]: BigInt(block.block_height),
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockHash')]: block.hash,
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockTimeMs')]: block.block_time * 1_000,
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockTransactionCount')]: block.tx_count,
						[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'epoch')]: block.epoch_no,
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
						...(block.vrf_key != null && {
							[entityFieldAddressKey(EntityType.CardanoBlock, [], 'issuerVkey')]: block.vrf_key,
						}),
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
			entityType: EntityType.CardanoBlock,
			resolve: {
				NetworkHash: {
					resolve: async (cardanoBlock) => {
						assertCardanoMainnet(cardanoBlock.$network)
						const {
							getBlockInfo,
							getBlockTransactions,
						} = await import('$/sources/CardanoKoios/Rest/queries.ts')
						const [
							block,
							transactions,
						] = await Promise.all([
							getBlockInfo(cardanoBlock.hash),
							getBlockTransactions(cardanoBlock.hash),
						])
						if (transactions.length !== block.tx_count)
							throw new Error('CardanoKoios_Rest: block transaction count does not match block info')

						return {
							cardanoBlock,
							block,
							transactions,
						}
					},
				},
			},
		})({
			slot: ({ block }) => BigInt(block.abs_slot),
			blockNo: ({ block }) => BigInt(block.block_height),
			epoch: ({ block }) => block.epoch_no,
			era: ({ block }) => block.era,
			issuerVkey: ({ block }) => block.vrf_key ?? undefined,
			$$transactions: ({ cardanoBlock, transactions }) => transactions.map(({ tx_hash }) => ({
				[EntityMetaKey.Selector]: {
					$network: cardanoBlock.$network,
					hash: tx_hash,
				},
			})),
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
						...(parameters.cost_models != null && {
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'costModels')]: parameters.cost_models,
						}),
						...((parameters.price_mem != null || parameters.price_step != null) && {
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'executionPrices')]: {
								memory: parameters.price_mem,
								steps: parameters.price_step,
							},
						}),
						...((parameters.max_tx_ex_mem != null || parameters.max_tx_ex_steps != null) && {
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxTxExUnits')]: {
								memory: parameters.max_tx_ex_mem,
								steps: parameters.max_tx_ex_steps,
							},
						}),
						...((parameters.max_block_ex_mem != null || parameters.max_block_ex_steps != null) && {
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxBlockExUnits')]: {
								memory: parameters.max_block_ex_mem,
								steps: parameters.max_block_ex_steps,
							},
						}),
						...(parameters.max_val_size != null && {
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxValueSize')]: parameters.max_val_size,
						}),
						...(parameters.collateral_percent != null && {
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'collateralPercentage')]: parameters.collateral_percent,
						}),
						...(parameters.max_collateral_inputs != null && {
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxCollateralInputs')]: parameters.max_collateral_inputs,
						}),
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
			entityType: EntityType.CardanoGovernanceVote,
			resolve: {
				ProposalVoterKindVoterCredentialVoteTxHashSource: {
					appliesTo: [{
						source: Source.CardanoKoios_Rest,
					}],
					resolve: async ({
						$proposal,
						voterKind,
						voterCredential,
						voteTxHash,
						source,
					}) => {
						assertCardanoMainnet($proposal.$network)
						if (source !== Source.CardanoKoios_Rest)
							throw new Error('CardanoKoios_Rest: governance vote source does not match the subject')

						const transaction = await cardanoKoiosTransactionInfoSnapshot({
							$network: $proposal.$network,
							hash: voteTxHash,
						})
						const votes = transaction.transaction.voting_procedures.filter((votingProcedure) => (
							votingProcedure.proposal_tx_hash === $proposal.proposalTxHash
							&& votingProcedure.proposal_index === $proposal.proposalIndex
							&& votingProcedure.voter_role === voterKind
							&& votingProcedure.voter === voterCredential
						))
						if (votes.length !== 1)
							throw new Error('CardanoKoios_Rest: governance vote response does not match the subject')

						const [vote] = votes
						return {
							vote: vote.vote,
							$transaction: transaction.cardanoTransaction,
							...(vote.voter_role === 'DRep' && {
								$drep: {
									$network: $proposal.$network,
									drepCredential: vote.voter,
								},
							}),
							...(vote.voter_role === 'SPO' && {
								$stakePool: {
									$network: $proposal.$network,
									poolId: vote.voter,
								},
							}),
							epoch: transaction.transaction.epoch_no,
							slot: BigInt(transaction.transaction.absolute_slot),
							timestampMs: transaction.transaction.tx_timestamp * 1_000,
						}
					},
				},
			},
		})({
			vote: (snapshot) => snapshot.vote,
			$transaction: (snapshot) => ({
				[EntityMetaKey.Selector]: snapshot.$transaction,
			}),
			$drep: (snapshot) => (
				snapshot.$drep == null ?
					undefined
				:
					{
						[EntityMetaKey.Selector]: snapshot.$drep,
					}
			),
			$stakePool: (snapshot) => (
				snapshot.$stakePool == null ?
					undefined
				:
					{
						[EntityMetaKey.Selector]: snapshot.$stakePool,
					}
			),
			epoch: (snapshot) => snapshot.epoch,
			slot: (snapshot) => snapshot.slot,
			timestampMs: (snapshot) => snapshot.timestampMs,
		}),

		defineResolver({
			entityType: EntityType.CardanoTransaction,
			resolve: {
				NetworkHash: {
					resolve: cardanoKoiosTransactionInfoSnapshot,
				}
			},
		})({
			blockSlot: ({ transaction }) => BigInt(transaction.absolute_slot),
			fee: ({ transaction }) => BigInt(transaction.fee),
			deposit: ({ transaction }) => BigInt(transaction.deposit),
			sizeBytes: ({ transaction }) => transaction.tx_size,
			validityStartSlot: ({ transaction }) => (
				transaction.invalid_before == null ?
					undefined
				:
					BigInt(transaction.invalid_before)
			),
			ttlSlot: ({ transaction }) => (
				transaction.invalid_after == null ?
					undefined
				:
					BigInt(transaction.invalid_after)
			),
			$$inputs: ({ cardanoTransaction, transaction }) => cardanoKoiosTransactionInputRows(transaction).map(({
				input,
				inputKind,
			}, inputIndex) => ({
				[EntityMetaKey.Selector]: {
					$transaction: cardanoTransaction,
					inputIndex,
				},
				[EntityMetaKey.Fields]: cardanoTxInputFields(
					input,
					inputKind,
					cardanoTransaction
				),
			})),
			$$outputs: ({ cardanoTransaction, transaction }) => transaction.outputs.map((output) => ({
				[EntityMetaKey.Selector]: {
					$transaction: cardanoTransaction,
					outputIndex: output.tx_index,
				},
				[EntityMetaKey.Fields]: cardanoTxOutputFields(
					output,
					cardanoTransaction
				),
			})),
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

		defineResolver({
			entityType: EntityType.CardanoTxInput,
			resolve: {
				TransactionInputIndex: {
					resolve: async (cardanoTxInput) => {
						const row = cardanoKoiosTransactionInputRows(
							(
								await cardanoKoiosTransactionInfoSnapshot(cardanoTxInput.$transaction)
							).transaction
						).at(cardanoTxInput.inputIndex)
						if (row == null)
							throw new Error(`CardanoKoios_Rest: transaction input ${cardanoTxInput.inputIndex.toString()} not found`)

						return row
					},
				},
			},
		})({
			inputKind: ({ inputKind }) => inputKind,
			spentTxHash: ({ input }) => input.tx_hash,
			spentOutputIndex: ({ input }) => input.tx_index,
			$spentOutput: ({ input }, cardanoTxInput) => ({
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network: cardanoTxInput.$transaction.$network,
						hash: input.tx_hash,
					},
					outputIndex: input.tx_index,
				},
			}),
		}),

		defineResolver({
			entityType: EntityType.CardanoTxOutput,
			resolve: {
				TransactionOutputIndex: {
					resolve: async (cardanoTxOutput) => {
						const output = (
							await cardanoKoiosTransactionInfoSnapshot(cardanoTxOutput.$transaction)
						).transaction.outputs.find(({ tx_index }) => tx_index === cardanoTxOutput.outputIndex)
						if (output == null)
							throw new Error(`CardanoKoios_Rest: transaction output ${cardanoTxOutput.outputIndex.toString()} not found`)

						return output
					},
				},
			},
		})({
			address: (output) => output.payment_addr.bech32,
			$address: (output, cardanoTxOutput) => ({
				[EntityMetaKey.Selector]: {
					$network: cardanoTxOutput.$transaction.$network,
					address: output.payment_addr.bech32,
				},
			}),
			lovelace: (output) => BigInt(output.value),
			datumHash: (output) => output.datum_hash ?? undefined,
			inlineDatum: (output) => output.inline_datum ?? undefined,
			referenceScriptHash: (output) => output.reference_script?.hash,
			$$assets: (output, cardanoTxOutput) => (output.asset_list ?? []).map((asset) => ({
				[EntityMetaKey.Selector]: {
					$output: cardanoTxOutput,
					$asset: {
						$network: cardanoTxOutput.$transaction.$network,
						policyId: asset.policy_id,
						assetName: asset.asset_name,
					},
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoTxOutputAsset, [], 'quantity')]: BigInt(asset.quantity),
				},
			})),
		}),
	],
} satisfies RegisteredSourceResolverModule

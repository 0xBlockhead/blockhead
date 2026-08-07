import { networkBySlug } from '$/constants/Network.ts'
import { resolverContextRowLimit, type ResolverContext } from '$/resolvers/$resolvers.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { cardanoGovernanceActionFields } from '$/resolvers/CardanoGovernance.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type { BlockfrostBlock } from '$/sources/Blockfrost/Rest/types.ts'

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

const cardanoNetworkSelectors = <const _Snapshot extends object>(
	resolve: (
		network: EntitySelector<typeof schema, EntityType.Network>,
		context: ResolverContext
	) => Promise<_Snapshot>
) => ({
	Slug: { resolve },
	Caip2: { resolve },
})

const blockfrostPageContinuation = (
	token: string | undefined,
	label: string
) => {
	if (token == null)
		return {
			previousLastIdentity: undefined,
			page: 1,
		}

	const parameters = new URLSearchParams(token)
	const page = Number(parameters.get('page'))
	const previousLastIdentity = parameters.get('after')
	if (
		!Number.isSafeInteger(page)
		|| page < 2
		|| previousLastIdentity == null
		|| previousLastIdentity.length === 0
		|| parameters.getAll('page').length !== 1
		|| parameters.getAll('after').length !== 1
		|| [...parameters.keys()].some((key) => key !== 'page' && key !== 'after')
	)
		throw new Error(`Blockfrost_Rest: invalid ${label} continuation`)

	return {
		previousLastIdentity,
		page,
	}
}

const cardanoTransactionUtxos = async (
	cardanoTransaction: EntitySelector<typeof schema, EntityType.CardanoTransaction>
) => {
	assertCardanoMainnet(cardanoTransaction.$network)
	const { getTransactionUtxos } = await import('$/sources/Blockfrost/Rest/queries.ts')
	const transactionUtxos = await getTransactionUtxos(
		cardanoTransaction.hash
	)
	if (transactionUtxos.hash !== cardanoTransaction.hash)
		throw new Error('Blockfrost_Rest: transaction UTXOs do not match the subject')

	return transactionUtxos
}

const cardanoNativeAssetUnit = (
	policyId: string,
	assetName: string
) => {
	const asset = `${policyId}${assetName}`
	if (
		policyId.length !== 56
		|| asset.length % 2 !== 0
		|| !/^[0-9a-f]+$/u.test(asset)
	)
		throw new Error('Blockfrost_Rest: asset identifier is malformed')

	return asset
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
		...(block.block_vrf != null && {
			issuerVkey: block.block_vrf,
		}),
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
		getLatestBlock(),
		getLatestEpoch(),
		getNetwork(),
		getHealth(),
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

const stakePoolObservation = async (
	poolId: string
) => {
	const {
		getLatestEpoch,
		getStakePool,
	} = await import('$/sources/Blockfrost/Rest/queries.ts')
	const [
		pool,
		epoch,
	] = await Promise.all([
		getStakePool(poolId),
		getLatestEpoch(),
	])
	if (pool.pool_id !== poolId)
		throw new Error('Blockfrost_Rest: stake pool response does not match the subject')

	return {
		epoch: epoch.epoch,
		source: Source.Blockfrost_Rest,
		pledge: BigInt(pool.declared_pledge),
		margin: pool.margin_cost,
		fixedCostLovelace: BigInt(pool.fixed_cost),
		rewardAccount: pool.reward_account,
		owners: pool.owners,
		liveStake: BigInt(pool.live_stake),
		activeStake: BigInt(pool.active_stake),
		delegatorCount: pool.live_delegators,
		blockCount: pool.blocks_minted,
		saturation: pool.live_saturation,
		retired: pool.retirement.length > 0,
	}
}

const dRepObservation = async (
	drepCredential: string
) => {
	const {
		getDRep,
		getLatestEpoch,
	} = await import('$/sources/Blockfrost/Rest/queries.ts')
	const [
		drep,
		epoch,
	] = await Promise.all([
		getDRep(drepCredential),
		getLatestEpoch(),
	])
	if (drep.drep_id !== drepCredential)
		throw new Error('Blockfrost_Rest: DRep response does not match the subject')

	return {
		epoch: epoch.epoch,
		source: Source.Blockfrost_Rest,
		credentialKind: drep.has_script ? 'script' : 'key',
		votingPowerLovelace: BigInt(drep.amount),
		active: !drep.retired && !drep.expired,
		registered: !drep.retired,
	}
}

const nativeAssetObservation = async (
	policyId: string,
	assetName: string
) => {
	const {
		getAsset,
		getLatestBlock,
	} = await import('$/sources/Blockfrost/Rest/queries.ts')
	const assetUnit = cardanoNativeAssetUnit(policyId, assetName)
	const [
		asset,
		block,
	] = await Promise.all([
		getAsset(assetUnit),
		getLatestBlock(),
	])
	if (
		asset.asset !== assetUnit
		|| asset.policy_id !== policyId
		|| (asset.asset_name ?? '') !== assetName
	)
		throw new Error('Blockfrost_Rest: asset response does not match the subject')
	if (block.slot == null)
		throw new Error('Blockfrost_Rest: latest block is missing its slot')

	return {
		slot: BigInt(block.slot),
		source: Source.Blockfrost_Rest,
		timestampMs: block.time * 1_000,
		blockHash: block.hash,
		supply: BigInt(asset.quantity),
		transactionCount: asset.mint_or_burn_count,
		...(asset.onchain_metadata != null && {
			metadata: asset.onchain_metadata,
		}),
		fingerprint: asset.fingerprint,
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
		getCommittee(),
		getLatestEpoch(),
		listCommitteeVotes(limit),
	])

	return {
		epoch: epoch.epoch,
		source: Source.Blockfrost_Rest,
		govActionId: committee.gov_action_id ?? undefined,
		$seatingProposal: committee.proposal_tx_hash != null && committee.proposal_index != null ?
			{
				[EntityMetaKey.Selector]: {
					$network: network,
					proposalTxHash: committee.proposal_tx_hash,
					proposalIndex: committee.proposal_index,
				},
			}
		:
			undefined,
		dissolved: committee.is_dissolved,
		quorumNumerator: committee.quorum.numerator,
		quorumDenominator: committee.quorum.denominator,
		memberCount: committee.members.length,
		members: committee.members,
		$$votes: votes.map((vote) => ({
			[EntityMetaKey.Selector]: {
				$proposal: {
					$network: network,
					proposalTxHash: vote.proposal_tx_hash,
					proposalIndex: vote.proposal_index,
				},
				voterKind: 'constitutional-committee',
				voterCredential: vote.voter_hot_id,
				voteTxHash: vote.tx_hash,
				source: Source.Blockfrost_Rest,
			},
			[EntityMetaKey.Fields]: {
				[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], 'vote')]: vote.vote,
				...(vote.metadata_url != null && {
					[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], 'anchorUrl')]: vote.metadata_url,
				}),
				...(vote.metadata_hash != null && {
					[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], 'anchorHash')]: vote.metadata_hash,
				}),
				[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], 'timestampMs')]: vote.block_time * 1_000,
			},
		})),
	}
}

export default {
	source: Source.Blockfrost_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.CardanoAddress,
			resolve: {
				NetworkAddress: {
					resolve: async (cardanoAddress) => {
						assertCardanoMainnet(cardanoAddress.$network)
						const {
							getAddress,
							getAddressTotal,
							getLatestBlock,
						} = await import('$/sources/Blockfrost/Rest/queries.ts')
						const [
							address,
							total,
							block,
						] = await Promise.all([
							getAddress(cardanoAddress.address),
							getAddressTotal(cardanoAddress.address),
							getLatestBlock(),
						])
						if (
							address.address !== cardanoAddress.address
							|| total.address !== cardanoAddress.address
						)
							throw new Error('Blockfrost_Rest: address response does not match the subject')
						if (block.slot == null)
							throw new Error('Blockfrost_Rest: latest block is missing its slot')

						return {
							addressKind: `${address.type}${address.script ? '-script' : '-key'}`,
							...(address.stake_address != null && {
								$stakeCredential: {
									[EntityMetaKey.Selector]: {
										$network: cardanoAddress.$network,
										credential: address.stake_address,
									},
								},
							}),
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$address: cardanoAddress,
										blockSlot: BigInt(block.slot),
										source: Source.Blockfrost_Rest,
									},
									[EntityMetaKey.Fields]: {
										[entityFieldAddressKey(EntityType.CardanoAddress_Timestamp, [], 'timestampMs')]: block.time * 1_000,
										[entityFieldAddressKey(EntityType.CardanoAddress_Timestamp, [], 'blockHash')]: block.hash,
										[entityFieldAddressKey(EntityType.CardanoAddress_Timestamp, [], 'lovelaceBalance')]: BigInt(
											address.amount.find(({ unit }) => unit === 'lovelace')?.quantity ?? '0'
										),
										[entityFieldAddressKey(EntityType.CardanoAddress_Timestamp, [], 'nativeAssetCount')]: address.amount.filter(({ unit }) => unit !== 'lovelace').length,
										[entityFieldAddressKey(EntityType.CardanoAddress_Timestamp, [], 'transactionCount')]: total.tx_count,
									},
								},
							],
						}
					},
				},
			},
		})({
			addressKind: (address) => address.addressKind,
			$stakeCredential: (address) => address.$stakeCredential,
			$$timestamps: (address) => address.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.CardanoAddress,
			resolve: {
				NetworkAddress: {
					resolve: async (cardanoAddress, context) => {
						assertCardanoMainnet(cardanoAddress.$network)
						const limit = Math.min(resolverContextRowLimit(context), 100)
						const page = context.providerContinuationToken == null ?
							1
						:
							Number(context.providerContinuationToken)
						if (!Number.isSafeInteger(page) || page < 1)
							throw new Error('Blockfrost_Rest: invalid address transaction continuation')

						const { listAddressTransactions } = await import('$/sources/Blockfrost/Rest/queries.ts')

						return {
							limit,
							page,
							transactions: (await listAddressTransactions(
								cardanoAddress.address,
								limit,
								page
							)).map((transaction) => ({
								[EntityMetaKey.Selector]: {
									$network: cardanoAddress.$network,
									hash: transaction.tx_hash,
								},
							})),
						}
					},
				},
			},
		})({
			$$transactions: {
				select: (page) => page.transactions,
				continuation: (page, cardanoAddress) => (
					page.transactions.length < page.limit ?
						{
							operation: 'address-transactions',
							target: cardanoAddress.address,
							terminal: true,
						}
					:
						{
							operation: 'address-transactions',
							target: cardanoAddress.address,
							terminal: false,
							token: (page.page + 1).toString(),
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.CardanoAddress,
			resolve: {
				NetworkAddress: {
					resolve: async (cardanoAddress, context) => {
						assertCardanoMainnet(cardanoAddress.$network)
						const limit = Math.min(resolverContextRowLimit(context), 100)
						const page = context.providerContinuationToken == null ?
							1
						:
							Number(context.providerContinuationToken)
						if (!Number.isSafeInteger(page) || page < 1)
							throw new Error('Blockfrost_Rest: invalid address UTXO continuation')

						const { listAddressUtxos } = await import('$/sources/Blockfrost/Rest/queries.ts')

						return {
							limit,
							page,
							utxos: await listAddressUtxos(
								cardanoAddress.address,
								limit,
								page
							),
						}
					},
				},
			},
		})({
			$$utxos: {
				select: (page, cardanoAddress) => page.utxos.map((utxo) => {
					const lovelace = utxo.amount.find(({ unit }) => unit === 'lovelace')

					return {
						[EntityMetaKey.Selector]: {
							$transaction: {
								$network: cardanoAddress.$network,
								hash: utxo.tx_hash,
							},
							outputIndex: utxo.output_index,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'address')]: utxo.address,
							[entityFieldAddressKey(EntityType.CardanoTxOutput, [], '$address')]: {
								[EntityMetaKey.Selector]: cardanoAddress,
							},
							...(lovelace != null && {
								[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'lovelace')]: BigInt(lovelace.quantity),
							}),
							...(utxo.data_hash != null && {
								[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'datumHash')]: utxo.data_hash,
							}),
							...(utxo.inline_datum != null && {
								[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'inlineDatum')]: utxo.inline_datum,
							}),
							...(utxo.reference_script_hash != null && {
								[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'referenceScriptHash')]: utxo.reference_script_hash,
							}),
						},
					}
				}),
				continuation: (page, cardanoAddress) => (
					page.utxos.length < page.limit ?
						{
							operation: 'address-utxos',
							target: cardanoAddress.address,
							terminal: true,
						}
					:
						{
							operation: 'address-utxos',
							target: cardanoAddress.address,
							terminal: false,
							token: (page.page + 1).toString(),
						}
					),
			},
			$$assets: {
				select: (page, cardanoAddress) => (
					[
						...new Set(
							page.utxos
								.flatMap(({ amount }) => amount.map(({ unit }) => unit))
								.filter((unit) => unit !== 'lovelace')
						),
					].map((asset) => {
						if (asset.length < 56 || asset.length % 2 !== 0 || !/^[0-9a-f]+$/u.test(asset))
							throw new Error('Blockfrost_Rest: address asset identifier is malformed')

						return {
							[EntityMetaKey.Selector]: {
								$network: cardanoAddress.$network,
								policyId: asset.slice(0, 56),
								assetName: asset.slice(56),
							},
						}
					})
				),
				continuation: (page, cardanoAddress) => (
					page.utxos.length < page.limit ?
						{
							operation: 'address-utxos',
							target: cardanoAddress.address,
							terminal: true,
						}
					:
						{
							operation: 'address-utxos',
							target: cardanoAddress.address,
							terminal: false,
							token: (page.page + 1).toString(),
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.CardanoTransaction,
			resolve: {
				NetworkHash: {
					resolve: async (cardanoTransaction) => {
						assertCardanoMainnet(cardanoTransaction.$network)
						const { getTransaction } = await import('$/sources/Blockfrost/Rest/queries.ts')
						const transaction = await getTransaction(cardanoTransaction.hash)
						if (transaction.hash !== cardanoTransaction.hash)
							throw new Error('Blockfrost_Rest: transaction response does not match the subject')

						return transaction
					},
				},
			},
		})({
			blockSlot: (transaction) => BigInt(transaction.slot),
			fee: (transaction) => BigInt(transaction.fees),
			deposit: (transaction) => BigInt(transaction.deposit),
			sizeBytes: (transaction) => transaction.size,
			validityStartSlot: (transaction) => transaction.invalid_before == null ? undefined : BigInt(transaction.invalid_before),
			ttlSlot: (transaction) => transaction.invalid_hereafter == null ? undefined : BigInt(transaction.invalid_hereafter),
		}),

		defineResolver({
			entityType: EntityType.CardanoTransaction,
			resolve: {
				NetworkHash: {
					resolve: cardanoTransactionUtxos,
				},
			},
		})({
			$$inputs: (transactionUtxos, cardanoTransaction) => transactionUtxos.inputs.map((
				input,
				inputIndex
			) => ({
				[EntityMetaKey.Selector]: {
					$transaction: cardanoTransaction,
					inputIndex,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.CardanoTxInput, [], 'inputKind')]: (
						input.reference === true ?
							'reference'
						: input.collateral ?
							'collateral'
						:
							'spend'
					),
					[entityFieldAddressKey(EntityType.CardanoTxInput, [], 'spentTxHash')]: input.tx_hash,
					[entityFieldAddressKey(EntityType.CardanoTxInput, [], 'spentOutputIndex')]: input.output_index,
					[entityFieldAddressKey(EntityType.CardanoTxInput, [], '$spentOutput')]: {
						[EntityMetaKey.Selector]: {
							$transaction: {
								$network: cardanoTransaction.$network,
								hash: input.tx_hash,
							},
							outputIndex: input.output_index,
						},
					},
				},
			})),
			$$outputs: (transactionUtxos, cardanoTransaction) => transactionUtxos.outputs.map((output) => {
				const lovelace = output.amount.find(({ unit }) => unit === 'lovelace')

				return {
					[EntityMetaKey.Selector]: {
						$transaction: cardanoTransaction,
						outputIndex: output.output_index,
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'address')]: output.address,
						[entityFieldAddressKey(EntityType.CardanoTxOutput, [], '$address')]: {
							[EntityMetaKey.Selector]: {
								$network: cardanoTransaction.$network,
								address: output.address,
							},
						},
						...(lovelace != null && {
							[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'lovelace')]: BigInt(lovelace.quantity),
						}),
						...(output.data_hash != null && {
							[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'datumHash')]: output.data_hash,
						}),
						...(output.inline_datum != null && {
							[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'inlineDatum')]: output.inline_datum,
						}),
						...(output.reference_script_hash != null && {
							[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'referenceScriptHash')]: output.reference_script_hash,
						}),
						...(output.consumed_by_tx != null && {
							[entityFieldAddressKey(EntityType.CardanoTxOutput, [], 'spentByTxHash')]: output.consumed_by_tx,
						}),
					},
				}
			}),
			$$assets: (transactionUtxos, cardanoTransaction) => (
				[
					...new Set(
						[
							...transactionUtxos.inputs,
							...transactionUtxos.outputs,
						].flatMap(({ amount }) => amount.map(({ unit }) => unit))
							.filter((unit) => unit !== 'lovelace')
					),
				].map((asset) => {
					if (asset.length < 56 || asset.length % 2 !== 0 || !/^[0-9a-f]+$/u.test(asset))
						throw new Error('Blockfrost_Rest: transaction asset identifier is malformed')

					return {
						[EntityMetaKey.Selector]: {
							$network: cardanoTransaction.$network,
							policyId: asset.slice(0, 56),
							assetName: asset.slice(56),
						},
					}
				})
			),
		}),

		defineResolver({
			entityType: EntityType.CardanoTxInput,
			resolve: {
				TransactionInputIndex: {
					resolve: async (cardanoTxInput) => {
						const input = (
							await cardanoTransactionUtxos(cardanoTxInput.$transaction)
						).inputs.at(cardanoTxInput.inputIndex)
						if (input == null)
							throw new Error(`Blockfrost_Rest: transaction input ${cardanoTxInput.inputIndex.toString()} not found`)

						return input
					},
				},
			},
		})({
			inputKind: (input) => (
				input.reference === true ?
					'reference'
				: input.collateral ?
					'collateral'
				:
					'spend'
			),
			spentTxHash: (input) => input.tx_hash,
			spentOutputIndex: (input) => input.output_index,
			$spentOutput: (input, cardanoTxInput) => ({
				[EntityMetaKey.Selector]: {
					$transaction: {
						$network: cardanoTxInput.$transaction.$network,
						hash: input.tx_hash,
					},
					outputIndex: input.output_index,
				},
			}),
		}),

		defineResolver({
			entityType: EntityType.CardanoTxOutput,
			resolve: {
				TransactionOutputIndex: {
					resolve: async (cardanoTxOutput) => {
						const output = (
							await cardanoTransactionUtxos(cardanoTxOutput.$transaction)
						).outputs.find(({ output_index }) => output_index === cardanoTxOutput.outputIndex)
						if (output == null)
							throw new Error(`Blockfrost_Rest: transaction output ${cardanoTxOutput.outputIndex.toString()} not found`)

						return output
					},
				},
			},
		})({
			address: (output) => output.address,
			$address: (output, cardanoTxOutput) => ({
				[EntityMetaKey.Selector]: {
					$network: cardanoTxOutput.$transaction.$network,
					address: output.address,
				},
			}),
			lovelace: (output) => {
				const lovelace = output.amount.find(({ unit }) => unit === 'lovelace')

				return lovelace == null ? undefined : BigInt(lovelace.quantity)
			},
			datumHash: (output) => output.data_hash ?? undefined,
			inlineDatum: (output) => output.inline_datum ?? undefined,
			referenceScriptHash: (output) => output.reference_script_hash ?? undefined,
			spentByTxHash: (output) => output.consumed_by_tx ?? undefined,
			$$assets: (output, cardanoTxOutput) => output.amount.flatMap(({ quantity, unit }) => {
				if (unit === 'lovelace')
					return []
				if (unit.length < 56 || unit.length % 2 !== 0 || !/^[0-9a-f]+$/u.test(unit))
					throw new Error('Blockfrost_Rest: transaction output asset identifier is malformed')

				return [{
					[EntityMetaKey.Selector]: {
						$output: cardanoTxOutput,
						$asset: {
							$network: cardanoTxOutput.$transaction.$network,
							policyId: unit.slice(0, 56),
							assetName: unit.slice(56),
						},
					},
					[EntityMetaKey.Fields]: {
						[entityFieldAddressKey(EntityType.CardanoTxOutputAsset, [], 'quantity')]: BigInt(quantity),
					},
				}]
			}),
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network) => {
					assertCardanoMainnet(network)
					return (await import('$/sources/Blockfrost/Rest/queries.ts')).restEndpoints
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
					const observation = await networkObservation()

					return [{
						[EntityMetaKey.Selector]: {
							$network: network,
							timestampMs: observation.timestampMs,
							source: Source.Blockfrost_Rest,
						},
						[EntityMetaKey.Fields]: {
							...(observation.latestSlot != null && {
								[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestSlot')]: observation.latestSlot,
							}),
							...(observation.latestBlockNo != null && {
								[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockNo')]: observation.latestBlockNo,
							}),
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockHash')]: observation.latestBlockHash,
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockTimeMs')]: observation.latestBlockTimeMs,
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'latestBlockTransactionCount')]: observation.latestBlockTransactionCount,
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'epoch')]: observation.epoch,
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'epochBlockCount')]: observation.epochBlockCount,
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'epochTransactionCount')]: observation.epochTransactionCount,
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'circulatingSupplyLovelace')]: observation.circulatingSupplyLovelace,
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'totalSupplyLovelace')]: observation.totalSupplyLovelace,
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'liveStakeLovelace')]: observation.liveStakeLovelace,
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'activeStakeLovelace')]: observation.activeStakeLovelace,
							[entityFieldAddressKey(EntityType.CardanoNetwork_Timestamp, [], 'backendHealthy')]: observation.backendHealthy,
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
					const { listBlocks } = await import('$/sources/Blockfrost/Rest/queries.ts')

					return (await listBlocks(
						Math.min(resolverContextRowLimit(context), 100)
					)).map((block) => {
						const fields = blockFields(block)

						return {
							[EntityMetaKey.Selector]: {
								$network: network,
								hash: fields.hash,
							},
							[EntityMetaKey.Fields]: {
								[entityFieldAddressKey(EntityType.CardanoBlock, [], 'slot')]: fields.slot,
								[entityFieldAddressKey(EntityType.CardanoBlock, [], 'blockNo')]: fields.blockNo,
								...(fields.epoch != null && {
									[entityFieldAddressKey(EntityType.CardanoBlock, [], 'epoch')]: fields.epoch,
								}),
								...(fields.issuerVkey != null && {
									[entityFieldAddressKey(EntityType.CardanoBlock, [], 'issuerVkey')]: fields.issuerVkey,
								}),
							},
						}
					})
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
					const { listLatestBlockTransactions } = await import('$/sources/Blockfrost/Rest/queries.ts')

					return (await listLatestBlockTransactions(
						Math.min(resolverContextRowLimit(context), 100)
					)).map((hash) => ({
						[EntityMetaKey.Selector]: {
							$network: network,
							hash,
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
					const { listStakePools } = await import('$/sources/Blockfrost/Rest/queries.ts')

					return (await listStakePools(
						Math.min(resolverContextRowLimit(context), 100)
					)).map((poolId) => ({
						[EntityMetaKey.Selector]: {
							$network: network,
							poolId,
						},
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
					const { listDReps } = await import('$/sources/Blockfrost/Rest/queries.ts')

					return (await listDReps(
						Math.min(resolverContextRowLimit(context), 100)
					)).map((dRep) => ({
						[EntityMetaKey.Selector]: {
							$network: network,
							drepCredential: dRep.drep_id,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.CardanoDRep, [], 'credentialKind')]: dRep.has_script ? 'script' : 'key',
							...(dRep.displayName != null && {
								[entityFieldAddressKey(EntityType.CardanoDRep, [], 'displayName')]: dRep.displayName,
							}),
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
					const { listGovernanceProposals } = await import('$/sources/Blockfrost/Rest/queries.ts')
					const {
						page,
						previousLastIdentity,
					} = blockfrostPageContinuation(
						context.providerContinuationToken,
						'governance proposals'
					)
					const limit = Math.min(resolverContextRowLimit(context), 100)
					const proposals = await listGovernanceProposals(
						limit,
						page
					)
					if (new Set(proposals.map(({ tx_hash, cert_index }) => (
						`${tx_hash}:${cert_index.toString()}`
					))).size !== proposals.length)
						throw new Error('Blockfrost_Rest: governance proposals page contains duplicate identities')
					if (
						previousLastIdentity != null
						&& proposals.some(({ tx_hash, cert_index }) => (
							`${tx_hash}:${cert_index.toString()}` === previousLastIdentity
						))
					)
						throw new Error('Blockfrost_Rest: governance proposals continuation did not advance')

					return {
						limit,
						network,
						page,
						proposals,
					}
				}
			),
		})({
			Cardano: {
				$$governanceProposals: {
					select: ({ network, proposals }) => proposals.map((proposal) => ({
						[EntityMetaKey.Selector]: {
							$network: network,
							proposalTxHash: proposal.tx_hash,
							proposalIndex: proposal.cert_index,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'governanceActionId')]: proposal.id,
							[entityFieldAddressKey(EntityType.CardanoGovernanceProposal, [], 'proposalKind')]: proposal.governance_type,
						},
					})),
					continuation: ({ limit, page, proposals }) => (
						proposals.length < limit ?
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
									after: `${proposals.at(-1)?.tx_hash}:${proposals.at(-1)?.cert_index.toString()}`,
									page: (page + 1).toString(),
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
					const { listAssets } = await import('$/sources/Blockfrost/Rest/queries.ts')

					return (await listAssets(
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
						}
					})
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
					const { getLatestProtocolParameters } = await import('$/sources/Blockfrost/Rest/queries.ts')
					const parameters = await getLatestProtocolParameters()

					if (
						parameters.max_val_size != null
						&& !Number.isSafeInteger(Number(parameters.max_val_size))
					)
						throw new Error('Blockfrost_Rest: protocol parameter max value size is malformed')

					return [{
						[EntityMetaKey.Selector]: {
							$network: network,
							epoch: parameters.epoch,
							source: Source.Blockfrost_Rest,
						},
						[EntityMetaKey.Fields]: {
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'minFeeA')]: BigInt(parameters.min_fee_a),
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'minFeeB')]: BigInt(parameters.min_fee_b),
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxBlockBodySize')]: parameters.max_block_size,
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxTxSize')]: parameters.max_tx_size,
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxBlockHeaderSize')]: parameters.max_block_header_size,
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'keyDeposit')]: BigInt(parameters.key_deposit),
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'poolDeposit')]: BigInt(parameters.pool_deposit),
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxEpoch')]: parameters.e_max,
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'nOpt')]: parameters.n_opt,
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'rho')]: parameters.rho.toString(),
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'tau')]: parameters.tau.toString(),
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'decentralisation')]: parameters.decentralisation_param.toString(),
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'protocolMajor')]: parameters.protocol_major_ver,
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'protocolMinor')]: parameters.protocol_minor_ver,
							[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'minPoolCost')]: BigInt(parameters.min_pool_cost),
							...(parameters.coins_per_utxo_size != null && {
								[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'coinsPerUtxoByte')]: BigInt(parameters.coins_per_utxo_size),
							}),
							...((parameters.cost_models_raw != null || parameters.cost_models != null) && {
								[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'costModels')]: parameters.cost_models_raw ?? parameters.cost_models,
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
								[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxValueSize')]: Number(parameters.max_val_size),
							}),
							...(parameters.collateral_percent != null && {
								[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'collateralPercentage')]: parameters.collateral_percent,
							}),
							...(parameters.max_collateral_inputs != null && {
								[entityFieldAddressKey(EntityType.CardanoProtocolParameters_Epoch, [], 'maxCollateralInputs')]: parameters.max_collateral_inputs,
							}),
						},
					}]
				}
				),
		})({
			Cardano: {
				$$protocolParameterEpochs: (parameterEpochs) => parameterEpochs,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			resolve: cardanoNetworkSelectors(
				async (network, context) => {
					assertCardanoMainnet(network)
					const committee = await committeeEpoch(
						network,
						Math.min(resolverContextRowLimit(context), 100)
					)

					return [{
						[EntityMetaKey.Selector]: {
							$network: network,
							epoch: committee.epoch,
							source: Source.Blockfrost_Rest,
						},
						[EntityMetaKey.Fields]: {
							...(committee.govActionId != null && {
								[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'govActionId')]: committee.govActionId,
							}),
							...(committee.$seatingProposal != null && {
								[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], '$seatingProposal')]: committee.$seatingProposal,
							}),
							[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'dissolved')]: committee.dissolved,
							[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'quorumNumerator')]: committee.quorumNumerator,
							[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'quorumDenominator')]: committee.quorumDenominator,
							[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'memberCount')]: committee.memberCount,
							[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], 'members')]: committee.members,
							[entityFieldAddressKey(EntityType.CardanoCommittee_Epoch, [], '$$votes')]: committee.$$votes,
						},
					}]
				}
				),
		})({
			Cardano: {
				$$committeeEpochs: (committeeEpochs) => committeeEpochs,
			},
		}),

		defineResolver({
			entityType: EntityType.CardanoCommittee_Epoch,
			resolve: {
				NetworkEpochSource: {
					appliesTo: [{
						source: Source.Blockfrost_Rest,
					}],
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

		defineResolver({
			entityType: EntityType.CardanoGovernanceProposal,
			resolve: {
				NetworkProposalTxHashProposalIndex: {
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
						const {
							page,
							previousLastIdentity,
						} = blockfrostPageContinuation(
							context.providerContinuationToken,
							'governance proposal votes'
						)
						const limit = Math.min(resolverContextRowLimit(context), 100)
						const [
							proposal,
							epoch,
							votes,
						] = await Promise.all([
							getGovernanceProposal(proposalTxHash, proposalIndex),
							getLatestEpoch(),
							listGovernanceProposalVotes(proposalTxHash, proposalIndex, limit, page),
						])
						if (
							proposal.tx_hash !== proposalTxHash
							|| proposal.cert_index !== proposalIndex
						) throw new Error('Blockfrost_Rest: governance proposal response does not match the subject')
						if (new Set(votes.map(({ tx_hash, cert_index, voter_role, voter }) => (
							`${tx_hash}:${cert_index.toString()}:${voter_role}:${voter}`
						))).size !== votes.length)
							throw new Error('Blockfrost_Rest: governance proposal votes page contains duplicate identities')
						if (
							previousLastIdentity != null
							&& votes.some(({ tx_hash, cert_index, voter_role, voter }) => (
								`${tx_hash}:${cert_index.toString()}:${voter_role}:${voter}` === previousLastIdentity
							))
						)
							throw new Error('Blockfrost_Rest: governance proposal votes continuation did not advance')
						const lastVote = votes.at(-1)

						return {
							limit,
							page,
							lastVoteIdentity: lastVote == null ?
								undefined
							:
								`${lastVote.tx_hash}:${lastVote.cert_index.toString()}:${lastVote.voter_role}:${lastVote.voter}`,
							governanceActionId: proposal.id,
							proposalKind: proposal.governance_type,
							...(proposal.governance_description != null && cardanoGovernanceActionFields(
								proposal.governance_description,
								$network
							)),
							$transaction: {
								$network,
								hash: proposal.tx_hash,
							},
							depositLovelace: BigInt(proposal.deposit),
							returnAddress: proposal.return_address,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$proposal: {
										$network,
										proposalTxHash,
										proposalIndex,
									},
									epoch: epoch.epoch,
									source: Source.Blockfrost_Rest,
								},
								[EntityMetaKey.Fields]: {
									...(proposal.ratified_epoch != null && {
										[entityFieldAddressKey(EntityType.CardanoGovernanceProposal_Timestamp, [], 'ratifiedEpoch')]: proposal.ratified_epoch,
									}),
									...(proposal.enacted_epoch != null && {
										[entityFieldAddressKey(EntityType.CardanoGovernanceProposal_Timestamp, [], 'enactedEpoch')]: proposal.enacted_epoch,
									}),
									...(proposal.dropped_epoch != null && {
										[entityFieldAddressKey(EntityType.CardanoGovernanceProposal_Timestamp, [], 'droppedEpoch')]: proposal.dropped_epoch,
									}),
									...(proposal.expired_epoch != null && {
										[entityFieldAddressKey(EntityType.CardanoGovernanceProposal_Timestamp, [], 'expiredEpoch')]: proposal.expired_epoch,
									}),
									[entityFieldAddressKey(EntityType.CardanoGovernanceProposal_Timestamp, [], 'expirationEpoch')]: proposal.expiration,
								},
							}],
							$$votes: votes.map((vote) => ({
								[EntityMetaKey.Selector]: {
									$proposal: {
										$network,
										proposalTxHash,
										proposalIndex,
									},
									voterKind: vote.voter_role,
									voterCredential: vote.voter,
									voteTxHash: vote.tx_hash,
									source: Source.Blockfrost_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], 'vote')]: vote.vote,
									[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], 'voteIndex')]: vote.cert_index,
									[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], '$transaction')]: {
										[EntityMetaKey.Selector]: {
											$network,
											hash: vote.tx_hash,
										},
									},
									...(vote.voter_role === 'drep' && {
										[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], '$drep')]: {
											[EntityMetaKey.Selector]: {
												$network,
												drepCredential: vote.voter,
											},
										},
									}),
									...(vote.voter_role === 'spo' && {
										[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], '$stakePool')]: {
											[EntityMetaKey.Selector]: {
												$network,
												poolId: vote.voter,
											},
										},
									}),
								},
							})),
						}
					},
				}
			},
		})({
			governanceActionId: (proposal) => proposal.governanceActionId,
			proposalKind: (proposal) => proposal.proposalKind,
			$previousAction: (proposal) => proposal.$previousAction,
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
			$transaction: (proposal) => proposal.$transaction,
			depositLovelace: (proposal) => proposal.depositLovelace,
			returnAddress: (proposal) => proposal.returnAddress,
			$$timestamps: (proposal) => proposal.$$timestamps,
			$$votes: {
				select: (proposal) => proposal.$$votes,
				continuation: ({
					limit,
					page,
					lastVoteIdentity,
					$$votes,
				}, proposal) => (
					$$votes.length < limit || lastVoteIdentity == null ?
						{
							operation: 'cardano-governance-proposal-votes',
							target: `${proposal.proposalTxHash}:${proposal.proposalIndex.toString()}`,
							terminal: true,
						}
					:
						{
							operation: 'cardano-governance-proposal-votes',
							target: `${proposal.proposalTxHash}:${proposal.proposalIndex.toString()}`,
							terminal: false,
							token: new URLSearchParams({
								after: lastVoteIdentity,
								page: (page + 1).toString(),
							}).toString(),
						}
				),
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
						const { getGovernanceProposalMetadata } = await import('$/sources/Blockfrost/Rest/queries.ts')
						const metadata = await getGovernanceProposalMetadata(proposalTxHash, proposalIndex)
						if (
							metadata != null
							&& (
								metadata.tx_hash !== proposalTxHash
								|| metadata.cert_index !== proposalIndex
							)
						) throw new Error('Blockfrost_Rest: governance proposal metadata does not match the subject')

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

		defineResolver({
			entityType: EntityType.CardanoGovernanceProposal_Timestamp,
			resolve: {
				ProposalEpochSource: {
					appliesTo: [{
						source: Source.Blockfrost_Rest,
					}],
					resolve: async ({
						$proposal,
						epoch,
						source,
					}) => {
						assertCardanoMainnet($proposal.$network)
						if (source !== Source.Blockfrost_Rest)
							throw new Error('Blockfrost_Rest: observation source mismatch')

						const {
							getGovernanceProposal,
							getLatestEpoch,
						} = await import('$/sources/Blockfrost/Rest/queries.ts')
						const [
							proposal,
							latestEpoch,
						] = await Promise.all([
							getGovernanceProposal(
								$proposal.proposalTxHash,
								$proposal.proposalIndex
							),
							getLatestEpoch(),
						])
						if (latestEpoch.epoch !== epoch)
							throw new Error('Blockfrost_Rest: historical proposal observation is unavailable')

						return {
							epoch,
							source,
							ratifiedEpoch: proposal.ratified_epoch ?? undefined,
							enactedEpoch: proposal.enacted_epoch ?? undefined,
							droppedEpoch: proposal.dropped_epoch ?? undefined,
							expiredEpoch: proposal.expired_epoch ?? undefined,
							expirationEpoch: proposal.expiration,
						}
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

		defineResolver({
			entityType: EntityType.CardanoDRep,
			resolve: {
				NetworkDrepCredential: {
					resolve: async ({ $network, drepCredential }, context) => {
						assertCardanoMainnet($network)
						const {
							listDRepVotes,
						} = await import('$/sources/Blockfrost/Rest/queries.ts')
						const [
							observation,
							votes,
						] = await Promise.all([
							dRepObservation(drepCredential),
							listDRepVotes(drepCredential, Math.min(resolverContextRowLimit(context), 100)),
						])
						return {
							credentialKind: observation.credentialKind,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$drep: {
										$network,
										drepCredential,
									},
									epoch: observation.epoch,
									source: Source.Blockfrost_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.CardanoDRep_Timestamp, [], 'votingPowerLovelace')]: observation.votingPowerLovelace,
									[entityFieldAddressKey(EntityType.CardanoDRep_Timestamp, [], 'active')]: observation.active,
									[entityFieldAddressKey(EntityType.CardanoDRep_Timestamp, [], 'registered')]: observation.registered,
								},
							}],
							$$votes: votes.map((vote) => ({
								[EntityMetaKey.Selector]: {
									$proposal: {
										$network,
										proposalTxHash: vote.proposal_tx_hash,
										proposalIndex: vote.proposal_cert_index,
									},
									voterKind: 'drep',
									voterCredential: drepCredential,
									voteTxHash: vote.tx_hash,
									source: Source.Blockfrost_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], 'vote')]: vote.vote,
									[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], 'voteIndex')]: vote.cert_index,
									[entityFieldAddressKey(EntityType.CardanoGovernanceVote, [], '$drep')]: {
										[EntityMetaKey.Selector]: {
											$network,
											drepCredential,
										},
									},
								},
							})),
						}
					},
				}
			},
		})({
			credentialKind: (drep) => drep.credentialKind,
			$$timestamps: (drep) => drep.$$timestamps,
			$$votes: (drep) => drep.$$votes,
		}),

		defineResolver({
			entityType: EntityType.CardanoDRep,
			resolve: {
				NetworkDrepCredential: {
					resolve: async ({ $network, drepCredential }) => {
						assertCardanoMainnet($network)
						const { getDRepMetadata } = await import('$/sources/Blockfrost/Rest/queries.ts')
						const metadata = await getDRepMetadata(drepCredential)
						return {
							displayName: metadata?.displayName,
							anchorUrl: metadata?.url,
							anchorHash: metadata?.hash,
						}
					},
				},
			},
		})({
			displayName: (drep) => drep.displayName,
			anchorUrl: (drep) => drep.anchorUrl,
			anchorHash: (drep) => drep.anchorHash,
		}),

		defineResolver({
			entityType: EntityType.CardanoStakePool,
			resolve: {
				NetworkPoolId: {
					resolve: async ({ $network, poolId }) => {
						assertCardanoMainnet($network)
						const {
							getStakePool,
						} = await import('$/sources/Blockfrost/Rest/queries.ts')
						const pool = await getStakePool(poolId)
						if (pool.pool_id !== poolId)
							throw new Error('Blockfrost_Rest: stake pool response does not match the subject')

						return pool
					},
				}
			},
		})({
			vrfKeyHash: (pool) => pool.vrf_key,
		}),

		defineResolver({
			entityType: EntityType.CardanoStakePool,
			resolve: {
				NetworkPoolId: {
					resolve: async ({ $network, poolId }) => {
						assertCardanoMainnet($network)
						const observation = await stakePoolObservation(poolId)

						return {
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$pool: {
										$network,
										poolId,
									},
									epoch: observation.epoch,
									source: Source.Blockfrost_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'pledge')]: observation.pledge,
									[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'margin')]: observation.margin,
									[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'fixedCostLovelace')]: observation.fixedCostLovelace,
									[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'rewardAccount')]: observation.rewardAccount,
									[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'owners')]: observation.owners,
									[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'liveStake')]: observation.liveStake,
									[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'activeStake')]: observation.activeStake,
									[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'delegatorCount')]: observation.delegatorCount,
									[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'blockCount')]: observation.blockCount,
									[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'saturation')]: observation.saturation,
									[entityFieldAddressKey(EntityType.CardanoStakePool_Timestamp, [], 'retired')]: observation.retired,
								},
							}],
						}
					},
				},
			},
		})({
			$$timestamps: (pool) => pool.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.CardanoStakePool,
			resolve: {
				NetworkPoolId: {
					resolve: async ({ $network, poolId }) => {
						assertCardanoMainnet($network)
						const { getStakePoolMetadata } = await import('$/sources/Blockfrost/Rest/queries.ts')
						const metadata = await getStakePoolMetadata(poolId)
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

		defineResolver({
			entityType: EntityType.CardanoNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					appliesTo: [{
						source: Source.Blockfrost_Rest,
					}],
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

		defineResolver({
			entityType: EntityType.CardanoNativeAsset,
			resolve: {
				NetworkPolicyIdAssetName: {
					resolve: async ({
						$network,
						policyId,
						assetName,
					}) => {
						assertCardanoMainnet($network)
						const observation = await nativeAssetObservation(policyId, assetName)

						return {
							fingerprint: observation.fingerprint,
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$asset: {
										$network,
										policyId,
										assetName,
									},
									slot: observation.slot,
									source: Source.Blockfrost_Rest,
								},
								[EntityMetaKey.Fields]: {
									[entityFieldAddressKey(EntityType.CardanoNativeAsset_Timestamp, [], 'timestampMs')]: observation.timestampMs,
									[entityFieldAddressKey(EntityType.CardanoNativeAsset_Timestamp, [], 'blockHash')]: observation.blockHash,
									[entityFieldAddressKey(EntityType.CardanoNativeAsset_Timestamp, [], 'supply')]: observation.supply,
									[entityFieldAddressKey(EntityType.CardanoNativeAsset_Timestamp, [], 'transactionCount')]: observation.transactionCount,
									...(observation.metadata != null && {
										[entityFieldAddressKey(EntityType.CardanoNativeAsset_Timestamp, [], 'metadata')]: observation.metadata,
									}),
								},
							}],
						}
					},
				},
			},
		})({
			fingerprint: (asset) => asset.fingerprint,
			$$timestamps: (asset) => asset.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.CardanoNativeAsset_Timestamp,
			resolve: {
				AssetSlotSource: {
					appliesTo: [{
						source: Source.Blockfrost_Rest,
					}],
					resolve: async ({
						$asset,
						slot,
						source,
					}) => {
						assertCardanoMainnet($asset.$network)
						if (source !== Source.Blockfrost_Rest)
							throw new Error('Blockfrost_Rest: observation source mismatch')

						const observation = await nativeAssetObservation($asset.policyId, $asset.assetName)
						if (observation.slot !== slot)
							throw new Error('Blockfrost_Rest: historical asset observation is unavailable')

						return observation
					},
				},
			},
		})({
			timestampMs: (observation) => observation.timestampMs,
			blockHash: (observation) => observation.blockHash,
			supply: (observation) => observation.supply,
			transactionCount: (observation) => observation.transactionCount,
			metadata: (observation) => observation.metadata,
		}),

		defineResolver({
			entityType: EntityType.CardanoStakePool_Timestamp,
			resolve: {
				PoolEpochSource: {
					appliesTo: [{
						source: Source.Blockfrost_Rest,
					}],
					resolve: async ({
						$pool,
						epoch,
						source,
					}) => {
						assertCardanoMainnet($pool.$network)
						if (source !== Source.Blockfrost_Rest)
							throw new Error('Blockfrost_Rest: observation source mismatch')

						const observation = await stakePoolObservation($pool.poolId)
						if (observation.epoch !== epoch)
							throw new Error('Blockfrost_Rest: historical stake pool observation is unavailable')

						return observation
					},
				},
			},
		})({
			pledge: (observation) => observation.pledge,
			margin: (observation) => observation.margin,
			fixedCostLovelace: (observation) => observation.fixedCostLovelace,
			rewardAccount: (observation) => observation.rewardAccount,
			owners: (observation) => observation.owners,
			liveStake: (observation) => observation.liveStake,
			activeStake: (observation) => observation.activeStake,
			delegatorCount: (observation) => observation.delegatorCount,
			blockCount: (observation) => observation.blockCount,
			saturation: (observation) => observation.saturation,
			retired: (observation) => observation.retired,
		}),

		defineResolver({
			entityType: EntityType.CardanoDRep_Timestamp,
			resolve: {
				DrepEpochSource: {
					appliesTo: [{
						source: Source.Blockfrost_Rest,
					}],
					resolve: async ({
						$drep,
						epoch,
						source,
					}) => {
						assertCardanoMainnet($drep.$network)
						if (source !== Source.Blockfrost_Rest)
							throw new Error('Blockfrost_Rest: observation source mismatch')

						const observation = await dRepObservation($drep.drepCredential)
						if (observation.epoch !== epoch)
							throw new Error('Blockfrost_Rest: historical DRep observation is unavailable')

						return observation
					},
				},
			},
		})({
			votingPowerLovelace: (observation) => observation.votingPowerLovelace,
			active: (observation) => observation.active,
			registered: (observation) => observation.registered,
		}),

		defineResolver({
			entityType: EntityType.CardanoStakeCredential,
			resolve: {
				NetworkCredential: {
					resolve: async ({
						$network,
						credential,
					}) => {
						assertCardanoMainnet($network)
						const {
							getAccount,
							getLatestEpoch,
						} = await import('$/sources/Blockfrost/Rest/queries.ts')
						const [
							account,
							epoch,
						] = await Promise.all([
							getAccount(credential),
							getLatestEpoch(),
						])
						if (account.stake_address !== credential)
							throw new Error('Blockfrost_Rest: stake account response does not match the subject')

						return {
							rewardAddress: account.stake_address,
							$$delegationEpochs: [{
								[EntityMetaKey.Selector]: {
									$stakeCredential: {
										$network,
										credential,
									},
									epoch: epoch.epoch,
									source: Source.Blockfrost_Rest,
								},
								[EntityMetaKey.Fields]: {
									...(account.pool_id != null && {
										[entityFieldAddressKey(EntityType.CardanoStakeDelegation_Epoch, [], '$stakePool')]: {
											[EntityMetaKey.Selector]: {
												$network,
												poolId: account.pool_id,
											},
										},
									}),
									...(account.drep_id != null && {
										[entityFieldAddressKey(EntityType.CardanoStakeDelegation_Epoch, [], '$drep')]: {
											[EntityMetaKey.Selector]: {
												$network,
												drepCredential: account.drep_id,
											},
										},
									}),
									[entityFieldAddressKey(EntityType.CardanoStakeDelegation_Epoch, [], 'activeStake')]: BigInt(account.controlled_amount),
									[entityFieldAddressKey(EntityType.CardanoStakeDelegation_Epoch, [], 'rewardAmount')]: BigInt(account.rewards_sum),
									[entityFieldAddressKey(EntityType.CardanoStakeDelegation_Epoch, [], 'withdrawalAmount')]: BigInt(account.withdrawals_sum),
									[entityFieldAddressKey(EntityType.CardanoStakeDelegation_Epoch, [], 'registered')]: account.registered,
									[entityFieldAddressKey(EntityType.CardanoStakeDelegation_Epoch, [], 'deregistered')]: !account.registered,
								},
							}],
						}
					},
				},
			},
		})({
			rewardAddress: (account) => account.rewardAddress,
			$$delegationEpochs: (account) => account.$$delegationEpochs,
		}),

		defineResolver({
			entityType: EntityType.CardanoStakeCredential,
			resolve: {
				NetworkCredential: {
					resolve: async ({
						$network,
						credential,
					}, context) => {
						assertCardanoMainnet($network)
						const limit = Math.min(resolverContextRowLimit(context), 100)
						const page = context.providerContinuationToken == null ?
							1
						:
							Number(context.providerContinuationToken)
						if (!Number.isSafeInteger(page) || page < 1)
							throw new Error('Blockfrost_Rest: invalid stake credential address continuation')

						const { listAccountAddresses } = await import('$/sources/Blockfrost/Rest/queries.ts')

						return {
							limit,
							page,
							addresses: await listAccountAddresses(
								credential,
								limit,
								page
							),
						}
					},
				},
			},
		})({
			$$addresses: {
				select: (page, stakeCredential) => page.addresses.map(({ address }) => ({
					[EntityMetaKey.Selector]: {
						$network: stakeCredential.$network,
						address,
					},
				})),
				continuation: (page, stakeCredential) => (
					page.addresses.length < page.limit ?
						{
							operation: 'stake-credential-addresses',
							target: stakeCredential.credential,
							terminal: true,
						}
					:
						{
							operation: 'stake-credential-addresses',
							target: stakeCredential.credential,
							terminal: false,
							token: (page.page + 1).toString(),
						}
				),
			},
		}),

		defineResolver({
			entityType: EntityType.CardanoBlock,
			resolve: {
				NetworkHash: {
					resolve: async ({ $network, hash }) => {
						assertCardanoMainnet($network)
						const { getBlock } = await import('$/sources/Blockfrost/Rest/queries.ts')
						const block = blockFields(await getBlock(hash))
						if (block.hash !== hash)
							throw new Error('Blockfrost_Rest: block hash does not match the requested selector')

						return block
					},
				},
				NetworkSlot: {
					resolve: async ({ $network, slot }) => {
						assertCardanoMainnet($network)
						const { getBlock } = await import('$/sources/Blockfrost/Rest/queries.ts')
						const block = blockFields(await getBlock(slot.toString()))
						if (block.slot !== slot)
							throw new Error('Blockfrost_Rest: block slot does not match the requested selector')

						return block
					},
				},
				NetworkBlockNo: {
					resolve: async ({ $network, blockNo }) => {
						assertCardanoMainnet($network)
						const { getBlock } = await import('$/sources/Blockfrost/Rest/queries.ts')
						const block = blockFields(await getBlock(blockNo.toString()))
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
			issuerVkey: (block) => block.issuerVkey,
		}),
	],
} satisfies RegisteredSourceResolverModule

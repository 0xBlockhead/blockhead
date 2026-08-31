import {
	EvmInternalCallType,
	EvmTokenStandard,
	EvmTransactionExecutionStatus,
} from '$/constants/Evm.ts'
import {
	hexLowerOfByteSize,
	with0xHex,
} from '$/lib/hexLowerOfByteSize.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { evmChainIdFromNetworkSelector, evmNetworkSelectorFromChainId } from '$/resolvers/evm.ts'
import {
	evmTokenApprovalEntityFromLog,
	evmTokenApprovalReference,
} from '$/resolvers/evmTokenApproval.ts'
import {
	resolverContextRowLimit,
	type ResolverContext,
} from '$/resolvers/$resolvers.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type Entity,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type {
	GoldRushInternalTransfer,
	GoldRushLogEvent,
	GoldRushTokenBalanceItem,
	GoldRushTokenBalancesData,
	GoldRushTransactionItem,
} from '$/sources/Covalent/GoldRush/Rest/types.ts'
import { Source } from '$/sources/Source.ts'

const erc20OrErc721TransferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
const erc1155TransferSingleTopic = '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62'

const addressFromTopic = (topic: `0x${string}` | undefined) => (
	topic != null && /^0x0{24}[0-9a-f]{40}$/.test(topic) ?
		hexLowerOfByteSize(`0x${topic.slice(-40)}`, 20)
	:
		undefined
)

const evmTokenTransferEntitiesFromLog = ({
	$log,
	topics,
	data,
	emitterAddress,
}: {
	$log: Entity<typeof schema, EntityType.EvmLog>[typeof EntityMetaKey.Selector]
	topics: readonly `0x${string}`[]
	data: `0x${string}`
	emitterAddress: `0x${string}` | undefined
}) => {
	if (emitterAddress == null)
		return []

	const $network = $log.$transaction.$network
	const $tokenContract = {
		[EntityMetaKey.Selector]: {
			$network,
			address: emitterAddress,
		},
	}
	const transfer = (
		topics.at(0) === erc20OrErc721TransferTopic && topics.length === 3 && /^0x[0-9a-f]{64}$/.test(data) ?
			{
				standard: EvmTokenStandard.Erc20,
				amount: BigInt(data),
				fromAddress: addressFromTopic(topics.at(1)),
				toAddress: addressFromTopic(topics.at(2)),
			}
		: topics.at(0) === erc20OrErc721TransferTopic && topics.length === 4 && data === '0x' ?
			{
				standard: EvmTokenStandard.Erc721,
				amount: 1n,
				tokenId: BigInt(topics[3]),
				fromAddress: addressFromTopic(topics.at(1)),
				toAddress: addressFromTopic(topics.at(2)),
			}
		: topics.at(0) === erc1155TransferSingleTopic && topics.length === 4 && /^0x[0-9a-f]{128}$/.test(data) ?
			{
				standard: EvmTokenStandard.Erc1155,
				amount: BigInt(`0x${data.slice(66)}`),
				tokenId: BigInt(`0x${data.slice(2, 66)}`),
				fromAddress: addressFromTopic(topics.at(2)),
				toAddress: addressFromTopic(topics.at(3)),
			}
		:
			undefined
	)
	if (transfer == null)
		return []

	return [{
		[EntityMetaKey.Selector]: {
			$log,
			indexInLog: 0,
		},
		$log: {
			[EntityMetaKey.Selector]: $log,
		},
		standard: transfer.standard,
		amount: transfer.amount,
		...(transfer.tokenId != null && { tokenId: transfer.tokenId }),
		...(transfer.fromAddress != null && {
			$from: {
				[EntityMetaKey.Selector]: { address: transfer.fromAddress },
			},
		}),
		...(transfer.toAddress != null && {
			$to: {
				[EntityMetaKey.Selector]: { address: transfer.toAddress },
			},
		}),
		$tokenContract,
		...(transfer.standard === EvmTokenStandard.Erc20 && {
			$coinInstance: {
				[EntityMetaKey.Selector]: {
					$network,
					type: CoinInstanceType.Erc20Token,
					$contract: {
						$network,
						address: emitterAddress,
					},
				},
			},
		}),
	}]
}

const evmTokenTransferReference = (
	transfer: ReturnType<typeof evmTokenTransferEntitiesFromLog>[number]
) => ({
	[EntityMetaKey.Selector]: transfer[EntityMetaKey.Selector],
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$log')]: transfer.$log,
		[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'standard')]: transfer.standard,
		[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], 'amount')]: transfer.amount,
		...(transfer.tokenId != null && {
			[entityFieldAddressKey(EntityType.EvmTokenTransfer, ['Nft'], 'tokenId')]: transfer.tokenId,
		}),
		...(transfer.$from != null && {
			[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$from')]: transfer.$from,
		}),
		...(transfer.$to != null && {
			[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$to')]: transfer.$to,
		}),
		[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$tokenContract')]: transfer.$tokenContract,
		...(transfer.$coinInstance != null && {
			[entityFieldAddressKey(EntityType.EvmTokenTransfer, [], '$coinInstance')]: transfer.$coinInstance,
		}),
	},
})


const nonnegativeBigInt = (
	value: string
) => {
	const parsed = BigInt(value)
	if (parsed < 0n)
		throw new Error(`GoldRushFoundational_Rest: expected nonnegative integer, received ${String(value)}`)

	return parsed
}

const nonnegativeSafeBigInt = (
	value: number
) => {
	if (!Number.isSafeInteger(value) || value < 0)
		throw new Error(`GoldRushFoundational_Rest: expected nonnegative safe integer, received ${String(value)}`)

	return BigInt(value)
}

const goldRushChainForNetwork = (
	network: EntitySelector<typeof schema, EntityType.Network>
) => {
	const chainId = evmChainIdFromNetworkSelector(network)
	return {
		chainId,
		$network: evmNetworkSelectorFromChainId(chainId),
	}
}

const goldRushAccountTransactionPage = (
	context: ResolverContext
) => {
	const page = context.providerContinuationToken == null ?
		0
	:
		Number(context.providerContinuationToken)
	if (!Number.isSafeInteger(page) || page < 0)
		throw new Error('GoldRushFoundational_Rest: invalid transaction page continuation')

	return page
}

const timestampMsFromGoldRushIso = (
	value: string,
	label: string
) => {
	const timestampMs = Date.parse(value)
	if (!Number.isFinite(timestampMs) || timestampMs < 0)
		throw new Error(`GoldRushFoundational_Rest: invalid ${label}`)

	return timestampMs
}

const goldRushBalanceObservation = (
	balance: GoldRushTokenBalanceItem,
	balances: GoldRushTokenBalancesData,
	actorCoin: EntitySelector<typeof schema, EntityType.EvmNetworkActorCoinBalance>
) => {
	const timestampMs = timestampMsFromGoldRushIso(balances.updated_at, 'balance updated_at')
	return {
		[EntityMetaKey.Selector]: {
			$actorCoin: actorCoin,
			timestampMs,
			source: Source.GoldRushFoundational_Rest,
		},
		blockNumber: nonnegativeSafeBigInt(balance.block_height),
		balance: nonnegativeBigInt(balance.balance),
		...(balance.quote != null && Number.isFinite(balance.quote) && {
			usdValue: balance.quote,
		}),
		...(balance.quote_rate != null && Number.isFinite(balance.quote_rate) && {
			priceUsd: balance.quote_rate,
		}),
	}
}

const goldRushLogEntity = (
	log: GoldRushLogEvent,
	$network: EntitySelector<typeof schema, EntityType.Network>,
	txHash: `0x${string}`
) => {
	const topics = log.raw_log_topics.flatMap((topic) => {
		const hex = hexLowerOfByteSize(topic, 32)
		return hex == null ? [] : [hex]
	})
	if (topics.length !== log.raw_log_topics.length)
		throw new Error('GoldRushFoundational_Rest: invalid log topic')

	const emitterAddress = hexLowerOfByteSize(log.sender_address, 20)
	if (emitterAddress == null)
		throw new Error('GoldRushFoundational_Rest: invalid log emitter')

	const logSelector = {
		$transaction: {
			$network,
			txHash,
		},
		indexInTransaction: log.log_offset,
	}
	const data = log.raw_log_data == null ? '0x' : with0xHex(log.raw_log_data)
	const $tokenApproval = evmTokenApprovalEntityFromLog({
		$log: logSelector,
		topics,
		data,
		emitterAddress,
	})
	const $$tokenTransfers = evmTokenTransferEntitiesFromLog({
		$log: logSelector,
		topics,
		data,
		emitterAddress,
	})

	return {
		[EntityMetaKey.Selector]: logSelector,
		$transaction: {
			[EntityMetaKey.Selector]: {
				$network,
				txHash,
			},
		} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
		$block: {
			[EntityMetaKey.Selector]: {
				$network,
				blockNumber: nonnegativeSafeBigInt(log.block_height),
			},
		} satisfies Entity<typeof schema, EntityType.EvmBlock>,
		$$topics: topics.map((hex) => ({
			[EntityMetaKey.Selector]: {
				hex,
			},
		} satisfies Entity<typeof schema, EntityType.EvmTopic>)),
		topic0: topics[0],
		...(log.raw_log_data != null && {
			data: with0xHex(log.raw_log_data),
		}),
		$emitter: {
			[EntityMetaKey.Selector]: {
				$network,
				address: emitterAddress,
			},
		} satisfies Entity<typeof schema, EntityType.EvmContract>,
		...($tokenApproval != null && {
			$tokenApproval,
		}),
		$$tokenTransfers,
	}
}

const goldRushInternalTransferEntity = (
	transfer: GoldRushInternalTransfer,
	indexInTransaction: number,
	$network: EntitySelector<typeof schema, EntityType.Network>,
	txHash: `0x${string}`
) => {
	const fromAddress = hexLowerOfByteSize(transfer.from_address, 20)
	const toAddress = transfer.to_address == null ? undefined : hexLowerOfByteSize(transfer.to_address, 20)
	if (fromAddress == null)
		throw new Error('GoldRushFoundational_Rest: invalid internal transfer from address')
	if (transfer.to_address != null && toAddress == null)
		throw new Error('GoldRushFoundational_Rest: invalid internal transfer to address')

	return {
		[EntityMetaKey.Selector]: {
			$transaction: {
				$network,
				txHash,
			},
			indexInTransaction,
		},
		$transaction: {
			[EntityMetaKey.Selector]: {
				$network,
				txHash,
			},
		} satisfies Entity<typeof schema, EntityType.EvmTransaction>,
		$from: {
			[EntityMetaKey.Selector]: {
				address: fromAddress,
			},
		} satisfies Entity<typeof schema, EntityType.EvmAccount>,
		...(toAddress != null && {
			$to: {
				[EntityMetaKey.Selector]: {
					address: toAddress,
				},
			} satisfies Entity<typeof schema, EntityType.EvmAccount>,
		}),
		value: nonnegativeBigInt(transfer.value),
		// GoldRush internal_transfers omit CALL/CREATE opcode; Unknown is the honest bucket.
		callType: EvmInternalCallType.Unknown,
	}
}

const goldRushTransactionNonce = (
	transaction: GoldRushTransactionItem,
	fromAddress: `0x${string}`
) => {
	const stateChange = transaction.state_changes?.find((change) => (
		change.address.toLowerCase() === fromAddress
	))
	return (
		stateChange != null
		&& Number.isSafeInteger(stateChange.nonce_before)
		&& stateChange.nonce_before >= 0
	) ?
		stateChange.nonce_before
	:
		undefined
}


export default {
	source: Source.GoldRushFoundational_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmTransaction,
			resolve: {
				EvmNetworkTxHash: {
					resolve: async ({ $network, txHash }) => {
						const { getTransaction, goldRushChainName } = await import('$/sources/Covalent/GoldRush/Rest/queries.ts')
						const { chainId, $network: network } = goldRushChainForNetwork($network)
						const normalizedTxHash = hexLowerOfByteSize(txHash, 32)
						if (normalizedTxHash == null)
							throw new Error('GoldRushFoundational_Rest: invalid transaction hash')

						const transaction = (await getTransaction({
							chainId,
							chainName: goldRushChainName(chainId),
							txHash: normalizedTxHash,
							expansions: {
								withInternal: true,
								withState: true,
							},
						})).items[0]
						const fromAddress = hexLowerOfByteSize(transaction.from_address, 20)
						const toAddress = transaction.to_address == null ? undefined : hexLowerOfByteSize(transaction.to_address, 20)
						if (fromAddress == null)
							throw new Error('GoldRushFoundational_Rest: transaction has an invalid from address')
						if (transaction.to_address != null && toAddress == null)
							throw new Error('GoldRushFoundational_Rest: transaction has an invalid to address')

						const nonce = goldRushTransactionNonce(transaction, fromAddress)
						const internalTransfers = transaction.internal_transfers ?? []

						return {
							$block: {
								[EntityMetaKey.Selector]: {
									$network: network,
									blockNumber: BigInt(transaction.block_height),
								},
							} satisfies Entity<typeof schema, EntityType.EvmBlock>,
							indexInBlock: transaction.tx_offset,
							$from: {
								[EntityMetaKey.Selector]: {
									address: fromAddress,
								},
							} satisfies Entity<typeof schema, EntityType.EvmAccount>,
							...(toAddress != null && {
								$to: {
									[EntityMetaKey.Selector]: {
										address: toAddress,
									},
								} satisfies Entity<typeof schema, EntityType.EvmAccount>,
							}),
							value: nonnegativeBigInt(transaction.value),
							...(nonce != null && {
								nonce,
							}),
							gas: nonnegativeSafeBigInt(transaction.gas_offered),
							gasPrice: nonnegativeSafeBigInt(transaction.gas_price),
							gasUsed: nonnegativeSafeBigInt(transaction.gas_spent),
							executionStatus: transaction.successful ?
								EvmTransactionExecutionStatus.Success
							:
								EvmTransactionExecutionStatus.Failed,
							$$logs: transaction.log_events.map((log) => (
								goldRushLogEntity(log, network, normalizedTxHash)
							)),
							$$internalTransfers: internalTransfers.map((transfer, indexInTransaction) => (
								goldRushInternalTransferEntity(transfer, indexInTransaction, network, normalizedTxHash)
							)),
						}
					},
				},
			},
		})({
			$block: (transaction) => transaction.$block,
			indexInBlock: (transaction) => transaction.indexInBlock,
			$from: (transaction) => transaction.$from,
			$to: (transaction) => transaction.$to,
			value: (transaction) => transaction.value,
			nonce: (transaction) => transaction.nonce,
			gas: (transaction) => transaction.gas,
			gasPrice: (transaction) => transaction.gasPrice,
			gasUsed: (transaction) => transaction.gasUsed,
			executionStatus: (transaction) => transaction.executionStatus,
			$$logs: {
				select: (transaction) => transaction.$$logs.map((log) => ({
					[EntityMetaKey.Selector]: log[EntityMetaKey.Selector],
				})),
				resolveCount: (transaction) => transaction.$$logs.length,
			},
			$$tokenApprovals: {
				select: (transaction) => transaction.$$logs.flatMap((log) => (
					log.$tokenApproval == null ?
						[]
					:
						[evmTokenApprovalReference(log.$tokenApproval)]
				)),
				resolveCount: (transaction) => transaction.$$logs.filter((log) => log.$tokenApproval != null).length,
			},
			$$tokenTransfers: {
				select: (transaction) => transaction.$$logs.flatMap((log) => log.$$tokenTransfers.map(evmTokenTransferReference)),
				resolveCount: (transaction) => transaction.$$logs.reduce((count, log) => count + log.$$tokenTransfers.length, 0),
			},
			$$internalTransfers: {
				select: (transaction) => transaction.$$internalTransfers.map((transfer) => ({
					[EntityMetaKey.Selector]: transfer[EntityMetaKey.Selector],
				})),
				resolveCount: (transaction) => transaction.$$internalTransfers.length,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmLog,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async ({ $transaction, indexInTransaction }) => {
						const { getTransaction, goldRushChainName } = await import('$/sources/Covalent/GoldRush/Rest/queries.ts')
						const { chainId, $network: network } = goldRushChainForNetwork($transaction.$network)
						const txHash = hexLowerOfByteSize($transaction.txHash, 32)
						if (txHash == null)
							throw new Error('GoldRushFoundational_Rest: invalid transaction hash')
						if (!Number.isSafeInteger(indexInTransaction) || indexInTransaction < 0)
							throw new Error('GoldRushFoundational_Rest: invalid log index')

						const log = (await getTransaction({
							chainId,
							chainName: goldRushChainName(chainId),
							txHash,
						})).items[0].log_events.find((candidate) => (
							candidate.log_offset === indexInTransaction
						))
						if (log == null)
							throw new Error('GoldRushFoundational_Rest: receipt log not found for EvmLog')

						return goldRushLogEntity(log, network, txHash)
					},
				},
			},
		})({
			$transaction: (log) => log.$transaction,
			indexInTransaction: (log) => log[EntityMetaKey.Selector].indexInTransaction,
			$block: (log) => log.$block,
			$$topics: {
				select: (log) => log.$$topics,
				resolveCount: (log) => log.$$topics.length,
			},
			topic0: (log) => log.topic0,
			data: (log) => log.data,
			$emitter: (log) => log.$emitter,
			Event: {
				signatureHash: (log) => {
					if (log.topic0 == null)
						throw new Error('GoldRushFoundational_Rest: event log is missing topic 0')

					return log.topic0
				},
				TokenApproval: {
					$tokenApproval: (log) => {
						if (log.$tokenApproval == null)
							throw new Error('GoldRushFoundational_Rest: approval event has invalid topics or data')

						return log.$tokenApproval
					},
				},
				TokenTransfer: {
					$$tokenTransfers: {
						select: (log) => log.$$tokenTransfers.map(evmTokenTransferReference),
						resolveCount: (log) => log.$$tokenTransfers.length,
					},
				},
			},
		}),

		defineResolver({
			entityType: EntityType.EvmTokenApproval,
			resolve: {
				Log: {
					resolve: async ({ $log }) => {
						const { getTransaction, goldRushChainName } = await import('$/sources/Covalent/GoldRush/Rest/queries.ts')
						const { chainId, $network: network } = goldRushChainForNetwork($log.$transaction.$network)
						const txHash = hexLowerOfByteSize($log.$transaction.txHash, 32)
						if (txHash == null)
							throw new Error('GoldRushFoundational_Rest: invalid transaction hash')
						const log = (await getTransaction({
							chainId,
							chainName: goldRushChainName(chainId),
							txHash,
						})).items[0].log_events.find((candidate) => (
							candidate.log_offset === $log.indexInTransaction
						))
						if (log == null)
							throw new Error('GoldRushFoundational_Rest: receipt log not found for EvmTokenApproval')

						const approval = goldRushLogEntity(log, network, txHash).$tokenApproval
						if (approval == null)
							throw new Error('GoldRushFoundational_Rest: receipt log is not an exact token approval')

						return approval
					},
				},
			},
		})({
			$log: (approval) => approval.$log,
			$tokenContract: (approval) => approval.$tokenContract,
			$owner: (approval) => approval.$owner,
			$approvedActor: (approval) => approval.$approvedActor,
			approvalKind: (approval) => approval.approvalKind,
			standard: (approval) => approval.standard,
			Allowance: {
				amount: (approval) => approval.amount,
			},
			Token: {
				tokenId: (approval) => approval.tokenId,
			},
			Operator: {
				approved: (approval) => approval.approved,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmTokenTransfer,
			resolve: {
				LogIndexInLog: {
					resolve: async ({ $log, indexInLog }) => {
						const { getTransaction, goldRushChainName } = await import('$/sources/Covalent/GoldRush/Rest/queries.ts')
						const { chainId, $network: network } = goldRushChainForNetwork($log.$transaction.$network)
						const txHash = hexLowerOfByteSize($log.$transaction.txHash, 32)
						if (txHash == null)
							throw new Error('GoldRushFoundational_Rest: invalid transaction hash')
						const log = (await getTransaction({
							chainId,
							chainName: goldRushChainName(chainId),
							txHash,
						})).items[0].log_events.find((candidate) => (
							candidate.log_offset === $log.indexInTransaction
						))
						if (log == null)
							throw new Error('GoldRushFoundational_Rest: receipt log not found for EvmTokenTransfer')

						const transfer = goldRushLogEntity(log, network, txHash).$$tokenTransfers.at(indexInLog)
						if (transfer == null)
							throw new Error('GoldRushFoundational_Rest: receipt log is not an exact token transfer')

						return transfer
					},
				},
			},
		})({
			$log: (transfer) => transfer.$log,
			standard: (transfer) => transfer.standard,
			indexInLog: (transfer) => transfer[EntityMetaKey.Selector].indexInLog,
			$from: (transfer) => transfer.$from,
			$to: (transfer) => transfer.$to,
			$tokenContract: (transfer) => transfer.$tokenContract,
			$coinInstance: (transfer) => transfer.$coinInstance,
			amount: (transfer) => transfer.amount,
			Nft: {
				tokenId: (transfer) => {
					if (transfer.tokenId == null)
						throw new Error('GoldRushFoundational_Rest: NFT transfer is missing token id')

					return transfer.tokenId
				},
			},
		}),

		defineResolver({
			entityType: EntityType.EvmInternalTransfer,
			resolve: {
				TransactionIndexInTransaction: {
					resolve: async ({ $transaction, indexInTransaction }) => {
						const { getTransaction, goldRushChainName } = await import('$/sources/Covalent/GoldRush/Rest/queries.ts')
						const { chainId, $network: network } = goldRushChainForNetwork($transaction.$network)
						const txHash = hexLowerOfByteSize($transaction.txHash, 32)
						if (txHash == null)
							throw new Error('GoldRushFoundational_Rest: invalid transaction hash')
						if (!Number.isSafeInteger(indexInTransaction) || indexInTransaction < 0)
							throw new Error('GoldRushFoundational_Rest: invalid internal transfer index')

						const transfers = (await getTransaction({
							chainId,
							chainName: goldRushChainName(chainId),
							txHash,
							expansions: {
								withInternal: true,
							},
						})).items[0].internal_transfers ?? []
							const transfer = transfers.at(indexInTransaction)
						if (transfer == null)
							throw new Error('GoldRushFoundational_Rest: internal transfer not found')

						return goldRushInternalTransferEntity(transfer, indexInTransaction, network, txHash)
					},
				},
			},
		})({
			$transaction: (transfer) => transfer.$transaction,
			indexInTransaction: (transfer) => transfer[EntityMetaKey.Selector].indexInTransaction,
			$from: (transfer) => transfer.$from,
			$to: (transfer) => transfer.$to,
			value: (transfer) => transfer.value,
			callType: (transfer) => transfer.callType,
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }, context) => {
						const {
							getTokenBalances,
							goldRushChainName,
						} = await import('$/sources/Covalent/GoldRush/Rest/queries.ts')
						const { chainId, $network: network } = goldRushChainForNetwork($network)
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('GoldRushFoundational_Rest: invalid account address')

						type EvmNetworkActorCoinBalanceEntitySelector = EntitySelector<
							typeof schema,
							EntityType.EvmNetworkActorCoinBalance
						>

						const skip = (
							context.providerContinuationToken == null ?
								0
							:
								Number(context.providerContinuationToken)
						)
						if (!Number.isSafeInteger(skip) || skip < 0)
							throw new Error('GoldRushFoundational_Rest: invalid owned-coins offset continuation')

						const balances = await getTokenBalances({
							chainId,
							chainName: goldRushChainName(chainId),
							address,
						})
						const limit = resolverContextRowLimit(context)
						const rows = (
							balances.items
								.slice(skip, skip + limit)
								.flatMap<{ [EntityMetaKey.Selector]: EvmNetworkActorCoinBalanceEntitySelector }>((balance) => {
									if (balance.is_native_token) {
										return [{
											[EntityMetaKey.Selector]: {
												$actor: {
													address,
												},
												$network: network,
											},
										}]
									}

									const contractAddress = hexLowerOfByteSize(balance.contract_address, 20)
									if (contractAddress == null)
										throw new Error('GoldRushFoundational_Rest: invalid token contract address')

									return [{
										[EntityMetaKey.Selector]: {
											$actor: {
												address,
											},
											$contract: {
												$network: network,
												address: contractAddress,
											},
										},
									}]
								})
						)

						return {
							skip,
							totalCount: balances.items.length,
							rows,
						}
					},
				},
			},
		})({
			$$ownedCoins: {
				select: (snapshot) => snapshot.rows,
				continuation: (snapshot) => {
					const nextSkip = snapshot.skip + snapshot.rows.length
					const terminal = nextSkip >= snapshot.totalCount

					return {
						operation: 'account-owned-coins',
						target: 'goldrush',
						terminal,
						...(!terminal && {
							token: String(nextSkip),
						}),
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }, context) => {
						const { getAddressTransactions, goldRushChainName } = await import('$/sources/Covalent/GoldRush/Rest/queries.ts')
						const { chainId, $network: network } = goldRushChainForNetwork($network)
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('GoldRushFoundational_Rest: invalid account address')

						const pageIndex = goldRushAccountTransactionPage(context)
						const page = await getAddressTransactions({
							chainId,
							chainName: goldRushChainName(chainId),
							address,
							page: pageIndex,
							noLogs: true,
						})

						return {
							pageIndex,
							hasNextPage: page.links.next != null,
							rows: (
								page.items
									.map((transaction) => {
										const txHash = hexLowerOfByteSize(transaction.tx_hash, 32)
										if (txHash == null)
											throw new Error('GoldRushFoundational_Rest: invalid account transaction hash')

										return {
											[EntityMetaKey.Selector]: {
												$network: network,
												txHash,
											},
										} satisfies Entity<typeof schema, EntityType.EvmTransaction>
									})
							),
						}
					},
				},
			},
		})({
			$$transactions: {
				select: (snapshot) => snapshot.rows,
				continuation: (snapshot) => ({
					operation: 'account-transactions',
					target: 'goldrush',
					terminal: !snapshot.hasNextPage,
					...(snapshot.hasNextPage && {
						token: String(snapshot.pageIndex + 1),
					}),
				}),
			},
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkActorCoinBalance,
			resolve: {
				EvmAccountNativeCoinInstance: {
					resolve: async ({ $actor, $network }) => {
						const { getTokenBalances, goldRushChainName } = await import('$/sources/Covalent/GoldRush/Rest/queries.ts')
						const { chainId, $network: network } = goldRushChainForNetwork($network)
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('GoldRushFoundational_Rest: invalid account address')

						const balances = await getTokenBalances({
							chainId,
							chainName: goldRushChainName(chainId),
							address,
						})
						const balance = balances.items.find((candidate) => candidate.is_native_token)
						if (
							balance == null
							|| balance.contract_ticker_symbol.trim() === ''
						)
							throw new Error('GoldRushFoundational_Rest: native token balance missing')

						const actorCoin = {
							$actor: {
								address,
							},
							$network: network,
						} satisfies EntitySelector<typeof schema, EntityType.EvmNetworkActorCoinBalance>

						return {
							$network: network,
							$contract: undefined,
							$coinInstance: {
								[EntityMetaKey.Selector]: {
									$network: network,
									type: CoinInstanceType.NativeCurrency,
								},
							},
							symbol: balance.contract_ticker_symbol.toUpperCase(),
							decimals: balance.contract_decimals,
							$$timestamps: [
								goldRushBalanceObservation(balance, balances, actorCoin),
							],
						}
					},
				},
				EvmAccountErc20CoinInstance: {
					resolve: async ({ $actor, $contract }) => {
						const { getTokenBalances, goldRushChainName } = await import('$/sources/Covalent/GoldRush/Rest/queries.ts')
						const { chainId, $network: network } = goldRushChainForNetwork($contract.$network)
						const address = hexLowerOfByteSize($actor.address, 20)
						const contractAddress = hexLowerOfByteSize($contract.address, 20)
						if (address == null)
							throw new Error('GoldRushFoundational_Rest: invalid account address')
						if (contractAddress == null)
							throw new Error('GoldRushFoundational_Rest: invalid token contract address')

						const balances = await getTokenBalances({
							chainId,
							chainName: goldRushChainName(chainId),
							address,
						})
						const balance = balances.items.find((candidate) => (
							!candidate.is_native_token
							&& candidate.contract_address.toLowerCase() === contractAddress
						))
						if (
							balance == null
							|| balance.contract_ticker_symbol.trim() === ''
						)
							throw new Error('GoldRushFoundational_Rest: ERC-20 token balance missing')

						const actorCoin = {
							$actor: {
								address,
							},
							$contract: {
								$network: network,
								address: contractAddress,
							},
						} satisfies EntitySelector<typeof schema, EntityType.EvmNetworkActorCoinBalance>

						return {
							$network: network,
							$contract: {
								$network: network,
								address: contractAddress,
							},
							$coinInstance: {
								[EntityMetaKey.Selector]: {
									$network: network,
									type: CoinInstanceType.Erc20Token,
									$contract: {
										$network: network,
										address: contractAddress,
									},
								},
							},
							symbol: balance.contract_ticker_symbol.toUpperCase(),
							decimals: balance.contract_decimals,
							$$timestamps: [
								goldRushBalanceObservation(balance, balances, actorCoin),
							],
						}
					},
				},
			},
		})({
			$network: (balance) => ({
				[EntityMetaKey.Selector]: balance.$network,
			}),
			$contract: {
				parentSelectors: [
					'EvmAccountErc20CoinInstance',
				],
				select: (balance) => {
					if (balance.$contract == null)
						throw new Error('GoldRushFoundational_Rest: ERC-20 balance is missing contract')

					return {
						[EntityMetaKey.Selector]: balance.$contract,
					}
				},
			},
			$coinInstance: (balance) => balance.$coinInstance,
			symbol: (balance) => balance.symbol,
			decimals: (balance) => balance.decimals,
			$$timestamps: (balance) => balance.$$timestamps.map((timestamp) => ({
				[EntityMetaKey.Selector]: timestamp[EntityMetaKey.Selector],
			})),
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkActorCoinBalance_Timestamp,
			resolve: {
				ActorCoinTimestampMsSource: {
					resolve: async ({
						$actorCoin,
						timestampMs,
						source,
					}) => {
						if (source !== Source.GoldRushFoundational_Rest)
							throw new Error(`GoldRushFoundational_Rest: unsupported balance observation source ${source}`)
						if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
							throw new Error('GoldRushFoundational_Rest: invalid balance observation timestamp')

						const { getTokenBalances, goldRushChainName } = await import('$/sources/Covalent/GoldRush/Rest/queries.ts')
						const address = hexLowerOfByteSize($actorCoin.$actor.address, 20)
						if (address == null)
							throw new Error('GoldRushFoundational_Rest: invalid account address')

						const isErc20 = '$contract' in $actorCoin
						const network = (
							isErc20 ?
								$actorCoin.$contract.$network
							:
								$actorCoin.$network
						)
						const { chainId, $network } = goldRushChainForNetwork(network)
						const balances = await getTokenBalances({
							chainId,
							chainName: goldRushChainName(chainId),
							address,
						})
						const contractAddress = (
							isErc20 ?
								hexLowerOfByteSize($actorCoin.$contract.address, 20)
							:
								undefined
						)
						if (isErc20 && contractAddress == null)
							throw new Error('GoldRushFoundational_Rest: invalid token contract address')

						const balance = (
							isErc20 ?
								balances.items.find((candidate) => (
									!candidate.is_native_token
									&& candidate.contract_address.toLowerCase() === contractAddress
								))
							:
								balances.items.find((candidate) => candidate.is_native_token)
						)
						if (balance == null)
							throw new Error('GoldRushFoundational_Rest: balance observation missing')

						const actorCoin = (
							isErc20 && contractAddress != null ?
								{
									$actor: {
										address,
									},
									$contract: {
										$network,
										address: contractAddress,
									},
								}
							:
								{
									$actor: {
										address,
									},
									$network,
								}
						) satisfies EntitySelector<typeof schema, EntityType.EvmNetworkActorCoinBalance>
						const observation = goldRushBalanceObservation(balance, balances, actorCoin)
						if (observation[EntityMetaKey.Selector].timestampMs !== timestampMs)
							throw new Error('GoldRushFoundational_Rest: balance observation timestamp does not match request')

						return observation
					},
				},
			},
		})({
			$actorCoin: (observation) => ({
				[EntityMetaKey.Selector]: observation[EntityMetaKey.Selector].$actorCoin,
			}),
			timestampMs: (observation) => observation[EntityMetaKey.Selector].timestampMs,
			source: (observation) => observation[EntityMetaKey.Selector].source,
			blockNumber: (observation) => observation.blockNumber,
			balance: (observation) => observation.balance,
			usdValue: (observation) => observation.usdValue,
			priceUsd: (observation) => observation.priceUsd,
		}),
	],
} satisfies RegisteredSourceResolverModule

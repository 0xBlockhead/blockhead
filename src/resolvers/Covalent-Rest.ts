import { EvmTransactionExecutionStatus } from '$/constants/Evm.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { evmChainIdFromNetworkSelector, evmNetworkSelectorFromChainId } from '$/resolvers/evm.ts'
import {
	resolverContextRowLimit,
	type ResolverContext,
} from '$/resolvers/$resolvers.ts'
import {
	EntityMetaKey,
	type Entity,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type {
	GoldRushTokenBalanceItem,
	GoldRushTokenBalancesData,
} from '$/sources/Covalent/GoldRush/Rest/types.ts'
import { Source } from '$/sources/Source.ts'


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
						const transaction = (await getTransaction({
							chainId,
							chainName: goldRushChainName(chainId),
							txHash,
						})).items[0]
						const fromAddress = hexLowerOfByteSize(transaction.from_address, 20)
						const toAddress = transaction.to_address == null ? undefined : hexLowerOfByteSize(transaction.to_address, 20)
						if (fromAddress == null)
							throw new Error('GoldRushFoundational_Rest: transaction has an invalid from address')
						if (transaction.to_address != null && toAddress == null)
							throw new Error('GoldRushFoundational_Rest: transaction has an invalid to address')

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
							gas: nonnegativeSafeBigInt(transaction.gas_offered),
							gasPrice: nonnegativeSafeBigInt(transaction.gas_price),
							gasUsed: nonnegativeSafeBigInt(transaction.gas_spent),
							executionStatus: transaction.successful ?
								EvmTransactionExecutionStatus.Success
							:
								EvmTransactionExecutionStatus.Failed,
							$$logs: transaction.log_events.map((log) => ({
								[EntityMetaKey.Selector]: {
									$transaction: {
										$network: network,
										txHash,
									},
									indexInTransaction: log.log_offset,
								},
							} satisfies Entity<typeof schema, EntityType.EvmLog>)),
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
			gas: (transaction) => transaction.gas,
			gasPrice: (transaction) => transaction.gasPrice,
			gasUsed: (transaction) => transaction.gasUsed,
			executionStatus: (transaction) => transaction.executionStatus,
			$$logs: (transaction) => transaction.$$logs,
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }, context) => {
						const { getTokenBalances, goldRushChainName } = await import('$/sources/Covalent/GoldRush/Rest/queries.ts')
						const { chainId, $network: network } = goldRushChainForNetwork($network)
						const address = hexLowerOfByteSize($actor.address, 20)
						if (address == null)
							throw new Error('GoldRushFoundational_Rest: invalid account address')

						type EvmNetworkActorCoinBalanceEntitySelector = EntitySelector<
							typeof schema,
							EntityType.EvmNetworkActorCoinBalance
						>

						const balances = await getTokenBalances({
							chainId,
							chainName: goldRushChainName(chainId),
							address,
						})
						const limit = resolverContextRowLimit(context)

						return (
							balances.items
								.slice(0, limit)
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
					},
				},
			},
		})({
			$$ownedCoins: (ownedCoins) => ownedCoins,
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
						const limit = resolverContextRowLimit(context)

						return {
							pageIndex,
							hasNextPage: page.links.next != null,
							rows: (
								page.items
									.slice(0, limit)
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

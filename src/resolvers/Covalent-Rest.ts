import { EvmTransactionExecutionStatus } from '$/constants/Evm.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import { evmChainIdFromNetworkSelector, evmNetworkSelectorFromChainId } from '$/resolvers/evm.ts'
import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	EntityMetaKey,
	type Entity,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
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

						const page = await getAddressTransactions({
							chainId,
							chainName: goldRushChainName(chainId),
							address,
							page: 0,
							noLogs: true,
						})
						const limit = resolverContextRowLimit(context)

						return (
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
						)
					},
				},
			},
		})({
			$$transactions: (transactions) => transactions,
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

						const balance = (
							(await getTokenBalances({
								chainId,
								chainName: goldRushChainName(chainId),
								address,
							})).items
								.find((candidate) => candidate.is_native_token)
						)
						if (
							balance == null
							|| balance.contract_ticker_symbol.trim() === ''
						)
							throw new Error('GoldRushFoundational_Rest: native token balance missing')

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

						const balance = (
							(await getTokenBalances({
								chainId,
								chainName: goldRushChainName(chainId),
								address,
							})).items
								.find((candidate) => (
									!candidate.is_native_token
									&& candidate.contract_address.toLowerCase() === contractAddress
								))
						)
						if (
							balance == null
							|| balance.contract_ticker_symbol.trim() === ''
						)
							throw new Error('GoldRushFoundational_Rest: ERC-20 token balance missing')

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
		}),
	],
} satisfies RegisteredSourceResolverModule

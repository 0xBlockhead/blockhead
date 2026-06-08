import { singleFlight } from '$/lib/singleFlight.ts'
import {
	defineResolver,
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import { Hex } from '@tevm/voltaire/Hex'
import { caip19Erc20, caip19Slip44 } from '$/lib/caip19.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { mediaFromUrl } from '$/lib/media.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

const evmNetworkIdFromChainId = (chainId: number) => ({
	caip2: {
		namespace: 'eip155',
		reference: String(chainId),
	},
} as const)


export default {
	source: Source.Allium_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { CoinId, coinById, coinBySymbol } = await import('$/constants/Coin.ts')
				const { apiChainByChainId } = await import('$/sources/Allium/Rest/constants.ts')
				const { getTokensByChainAddress } = await import('$/sources/Allium/Rest/queries.ts')

				if (entityId.type === CoinInstanceType.NativeCurrency) {
					const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')
					const chain = (await singleFlight(fetchRpcsJson)())
						.find((chain) => chain.chainId === Number(entityId.$network.caip2.reference))
					const nativeCurrency = chain?.nativeCurrency
					if (chain == null || nativeCurrency == null) throw new Error('Allium_Rest: native coin chain not in chainlist')

					const symbol = nativeCurrency.symbol.toUpperCase()
					const coinId = Object.hasOwn(coinBySymbol, symbol) ? coinBySymbol[symbol].id : CoinId.Unknown
					const nativeCurrencyName = nativeCurrency.name

					return {
						coinId,
						...(nativeCurrencyName !== '' && { name: nativeCurrencyName }),
						symbol,
						decimals: nativeCurrency.decimals,
						...(chain.slip44 != null && {
								caip19: caip19Slip44(
									Number(entityId.$network.caip2.reference),
									chain.slip44,
								),
							}),
					}
				}

				const apiChain = apiChainByChainId[Number(entityId.$network.caip2.reference)]
				if (apiChain == null) throw new Error('Allium_Rest: chain not supported by Allium API')

				const token = (
					await getTokensByChainAddress({
						publicEnv: context.publicEnv,
						apiChain,
						tokenAddress: entityId.$contract.address,
					})
				)
					.find((tokenOrError): tokenOrError is Exclude<typeof tokenOrError, { error: string }> => !('error' in tokenOrError))

				if (token == null) throw new Error('Allium_Rest: token not returned for address')

					const symbol = token.info?.symbol.trim().toUpperCase()
					const coinId = (
						symbol != null && symbol !== '' && Object.hasOwn(coinBySymbol, symbol) ?
							coinBySymbol[symbol].id
						:
							CoinId.Unknown
					)
					const fallbackSymbol = Object.hasOwn(coinById, coinId) ? coinById[coinId].symbol : entityId.$contract.address

					return {
						coinId,
						symbol: symbol ?? fallbackSymbol,
						...(token.info != null && token.info.name !== '' && {
								name: token.info.name,
							}),
					...(token.decimals != null && {
						decimals: token.decimals,
					}),
					caip19: caip19Erc20(
						Number(entityId.$network.caip2.reference),
						entityId.$contract.address,
					),
					...((
						iconMedia,
					) => (
						iconMedia != null && {
							$icon: iconMedia,
						}
					))(
						mediaFromUrl(token.attributes?.image_url == null ? undefined : String(token.attributes.image_url), MediaType.Image),
					),
				}
			}
			},
			fields: {
			coinId: (coinInstance) => coinInstance.coinId,
			name: (coinInstance) => coinInstance.name,
			symbol: (coinInstance) => coinInstance.symbol,
			decimals: (coinInstance) => coinInstance.decimals,
			caip19: (coinInstance) => coinInstance.caip19,
			$icon: (coinInstance) => coinInstance.$icon,
		}
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkActorCoinBalance,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { apiChainByChainId } = await import('$/sources/Allium/Rest/constants.ts')
				const { getLatestWalletBalances } = await import('$/sources/Allium/Rest/queries.ts')

				const apiChain = apiChainByChainId[Number(entityId.$coinInstance.$network.caip2.reference)]
				if (apiChain == null) throw new Error('Allium_Rest: chain not supported for wallet balances')

				const walletTokenBalance = (
					(await getLatestWalletBalances({
						publicEnv: context.publicEnv,
						address: entityId.$actor.address,
						apiChain,
						withLiquidityInfo: false,
					})).items
						.find((candidate) => (
							candidate.token != null
							&& (
								entityId.$coinInstance.type === CoinInstanceType.NativeCurrency ?
									candidate.token.type === 'native'
								:
									candidate.token.type === 'evm_erc20'
									&& candidate.token.address.toLowerCase()
										=== entityId.$coinInstance.$contract.address.toLowerCase()
							)
						))
					)
				const token = walletTokenBalance?.token
				if (
					walletTokenBalance == null
					|| token == null
					|| walletTokenBalance.raw_balance == null && walletTokenBalance.raw_balance_str == null
					|| token.info == null
					|| token.info.symbol === ''
					|| token.decimals == null
				) throw new Error('Allium_Rest: wallet token balance incomplete')

				const balance = BigInt(walletTokenBalance.raw_balance_str ?? String(walletTokenBalance.raw_balance ?? 0))

				return {
					symbol: token.info.symbol.toUpperCase(),
					decimals: token.decimals,
					balance,
					...(token.price != null
						&& Number.isFinite(token.price)
						&& Number.isFinite(token.decimals)
						&& token.decimals >= 0 ?
							{
								usdValue: (Number(balance) / 10 ** token.decimals) * token.price,
							}
						:
							{}),
				}
			}
			},
			fields: {
			symbol: (balance) => balance.symbol,
			decimals: (balance) => balance.decimals,
			balance: (balance) => balance.balance,
			usdValue: (balance) => balance.usdValue,
		}
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				[EntityIdProjection.Identity]: async (entityId, context) => {
				const { apiChainByChainId } = await import('$/sources/Allium/Rest/constants.ts')
				const { getLatestWalletBalances } = await import('$/sources/Allium/Rest/queries.ts')
				type EvmNetworkActorCoinBalanceEntityId = import('$/schema/$schema.ts').EntityId<
					typeof import('$/schema/index.ts').schema,
					EntityType.EvmNetworkActorCoinBalance
				>

				const apiChain = apiChainByChainId[Number(entityId.$network.caip2.reference)]
				if (apiChain == null) {
					throw new Error(`Allium_Rest: chain ${Number(entityId.$network.caip2.reference)} not supported for wallet balances`)
				}

				return (
					(await getLatestWalletBalances({
						publicEnv: context.publicEnv,
						address: entityId.$actor.address,
						apiChain,
						withLiquidityInfo: false,
					}))
						.items
						.flatMap<{ [EntityMetaKey.Id]: EvmNetworkActorCoinBalanceEntityId }>((balanceRow) => (
							balanceRow.token?.type === 'native' ?
								[{
									[EntityMetaKey.Id]: {
										$actor: entityId.$actor,
										$coinInstance: {
											$network: entityId.$network,
											type: CoinInstanceType.NativeCurrency,
										},
									},
								} satisfies { [EntityMetaKey.Id]: EvmNetworkActorCoinBalanceEntityId }]
							:
								(
									balanceRow.token?.type === 'evm_erc20'
									&& Hex.isHex(balanceRow.token.address)
									&& Hex.size(balanceRow.token.address) === 20
								) ?
									((address) => (
										address == null ?
											[]
										:
											[{
												[EntityMetaKey.Id]: {
													$actor: entityId.$actor,
													$coinInstance: {
														$network: entityId.$network,
														type: CoinInstanceType.Erc20Token,
														$contract: {
															$network: entityId.$network,
															address,
														},
													},
												},
											} satisfies { [EntityMetaKey.Id]: EvmNetworkActorCoinBalanceEntityId }]
									))(hexLowerOfByteSize(balanceRow.token.address.toLowerCase(), 20))
								:
									[]
						))
				)
			}
			},
			fields: {
			$$ownedCoins: (ownedCoins) => ownedCoins,
		}
		}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				[EntityIdProjection.Identity]: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>, context) => {
				const { readNormalizedLocalInternal } = await import('$/sources/Local/Internal/catalog.ts')
				const { apiChainByChainId } = await import('$/sources/Allium/Rest/constants.ts')
				const { getLatestWalletBalances } = await import('$/sources/Allium/Rest/queries.ts')
				type EvmNetworkActorCoinBalanceEntityId = EntityId<typeof schema, EntityType.EvmNetworkActorCoinBalance>

				const subsetRowLimit = resolverContextRowLimit(context)
				const evmNetworkActorCoinBalanceRows: { [EntityMetaKey.Id]: EvmNetworkActorCoinBalanceEntityId }[] = []

				for (const actor of readNormalizedLocalInternal().actors) {
					if (evmNetworkActorCoinBalanceRows.length >= subsetRowLimit) break
					for (const chainIdString of Object.keys(apiChainByChainId)) {
						if (evmNetworkActorCoinBalanceRows.length >= subsetRowLimit) break
						const chainId = Number(chainIdString)
						const apiChain = apiChainByChainId[chainId]
						const networkId = evmNetworkIdFromChainId(chainId)
						if (apiChain == null) continue
						evmNetworkActorCoinBalanceRows.push(
							...(await getLatestWalletBalances({
								publicEnv: context.publicEnv,
								address: actor.address,
								apiChain,
								withLiquidityInfo: false,
							}))
								.items
								.flatMap<{ [EntityMetaKey.Id]: EvmNetworkActorCoinBalanceEntityId }>((balanceRow) => (
									balanceRow.token?.type === 'native' ?
										[{
											[EntityMetaKey.Id]: {
												$actor: { address: actor.address as `0x${string}` },
												$coinInstance: {
													$network: networkId,
													type: CoinInstanceType.NativeCurrency,
												},
											},
										} satisfies { [EntityMetaKey.Id]: EvmNetworkActorCoinBalanceEntityId }]
									:
										(
											balanceRow.token?.type === 'evm_erc20'
											&& Hex.isHex(balanceRow.token.address)
											&& Hex.size(balanceRow.token.address) === 20
										) ?
											((address) => (
												address == null ?
													[]
												:
													[{
														[EntityMetaKey.Id]: {
															$actor: { address: actor.address as `0x${string}` },
															$coinInstance: {
																$network: networkId,
																type: CoinInstanceType.Erc20Token,
																$contract: {
																	$network: networkId,
																	address,
																},
															},
														},
													} satisfies { [EntityMetaKey.Id]: EvmNetworkActorCoinBalanceEntityId }]
											))(hexLowerOfByteSize(balanceRow.token.address.toLowerCase(), 20))
										:
											[]
								)),
						)
					}
				}

				return evmNetworkActorCoinBalanceRows.slice(0, subsetRowLimit)
			}
			},
			fields: {
			$$actorCoins: (actorCoins) => actorCoins,
		}
		}),
	],
}

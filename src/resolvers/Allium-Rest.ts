import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { Hex } from '@tevm/voltaire/Hex'
import { networks } from '$/constants/Network.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import { evmNetworkSelectorFromChainId } from '$/resolvers/evm.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { apiChainByChainId } from '$/sources/Allium/Rest/constants.ts'
import { Source } from '$/sources/Source.ts'

const alliumNetworkForSelector = (
	networkSelector: EntitySelector<typeof schema, EntityType.Network>
) => {
	const network = networks.find((candidate) => (
		'slug' in networkSelector ?
			candidate.slug === networkSelector.slug
		:
			'caip2' in candidate
			&& candidate.caip2.namespace === networkSelector.caip2.namespace
			&& candidate.caip2.reference === networkSelector.caip2.reference
	))
	if (
		network == null
		|| !('caip2' in network)
		|| network.caip2.namespace !== 'eip155'
	)
		throw new Error('Allium_Rest: network is not a cataloged EVM chain')

	const apiChain = apiChainByChainId[Number(network.caip2.reference)]
	if (apiChain == null)
		throw new Error('Allium_Rest: network is not supported by Allium')

	return {
		apiChain,
		caip2: network.caip2,
	}
}


export default {
	source: Source.Allium_Rest,

	resolvers: [
		defineResolver(Source.Allium_Rest, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				NetworkTypeContract: {
					resolve: async ({ $contract, $network, type }, context) => {
						const { CoinId, coinById, coinBySymbol } = await import('$/constants/Coin.ts')
						const { getTokensByChainAddress } = await import('$/sources/Allium/Rest/queries.ts')

						if (type !== CoinInstanceType.Erc20Token) throw new Error('Allium_Rest: native coin selector required')

						const alliumNetwork = alliumNetworkForSelector($network)

						const token = (
							await getTokensByChainAddress({
								publicEnv: context.publicEnv,
								apiChain: alliumNetwork.apiChain,
								tokenAddress: $contract.address,
							})
						)
							.find((tokenOrError): tokenOrError is Exclude<typeof tokenOrError, { error: string }> => !('error' in tokenOrError))

						if (token == null) throw new Error('Allium_Rest: token not returned for address')
						if (token.decimals == null) throw new Error('Allium_Rest: token decimals missing for address')

						const symbol = token.info?.symbol.trim().toUpperCase()
						const coinId = (
							symbol != null && symbol !== '' && Object.hasOwn(coinBySymbol, symbol) ?
								coinBySymbol[symbol].id
							:
								CoinId.Unknown
						)
						const fallbackSymbol = Object.hasOwn(coinById, coinId) ? coinById[coinId].symbol : $contract.address

						return {
							coinId,
							symbol: symbol ?? fallbackSymbol,
							...(token.info != null && token.info.name !== '' && {
								name: token.info.name,
							}),
							decimals: token.decimals,
							caip19: `eip155:${alliumNetwork.caip2.reference}/erc20:${$contract.address.toLowerCase()}`,
							...((
								iconMedia
							) => (
								iconMedia != null && {
									$icon: iconMedia,
								}
							))(
								mediaFromUrl(token.attributes?.image_url == null ? undefined : String(token.attributes.image_url), MediaType.Image)
							),
						}
					},
				},
			},
		})({
			Erc20Token: {
				coinId: (coinInstance) => coinInstance.coinId,
				name: (coinInstance) => coinInstance.name,
				symbol: (coinInstance) => coinInstance.symbol,
				decimals: (coinInstance) => coinInstance.decimals,
				caip19: (coinInstance) => coinInstance.caip19,
				$icon: (coinInstance) => coinInstance.$icon,
			},
		}),

		defineResolver(Source.Allium_Rest, {
			entityType: EntityType.EvmNetworkActorCoinBalance,
			resolve: {
				EvmAccountNativeCoinInstance: {
					resolve: async ({ $actor, $network }, context) => {
						const { getLatestWalletBalances } = await import('$/sources/Allium/Rest/queries.ts')

						const alliumNetwork = alliumNetworkForSelector($network)

						const walletTokenBalance = (
							(await getLatestWalletBalances({
								publicEnv: context.publicEnv,
								address: $actor.address,
								apiChain: alliumNetwork.apiChain,
								withLiquidityInfo: false,
							})).items
								.find((candidate) => (
									candidate.token?.type === 'native'
								))
						)
						const token = walletTokenBalance?.token
						if (
							walletTokenBalance == null
							|| token == null
							|| token.info == null
							|| token.info.symbol === ''
							|| token.decimals == null
						) throw new Error('Allium_Rest: wallet token balance incomplete')

						return {
							$network,
							$contract: undefined,
							$coinInstance: {
								[EntityMetaKey.Selector]: {
									$network,
									type: CoinInstanceType.NativeCurrency,
								},
							},
							symbol: token.info.symbol.toUpperCase(),
							decimals: token.decimals,
						}
					},
				},
				EvmAccountErc20CoinInstance: {
					resolve: async ({ $actor, $contract }, context) => {
						const { getLatestWalletBalances } = await import('$/sources/Allium/Rest/queries.ts')

						const alliumNetwork = alliumNetworkForSelector($contract.$network)

						const walletTokenBalance = (
							(await getLatestWalletBalances({
								publicEnv: context.publicEnv,
								address: $actor.address,
								apiChain: alliumNetwork.apiChain,
								withLiquidityInfo: false,
							})).items
								.find((candidate) => (
									candidate.token?.type === 'evm_erc20'
									&& candidate.token.address.toLowerCase() === $contract.address.toLowerCase()
								))
						)
						const token = walletTokenBalance?.token
						if (
							walletTokenBalance == null
							|| token == null
							|| token.info == null
							|| token.info.symbol === ''
							|| token.decimals == null
						) throw new Error('Allium_Rest: wallet token balance incomplete')

						return {
							$network: $contract.$network,
							$contract,
							$coinInstance: {
								[EntityMetaKey.Selector]: {
									$network: $contract.$network,
									type: CoinInstanceType.Erc20Token,
									$contract,
								},
							},
							symbol: token.info.symbol.toUpperCase(),
							decimals: token.decimals,
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
						throw new Error('Allium_Rest: ERC-20 balance is missing contract')

					return {
						[EntityMetaKey.Selector]: balance.$contract,
					}
				},
			},
			$coinInstance: (balance) => balance.$coinInstance,
			symbol: (balance) => balance.symbol,
			decimals: (balance) => balance.decimals,
		}),

		defineResolver(Source.Allium_Rest, {
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }, context) => {
						const { getLatestWalletBalances } = await import('$/sources/Allium/Rest/queries.ts')
						type EvmNetworkActorCoinBalanceEntitySelector = import('$/schema/$schema.ts').EntitySelector<
							typeof import('$/schema/index.ts').schema,
							EntityType.EvmNetworkActorCoinBalance
						>

						const alliumNetwork = alliumNetworkForSelector($network)

						return (
							(await getLatestWalletBalances({
								publicEnv: context.publicEnv,
								address: $actor.address,
								apiChain: alliumNetwork.apiChain,
								withLiquidityInfo: false,
							}))
								.items
								.flatMap<{ [EntityMetaKey.Selector]: EvmNetworkActorCoinBalanceEntitySelector }>((balanceRow) => (
									balanceRow.token?.type === 'native' ?
										[{
											[EntityMetaKey.Selector]: {
												$actor,
												$network,
											},
										} satisfies { [EntityMetaKey.Selector]: EvmNetworkActorCoinBalanceEntitySelector }]
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
														[EntityMetaKey.Selector]: {
															$actor,
															$contract: {
																$network,
																address,
															},
														},
													} satisfies { [EntityMetaKey.Selector]: EvmNetworkActorCoinBalanceEntitySelector }]
											))(hexLowerOfByteSize(balanceRow.token.address.toLowerCase(), 20))
										:
											[]
								))
						)
					},
				},
			},
		})({
			$$ownedCoins: (ownedCoins) => ownedCoins,
		}),

		defineResolver(Source.Allium_Rest, {
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector, context) => {
						const { readNormalizedLocalInternal } = await import('$/resolvers/Local/Internal/catalog.ts')
						const { getLatestWalletBalances } = await import('$/sources/Allium/Rest/queries.ts')
						type EvmNetworkActorCoinBalanceEntitySelector = EntitySelector<typeof schema, EntityType.EvmNetworkActorCoinBalance>

						const subsetRowLimit = resolverContextRowLimit(context)
						const evmNetworkActorCoinBalanceRows: { [EntityMetaKey.Selector]: EvmNetworkActorCoinBalanceEntitySelector }[] = []

						for (const actor of readNormalizedLocalInternal().actors) {
							if (evmNetworkActorCoinBalanceRows.length >= subsetRowLimit) break
							for (const chainIdString of Object.keys(apiChainByChainId)) {
								if (evmNetworkActorCoinBalanceRows.length >= subsetRowLimit) break
								const chainId = Number(chainIdString)
								const apiChain = apiChainByChainId[chainId]
								const networkSelector = evmNetworkSelectorFromChainId(chainId)
								if (apiChain == null) continue
								evmNetworkActorCoinBalanceRows.push(
									...(await getLatestWalletBalances({
										publicEnv: context.publicEnv,
										address: actor.address,
										apiChain,
										withLiquidityInfo: false,
									}))
										.items
										.flatMap<{ [EntityMetaKey.Selector]: EvmNetworkActorCoinBalanceEntitySelector }>((balanceRow) => (
											balanceRow.token?.type === 'native' ?
											[{
												[EntityMetaKey.Selector]: {
													$actor: { address: actor.address },
													$network: networkSelector,
												},
											} satisfies { [EntityMetaKey.Selector]: EvmNetworkActorCoinBalanceEntitySelector }]
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
															[EntityMetaKey.Selector]: {
																$actor: { address: actor.address },
																$contract: {
																	$network: networkSelector,
																	address,
																},
															},
														} satisfies { [EntityMetaKey.Selector]: EvmNetworkActorCoinBalanceEntitySelector }]
												))(hexLowerOfByteSize(balanceRow.token.address.toLowerCase(), 20))
											:
												[]
										))
							)
							}
						}

						return evmNetworkActorCoinBalanceRows.slice(0, subsetRowLimit)
					},
				},
			},
		})({
			$$actorCoins: (actorCoins) => actorCoins,
		}),
	],
}

import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import { Hex } from '@tevm/voltaire/Hex'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { EvmCoinInstanceSelector } from '$/schema/EvmCoinInstance.ts'
import { EvmNetworkActorCoinBalanceSelector } from '$/schema/EvmNetworkActorCoinBalance.ts'
import { EvmNetworkAccountSelector } from '$/schema/EvmNetworkAccount.ts'

const evmNetworkIdFromChainId = (chainId: number) => ({
	caip2: {
		namespace: 'eip155',
		reference: String(chainId),
	},
} as const)


export default {
	source: Source.Allium_Rest,

	resolvers: [
		defineResolver(Source.Allium_Rest, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EvmCoinInstanceSelector.NetworkTypeContract]: async ({ $contract, $network, type }, context) => {
					const { CoinId, coinById, coinBySymbol } = await import('$/constants/Coin.ts')
					const { apiChainByChainId } = await import('$/sources/Allium/Rest/constants.ts')
					const { getTokensByChainAddress } = await import('$/sources/Allium/Rest/queries.ts')

					if (type !== CoinInstanceType.Erc20Token) throw new Error('Allium_Rest: native coin selector required')

					const apiChain = apiChainByChainId[Number($network.caip2.reference)]
					if (apiChain == null) throw new Error('Allium_Rest: chain not supported by Allium API')

					const token = (
						await getTokensByChainAddress({
							publicEnv: context.publicEnv,
							apiChain,
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
						caip19: `eip155:${Number($network.caip2.reference)}/erc20:${$contract.address.toLowerCase()}`,
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
		})({
			fields: {
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
				[EvmNetworkActorCoinBalanceSelector.EvmAccountNativeCoinInstance]: async ({ $actor, $network }, context) => {
					const { apiChainByChainId } = await import('$/sources/Allium/Rest/constants.ts')
					const { getLatestWalletBalances } = await import('$/sources/Allium/Rest/queries.ts')

					const apiChain = apiChainByChainId[Number($network.caip2.reference)]
					if (apiChain == null) throw new Error('Allium_Rest: chain not supported for wallet balances')

					const walletTokenBalance = (
						(await getLatestWalletBalances({
							publicEnv: context.publicEnv,
							address: $actor.address,
							apiChain,
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
						|| walletTokenBalance.raw_balance == null && walletTokenBalance.raw_balance_str == null
						|| token.info == null
						|| token.info.symbol === ''
						|| token.decimals == null
					) throw new Error('Allium_Rest: wallet token balance incomplete')

					const balance = BigInt(walletTokenBalance.raw_balance_str ?? String(walletTokenBalance.raw_balance ?? 0))

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
				},
				[EvmNetworkActorCoinBalanceSelector.EvmAccountErc20CoinInstance]: async ({ $actor, $contract }, context) => {
					const { apiChainByChainId } = await import('$/sources/Allium/Rest/constants.ts')
					const { getLatestWalletBalances } = await import('$/sources/Allium/Rest/queries.ts')

					const apiChain = apiChainByChainId[Number($contract.$network.caip2.reference)]
					if (apiChain == null) throw new Error('Allium_Rest: chain not supported for wallet balances')

					const walletTokenBalance = (
						(await getLatestWalletBalances({
							publicEnv: context.publicEnv,
							address: $actor.address,
							apiChain,
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
						|| walletTokenBalance.raw_balance == null && walletTokenBalance.raw_balance_str == null
						|| token.info == null
						|| token.info.symbol === ''
						|| token.decimals == null
					) throw new Error('Allium_Rest: wallet token balance incomplete')

					const balance = BigInt(walletTokenBalance.raw_balance_str ?? String(walletTokenBalance.raw_balance ?? 0))

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
				},
			},
		})({
			fields: {
				$network: (balance) => ({
					[EntityMetaKey.Selector]: balance.$network,
				}),
				$contract: {
					parentSelectors: [
						EvmNetworkActorCoinBalanceSelector.EvmAccountErc20CoinInstance,
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
				balance: (balance) => balance.balance,
				usdValue: (balance) => balance.usdValue,
			},
		}),

		defineResolver(Source.Allium_Rest, {
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				[EvmNetworkAccountSelector.EvmNetworkEvmAccount]: async ({ $actor, $network }, context) => {
					const { apiChainByChainId } = await import('$/sources/Allium/Rest/constants.ts')
					const { getLatestWalletBalances } = await import('$/sources/Allium/Rest/queries.ts')
					type EvmNetworkActorCoinBalanceEntitySelector = import('$/schema/$schema.ts').EntitySelector<
						typeof import('$/schema/index.ts').schema,
						EntityType.EvmNetworkActorCoinBalance
					>

					const apiChain = apiChainByChainId[Number($network.caip2.reference)]
					if (apiChain == null)
						throw new Error(`Allium_Rest: chain ${Number($network.caip2.reference)} not supported for wallet balances`)

					return (
						(await getLatestWalletBalances({
							publicEnv: context.publicEnv,
							address: $actor.address,
							apiChain,
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
				}
			},
		})({
			fields: {
				$$ownedCoins: (ownedCoins) => ownedCoins,
			},
		}),

		defineResolver(Source.Allium_Rest, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>, context) => {
					const { readNormalizedLocalInternal } = await import('$/sources/Local/Internal/catalog.ts')
					const { apiChainByChainId } = await import('$/sources/Allium/Rest/constants.ts')
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
									.flatMap<{ [EntityMetaKey.Selector]: EvmNetworkActorCoinBalanceEntitySelector }>((balanceRow) => (
									balanceRow.token?.type === 'native' ?
										[{
											[EntityMetaKey.Selector]: {
												$actor: { address: actor.address as `0x${string}` },
												$network: networkId,
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
															$actor: { address: actor.address as `0x${string}` },
															$contract: {
																$network: networkId,
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
				}
			},
		})({
			fields: {
				$$actorCoins: (actorCoins) => actorCoins,
			},
		}),
	],
}

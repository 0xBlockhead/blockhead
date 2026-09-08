import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import { Hex } from '@tevm/voltaire/Hex'
import { networks } from '$/constants/Network.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { mediaFromUrl } from '$/resolvers/media.ts'
import { evmNetworkSelectorFromChainId } from '$/resolvers/evm.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
} from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { schema } from '$/schema/index.ts'
import { MediaType } from '$/schema/MediaType.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { apiChainByChainId } from '$/sources/Allium/Rest/constants.ts'
import type { AlliumWalletBalance } from '$/sources/Allium/Rest/types.ts'
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

const alliumWalletBalanceClock = (
	walletTokenBalance: AlliumWalletBalance
) => {
	const timestampMs = (
		walletTokenBalance.block_timestamp == null || walletTokenBalance.block_timestamp === '' ?
			undefined
		:
			Date.parse(walletTokenBalance.block_timestamp)
	)
	if (timestampMs == null || !Number.isFinite(timestampMs) || timestampMs < 0)
		throw new Error('Allium_Rest: wallet token balance timestamp missing')

	return {
		timestampMs,
		blockNumber: (
			walletTokenBalance.block_number != null
			&& Number.isSafeInteger(walletTokenBalance.block_number)
			&& walletTokenBalance.block_number >= 0 ?
				BigInt(walletTokenBalance.block_number)
			:
				undefined
		),
	}
}

const alliumBalanceObservation = (
	walletTokenBalance: AlliumWalletBalance,
	actorCoin: EntitySelector<typeof schema, EntityType.EvmNetworkActorCoinBalance>
) => {
	const balanceText = walletTokenBalance.raw_balance_str
	if (balanceText == null || !/^(0|[1-9][0-9]*)$/.test(balanceText))
		throw new Error('Allium_Rest: wallet token balance amount missing')

	const clock = alliumWalletBalanceClock(walletTokenBalance)
	const balance = BigInt(balanceText)
	const decimals = walletTokenBalance.token?.decimals
	const priceUsd = walletTokenBalance.token?.price
	const usdValue = (
		decimals != null
		&& Number.isSafeInteger(decimals)
		&& decimals >= 0
		&& decimals <= 255
		&& priceUsd != null
		&& Number.isFinite(priceUsd)
	) ?
		(
			((amount) => (
				Number.isFinite(amount) ?
					amount
				:
					undefined
			))(Number(balance) / (10 ** decimals) * priceUsd)
		)
	:
		undefined

	return {
		[EntityMetaKey.Selector]: {
			$actorCoin: actorCoin,
			timestampMs: clock.timestampMs,
			source: Source.Allium_Rest,
		},
		balance,
		...(clock.blockNumber != null && {
			blockNumber: clock.blockNumber,
		}),
		...(
			priceUsd != null
			&& Number.isFinite(priceUsd)
			&& {
				priceUsd,
			}
		),
		...(usdValue != null && {
			usdValue,
		}),
	}
}

const alliumBalanceTimestampRef = (
	observation: ReturnType<typeof alliumBalanceObservation>
) => ({
	[EntityMetaKey.Selector]: observation[EntityMetaKey.Selector],
	[EntityMetaKey.Fields]: {
		[entityFieldAddressKey(EntityType.EvmNetworkActorCoinBalance_Timestamp, [], 'balance')]: observation.balance,
		...(observation.blockNumber != null && {
			[entityFieldAddressKey(EntityType.EvmNetworkActorCoinBalance_Timestamp, [], 'blockNumber')]: observation.blockNumber,
		}),
		...(observation.usdValue != null && {
			[entityFieldAddressKey(EntityType.EvmNetworkActorCoinBalance_Timestamp, [], 'usdValue')]: observation.usdValue,
		}),
		...(observation.priceUsd != null && {
			[entityFieldAddressKey(EntityType.EvmNetworkActorCoinBalance_Timestamp, [], 'priceUsd')]: observation.priceUsd,
		}),
	},
})

const alliumActorCoinRow = (
	balanceRow: AlliumWalletBalance,
	$actor: EntitySelector<typeof schema, EntityType.EvmAccount>,
	$network: EntitySelector<typeof schema, EntityType.Network>
) => {
	if (balanceRow.token?.type === 'native') {
		const actorCoin = {
			$actor,
			$network,
		} satisfies EntitySelector<typeof schema, EntityType.EvmNetworkActorCoinBalance>
		const symbol = balanceRow.token.info?.symbol.trim().toUpperCase()

		return [{
			[EntityMetaKey.Selector]: actorCoin,
			[EntityMetaKey.Fields]: {
				...(symbol != null && symbol !== '' && {
					[entityFieldAddressKey(EntityType.EvmNetworkActorCoinBalance, [], 'symbol')]: symbol,
				}),
				...(balanceRow.token.decimals != null && {
					[entityFieldAddressKey(EntityType.EvmNetworkActorCoinBalance, [], 'decimals')]: balanceRow.token.decimals,
				}),
				[entityFieldAddressKey(EntityType.EvmNetworkActorCoinBalance, [], '$coinInstance')]: {
					[EntityMetaKey.Selector]: {
						$network,
						type: CoinInstanceType.NativeCurrency,
					},
				},
				...(
					balanceRow.raw_balance_str != null
					&& /^(0|[1-9][0-9]*)$/.test(balanceRow.raw_balance_str)
					&& balanceRow.block_timestamp != null
					&& balanceRow.block_timestamp !== ''
					&& Number.isFinite(Date.parse(balanceRow.block_timestamp))
					&& {
						[entityFieldAddressKey(EntityType.EvmNetworkActorCoinBalance, [], '$$timestamps')]: [
							alliumBalanceTimestampRef(
								alliumBalanceObservation(balanceRow, actorCoin)
							),
						],
					}
				),
			},
		}]
	}

	if (
		balanceRow.token?.type === 'evm_erc20'
		&& Hex.isHex(balanceRow.token.address)
		&& Hex.size(balanceRow.token.address) === 20
	) {
		const address = hexLowerOfByteSize(balanceRow.token.address.toLowerCase(), 20)
		if (address == null)
			return []

		const $contract = {
			$network,
			address,
		}
		const actorCoin = {
			$actor,
			$contract,
		} satisfies EntitySelector<typeof schema, EntityType.EvmNetworkActorCoinBalance>
		const symbol = balanceRow.token.info?.symbol.trim().toUpperCase()

		return [{
			[EntityMetaKey.Selector]: actorCoin,
			[EntityMetaKey.Fields]: {
				...(symbol != null && symbol !== '' && {
					[entityFieldAddressKey(EntityType.EvmNetworkActorCoinBalance, [], 'symbol')]: symbol,
				}),
				...(balanceRow.token.decimals != null && {
					[entityFieldAddressKey(EntityType.EvmNetworkActorCoinBalance, [], 'decimals')]: balanceRow.token.decimals,
				}),
				[entityFieldAddressKey(EntityType.EvmNetworkActorCoinBalance, [], '$coinInstance')]: {
					[EntityMetaKey.Selector]: {
						$network,
						type: CoinInstanceType.Erc20Token,
						$contract,
					},
				},
				...(
					balanceRow.raw_balance_str != null
					&& /^(0|[1-9][0-9]*)$/.test(balanceRow.raw_balance_str)
					&& balanceRow.block_timestamp != null
					&& balanceRow.block_timestamp !== ''
					&& Number.isFinite(Date.parse(balanceRow.block_timestamp))
					&& {
						[entityFieldAddressKey(EntityType.EvmNetworkActorCoinBalance, [], '$$timestamps')]: [
							alliumBalanceTimestampRef(
								alliumBalanceObservation(balanceRow, actorCoin)
							),
						],
					}
				),
			},
		}]
	}

	return []
}

const alliumOwnedCoinsContinuation = (
	token: string | undefined
) => {
	if (token == null || token === '') {
		return {
			skip: 0,
			cursor: undefined as string | undefined,
		}
	}

	// Legacy bare API cursor (pre-offset honesty).
	if (!token.includes('=')) {
		return {
			skip: 0,
			cursor: token,
		}
	}

	const params = new URLSearchParams(token)
	const skip = Number(params.get('skip') ?? '0')
	if (!Number.isSafeInteger(skip) || skip < 0)
		throw new Error('Allium_Rest: invalid owned-coins offset continuation')

	const cursor = params.get('cursor')
	return {
		skip,
		cursor: cursor == null || cursor === '' ? undefined : cursor,
	}
}

const alliumOwnedCoinsContinuationToken = ({
	skip,
	cursor,
}: {
	skip: number
	cursor?: string
}) => {
	const params = new URLSearchParams({
		skip: String(skip),
	})
	if (cursor != null && cursor !== '')
		params.set('cursor', cursor)

	return params.toString()
}


export default {
	source: Source.Allium_Rest,

	resolvers: [
		defineResolver({
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

		defineResolver({
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

						const actorCoin = {
							$actor,
							$network,
						} satisfies EntitySelector<typeof schema, EntityType.EvmNetworkActorCoinBalance>

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
							$$timestamps: [
								alliumBalanceTimestampRef(
									alliumBalanceObservation(walletTokenBalance, actorCoin)
								),
							],
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

						const actorCoin = {
							$actor,
							$contract,
						} satisfies EntitySelector<typeof schema, EntityType.EvmNetworkActorCoinBalance>

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
							$$timestamps: [
								alliumBalanceTimestampRef(
									alliumBalanceObservation(walletTokenBalance, actorCoin)
								),
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
						throw new Error('Allium_Rest: ERC-20 balance is missing contract')

					return {
						[EntityMetaKey.Selector]: balance.$contract,
					}
				},
			},
			$coinInstance: (balance) => balance.$coinInstance,
			symbol: (balance) => balance.symbol,
			decimals: (balance) => balance.decimals,
			$$timestamps: {
				select: (balance) => balance.$$timestamps,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmNetworkActorCoinBalance_Timestamp,
			resolve: {
				ActorCoinTimestampMsSource: {
					resolve: async ({
						$actorCoin,
						timestampMs,
						source,
					}, context) => {
						if (source !== Source.Allium_Rest)
							throw new Error(`Allium_Rest: unsupported balance observation source ${source}`)
						if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
							throw new Error('Allium_Rest: invalid balance observation timestamp')

						const { getLatestWalletBalances } = await import('$/sources/Allium/Rest/queries.ts')
						const isErc20 = '$contract' in $actorCoin
						const network = isErc20 ? $actorCoin.$contract.$network : $actorCoin.$network
						const alliumNetwork = alliumNetworkForSelector(network)
						const walletTokenBalance = (
							(await getLatestWalletBalances({
								publicEnv: context.publicEnv,
								address: $actorCoin.$actor.address,
								apiChain: alliumNetwork.apiChain,
								withLiquidityInfo: false,
							})).items
								.find((candidate) => (
									isErc20 ?
										candidate.token?.type === 'evm_erc20'
										&& candidate.token.address.toLowerCase() === $actorCoin.$contract.address.toLowerCase()
									:
										candidate.token?.type === 'native'
								))
						)
						if (walletTokenBalance == null)
							throw new Error('Allium_Rest: balance observation missing')

						const observation = alliumBalanceObservation(
							walletTokenBalance,
							isErc20 ?
								{
									$actor: $actorCoin.$actor,
									$contract: $actorCoin.$contract,
								}
							:
								{
									$actor: $actorCoin.$actor,
									$network: $actorCoin.$network,
								}
						)
						if (observation[EntityMetaKey.Selector].timestampMs !== timestampMs)
							throw new Error('Allium_Rest: balance observation timestamp does not match request')

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

		defineResolver({
			entityType: EntityType.EvmNetworkAccount,
			resolve: {
				EvmNetworkEvmAccount: {
					resolve: async ({ $actor, $network }, context) => {
						const { getLatestWalletBalances } = await import('$/sources/Allium/Rest/queries.ts')

						const alliumNetwork = alliumNetworkForSelector($network)
						const {
							skip,
							cursor: requestCursor,
						} = alliumOwnedCoinsContinuation(context.providerContinuationToken)
						const page = await getLatestWalletBalances({
							publicEnv: context.publicEnv,
							address: $actor.address,
							apiChain: alliumNetwork.apiChain,
							withLiquidityInfo: false,
							...(requestCursor != null && {
								cursor: requestCursor,
							}),
						})
						const limit = resolverContextRowLimit(context)
						const mapped = page.items.flatMap((balanceRow) => (
							alliumActorCoinRow(balanceRow, $actor, $network)
						))
						const rows = mapped.slice(skip, skip + limit)

						return {
							skip,
							requestCursor,
							nextCursor: page.cursor,
							pageRowCount: mapped.length,
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
					const moreInPage = nextSkip < snapshot.pageRowCount
					const nextApiCursor = (
						snapshot.nextCursor != null
						&& snapshot.nextCursor !== ''
					) ?
						snapshot.nextCursor
					:
						undefined

					if (moreInPage) {
						return {
							operation: 'account-owned-coins',
							target: 'allium',
							terminal: false,
							token: alliumOwnedCoinsContinuationToken({
								skip: nextSkip,
								cursor: snapshot.requestCursor,
							}),
						}
					}

					if (nextApiCursor != null) {
						return {
							operation: 'account-owned-coins',
							target: 'allium',
							terminal: false,
							token: alliumOwnedCoinsContinuationToken({
								skip: 0,
								cursor: nextApiCursor,
							}),
						}
					}

					return {
						operation: 'account-owned-coins',
						target: 'allium',
						terminal: true,
					}
				},
			},
		}),

		defineResolver({
			entityType: EntityType._Global,
			resolve: {
				Scope: {
					resolve: async (_globalScopeEntitySelector, context) => {
						const { readNormalizedLocalInternal } = await import('$/resolvers/Local/Internal/catalog.ts')
						const { getLatestWalletBalances } = await import('$/sources/Allium/Rest/queries.ts')

						const subsetRowLimit = resolverContextRowLimit(context)
						const evmNetworkActorCoinBalanceRows = []

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
										.flatMap((balanceRow) => (
											alliumActorCoinRow(
												balanceRow,
												{
													address: actor.address,
												},
												networkSelector
											)
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
} satisfies RegisteredSourceResolverModule

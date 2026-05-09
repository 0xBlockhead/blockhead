import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { Hex } from '@tevm/voltaire/Hex'
import { caip19Erc20, caip19Slip44 } from '$/lib/caip19.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { CoinInstanceType } from '$/schema/CoinInstance.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import { chainlistNetworkEntitiesFieldResolver } from '$/resolvers/Chainlist-Rest.ts'

const alliumTokenImageHttpUrl = (value: string | null | undefined) => {
	const raw = typeof value === 'string' ? value.trim() : ''
	if (raw.length === 0) return undefined
	const withProtocol = raw.startsWith('//') ? `https:${raw}` : raw
	try {
		const parsed = new URL(withProtocol)
		return (
			parsed.protocol === 'http:' || parsed.protocol === 'https:' ?
				parsed.toString()
			:
				undefined
		)
	} catch {
		return undefined
	}
}

export default {
	source: Source.Allium_Rest,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.CoinInstance,
			resolve: async (entityId, context) => {
				const { CoinId, coinById, coinBySymbol } = await import('$/constants/Coin.ts')
				const { sourcePublicEnv } = await import('$/resolvers/$resolvers.ts')
				const { apiChainByChainId } = await import('$/sources/Allium/Rest/constants.ts')
				const { getAlliumTokensByChainAddress } = await import('$/sources/Allium/Rest/queries.ts')

				const publicEnv = sourcePublicEnv(context, Source.Allium_Rest)
				if (entityId.type === CoinInstanceType.NativeCurrency) {
					const nativeCurrency = (
						(await chainlistNetworkEntitiesFieldResolver.resolve({}, context))
							.find((network) => network[EntityMetaKey.Id].chainId === entityId.$network.chainId)
							?.nativeCurrencies?.[0]
					)
					if (nativeCurrency == null) throw new Error('Allium_Rest: native coin chain not in chainlist')

					const symbol = nativeCurrency.symbol.trim().toUpperCase()
					const coinId = coinBySymbol[symbol]?.id ?? CoinId.Unknown

					return {
						coinId,
						...(nativeCurrency.name.trim() !== '' ? { name: nativeCurrency.name.trim() } : {}),
						symbol,
						decimals: nativeCurrency.decimals,
						...(nativeCurrency.slip44 != null ?
							{
								caip19: caip19Slip44(
									entityId.$network.chainId,
									nativeCurrency.slip44,
								),
							}
						:
							{}),
					}
				}

				const apiChain = apiChainByChainId[entityId.$network.chainId]
				if (apiChain == null) throw new Error('Allium_Rest: chain not supported by Allium API')

				const token = (
					await getAlliumTokensByChainAddress({
						publicEnv,
						apiChain,
						tokenAddress: entityId.$contract.address,
					})
				)
					.find((tokenOrError): tokenOrError is Exclude<typeof tokenOrError, { error: string }> => !('error' in tokenOrError))

				if (token == null) throw new Error('Allium_Rest: token not returned for address')

				const symbol = token.info?.symbol?.trim().toUpperCase()
				const coinId = (
					symbol != null && symbol !== '' ?
						coinBySymbol[symbol]?.id ?? CoinId.Unknown
					:
						CoinId.Unknown
				)

				return {
					coinId,
					symbol: symbol ?? coinById[coinId]?.symbol ?? entityId.$contract.address,
					...(token.info?.name != null && token.info.name.trim() !== '' ?
						{
							name: token.info.name.trim(),
						}
					:
						{}),
					...(token.decimals != null ?
						{
							decimals: token.decimals,
						}
					:
						{}),
					caip19: caip19Erc20(
						entityId.$network.chainId,
						entityId.$contract.address,
					),
					...((
						t,
					) => (
						t == null ?
							{}
						:	{
								$icon: {
									[EntityMetaKey.Id]: { url: t },
									type: MediaType.Image,
								},
							}
					))(
						alliumTokenImageHttpUrl(
							token.attributes?.image_url != null
							&& String(token.attributes.image_url).trim().length > 0 ?
								String(token.attributes.image_url).trim()
							:	undefined,
						),
					),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.ActorCoin,
			resolve: async (entityId, context) => {
				const { sourcePublicEnv } = await import('$/resolvers/$resolvers.ts')
				const { apiChainByChainId } = await import('$/sources/Allium/Rest/constants.ts')
				const { getAlliumLatestWalletBalances } = await import('$/sources/Allium/Rest/queries.ts')

				const publicEnv = sourcePublicEnv(context, Source.Allium_Rest)
				const apiChain = apiChainByChainId[entityId.$actor.$network.chainId]
				if (apiChain == null) throw new Error('Allium_Rest: chain not supported for wallet balances')

				const row = (
					(await getAlliumLatestWalletBalances({
						publicEnv,
						address: entityId.$actor.address,
						apiChain,
						withLiquidityInfo: false,
					})).items
						.find((candidate) => (
							candidate.token != null
							&& (
								entityId.$coinInstance.type === CoinInstanceType.NativeCurrency ?
									candidate.token.type === 'native'
								: entityId.$coinInstance.type === CoinInstanceType.Erc20Token ?
									candidate.token.type === 'evm_erc20'
									&& candidate.token.address.toLowerCase()
										=== entityId.$coinInstance.$contract.address.toLowerCase()
								:
									false
							)
						))
				)
				const token = row?.token
				if (
					row == null
					|| token == null
					|| row.raw_balance == null && row.raw_balance_str == null
					|| token.info == null
					|| token.info.symbol == null
					|| token.info.symbol.trim() === ''
					|| token.decimals == null
				) throw new Error('Allium_Rest: wallet token row incomplete')

				return {
					symbol: token.info.symbol.trim().toUpperCase(),
					decimals: token.decimals,
					balance: BigInt(row.raw_balance_str ?? String(row.raw_balance ?? 0)),
				}
			},
		}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.Actor,
			fieldName: '$$coins',
			resolve: async (entityId, context) => {
				const { sourcePublicEnv } = await import('$/resolvers/$resolvers.ts')
				const { apiChainByChainId } = await import('$/sources/Allium/Rest/constants.ts')
				const { getAlliumLatestWalletBalances } = await import('$/sources/Allium/Rest/queries.ts')
				type ActorCoinEntityId = import('$/schema/$schema.ts').EntityId<
					typeof import('$/schema/index.ts').schema,
					EntityType.ActorCoin
				>

				const publicEnv = sourcePublicEnv(context, Source.Allium_Rest)
				const apiChain = apiChainByChainId[entityId.$network.chainId]
				if (apiChain == null) {
					throw new Error(`Allium_Rest: chain ${entityId.$network.chainId} not supported for wallet balances`)
				}

				return (
					(await getAlliumLatestWalletBalances({
						publicEnv,
						address: entityId.address,
						apiChain,
						withLiquidityInfo: false,
					}))
						.items
						.flatMap<{ [EntityMetaKey.Id]: ActorCoinEntityId }>((balanceRow) => (
							balanceRow.token?.type === 'native' ?
								[{
									[EntityMetaKey.Id]: {
										$actor: entityId,
										$coinInstance: {
											$network: entityId.$network,
											type: CoinInstanceType.NativeCurrency,
										},
									},
								} satisfies { [EntityMetaKey.Id]: ActorCoinEntityId }]
							: balanceRow.token?.type === 'evm_erc20'
								&& Hex.isHex(balanceRow.token.address)
								&& Hex.size(balanceRow.token.address) === 20 ?
								((address) => (
									address == null ?
										[]
									:	[{
											[EntityMetaKey.Id]: {
												$actor: entityId,
												$coinInstance: {
													$network: entityId.$network,
													type: CoinInstanceType.Erc20Token,
													$contract: {
														$network: entityId.$network,
														address,
													},
												},
											},
										} satisfies { [EntityMetaKey.Id]: ActorCoinEntityId }]
								))(hexLowerOfByteSize(balanceRow.token.address.toLowerCase(), 20))
							:
								[]
						))
				)
			},
		}),
	],
}

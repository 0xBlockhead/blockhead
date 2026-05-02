import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$resolvers.ts'
import { Hex } from '@tevm/voltaire/Hex'
import { caip19Erc20, caip19Slip44 } from '$/lib/caip19.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { CoinInstanceType } from '$/schema/CoinInstance.ts'
import { MediaType } from '$/schema/Media.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'

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
				const { findChainByChainId } = await import('$/sources/Chainlist/Rest/rpcsJsonWire.ts')
				const { fetchRpcsJson } = await import('$/sources/Chainlist/Rest/queries.ts')

				const publicEnv = sourcePublicEnv(context, Source.Allium_Rest)
				if (entityId.type === CoinInstanceType.NativeCurrency) {
					const chain = findChainByChainId(
						await fetchRpcsJson(),
						entityId.$network.chainId,
					)
					if (chain == null) throw new Error('Allium_Rest: native coin chain not in chainlist')

					const symbol = chain.nativeCurrency.symbol.trim().toUpperCase()
					const coinId = coinBySymbol[symbol]?.id ?? CoinId.Unknown

					return {
						coinId,
						...(chain.nativeCurrency.name.trim() !== '' ? { name: chain.nativeCurrency.name.trim() } : {}),
						symbol,
						decimals: chain.nativeCurrency.decimals,
						...(chain.slip44 != null ?
							{
								caip19: caip19Slip44(
									entityId.$network.chainId,
									chain.slip44,
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
					...(token.attributes?.image_url?.trim() ?
						{
							$icon: {
								[EntityMetaKey.Id]: {
									url: token.attributes.image_url,
								},
								type: MediaType.Image,
							},
						}
					:
						{}),
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

				const publicEnv = sourcePublicEnv(context, Source.Allium_Rest)
				const apiChain = apiChainByChainId[entityId.$network.chainId]
				if (apiChain == null) return []

				return (
					(await getAlliumLatestWalletBalances({
						publicEnv,
						address: entityId.address,
						apiChain,
						withLiquidityInfo: false,
					}))
						.items
						.flatMap((balanceRow) => (
							balanceRow.token?.type === 'native' ?
								[{
									[EntityMetaKey.Id]: {
										$actor: entityId,
										$coinInstance: {
											$network: entityId.$network,
											type: CoinInstanceType.NativeCurrency,
										},
									},
								} as const]
							: balanceRow.token?.type === 'evm_erc20'
								&& Hex.isHex(balanceRow.token.address)
								&& Hex.size(balanceRow.token.address) === 20 ?
								[{
									[EntityMetaKey.Id]: {
										$actor: entityId,
										$coinInstance: {
											$network: entityId.$network,
											type: CoinInstanceType.Erc20Token,
											$contract: {
												$network: entityId.$network,
												address: balanceRow.token.address.toLowerCase() as `0x${string}`,
											},
										},
									},
								} as const]
							:
								[]
						))
				)
			},
		}),
	],
}

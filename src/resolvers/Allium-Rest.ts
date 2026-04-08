import { CoinInstanceType } from '$/schema/CoinInstance.ts'
import {
	defineEntityFieldResolver,
	defineEntityResolver,
} from '$/resolvers/$defineEntityResolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { alliumChainByChainId } from '$/sources/Allium/Rest/constants.ts'
import { getAlliumLatestWalletBalances } from '$/sources/Allium/Rest/queries.ts'
import { Source } from '$/sources/$Sources.ts'

const matchesCoinInstance = ({
	coinInstanceId,
	token,
}: {
	coinInstanceId: {
		type: string
		$contract?: {
			address: `0x${string}`
		}
	}
	token: {
		type?: string | null
		address?: string
	}
}) => (
	coinInstanceId.type === CoinInstanceType.NativeCurrency ?
		token.type === 'native'
	: coinInstanceId.type === CoinInstanceType.Erc20Token ?
		token.type === 'evm_erc20'
		&& typeof token.address === 'string'
		&& token.address.toLowerCase() === coinInstanceId.$contract?.address.toLowerCase()
	:
		false
)

export default {
	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.ActorCoin,
			source: Source.Allium,
			resolve: async (entityId) => {
				const alliumChain = alliumChainByChainId[entityId.$actor.$network.chainId]
				if (alliumChain == null) return {}

				const item = (
					(await getAlliumLatestWalletBalances({
						address: entityId.$actor.address,
						alliumChain,
						withLiquidityInfo: false,
					})).items
						.find((candidate) => (
							candidate.token != null
							&& matchesCoinInstance({
								coinInstanceId: entityId.$coinInstance,
								token: candidate.token,
							})
						))
				)

				if (item?.token?.info?.symbol == null || item.token.decimals == null) return {}

				return {
					symbol: item.token.info.symbol,
					decimals: item.token.decimals,
					balance: BigInt(item.raw_balance_str ?? String(item.raw_balance ?? 0)),
				}
			},
		}),
	],
	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType.Actor,
			fieldName: '$$coins',
			source: Source.Allium,
			resolve: async (entityId) => {
				const alliumChain = alliumChainByChainId[entityId.$network.chainId]
				if (alliumChain == null) return []

				const balances = await getAlliumLatestWalletBalances({
					address: entityId.address,
					alliumChain,
					withLiquidityInfo: false,
				})

				return (
					balances.items
						.map((item) => (
							item.token?.type === 'native' ?
								{
									[EntityMetaKey.Id]: {
										$actor: entityId,
										$coinInstance: {
											$network: entityId.$network,
											type: CoinInstanceType.NativeCurrency,
										},
									},
								}
							: item.token?.type === 'evm_erc20'
								&& typeof item.token.address === 'string'
								&& item.token.address.startsWith('0x') ?
								{
									[EntityMetaKey.Id]: {
										$actor: entityId,
										$coinInstance: {
											$network: entityId.$network,
											type: CoinInstanceType.Erc20Token,
											$contract: {
												$network: entityId.$network,
												address: item.token.address as `0x${string}`,
											},
										},
									},
								}
							:
								undefined
						))
						.filter((row) => row != null)
				)
			},
		}),
	],
}

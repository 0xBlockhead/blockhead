/**
 * Coin deployment rows for a logical {@link CoinId}, derived from CoinGecko coin + asset platforms.
 */

import { CoinInstanceRepresentation } from '$/constants/Bridge.ts'
import { CoinId } from '$/constants/Coin.ts'
import { CoinInstanceType } from '$/schema/CoinInstanceType.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import {
	getAssetPlatforms,
	getCoin,
} from '$/sources/Coingecko/Rest/queries.ts'
import type { CoingeckoCoin } from '$/sources/Coingecko/Rest/types.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'


type EvmNetworkEntitySelector = Extract<
	EntitySelector<typeof schema, EntityType.Network>,
	{ readonly caip2: unknown }
>
type EvmCoinInstanceEntitySelector = EntitySelector<
	typeof schema,
	EntityType.EvmCoinInstance
>

export type CoinInstanceEntitySelector =
	| (
		Omit<
			Exclude<
				EvmCoinInstanceEntitySelector,
				{ readonly $contract: unknown }
			>,
			'$network' | 'type'
		>
		& {
			readonly $network: EvmNetworkEntitySelector
			readonly type: CoinInstanceType.NativeCurrency
		}
	)
	| (
		Omit<
			Extract<
				EvmCoinInstanceEntitySelector,
				{ readonly $contract: unknown }
			>,
			'$network' | 'type'
		>
		& {
			readonly $network: EvmNetworkEntitySelector
			readonly type: CoinInstanceType.Erc20Token
		}
	)

type CoinInstanceStub = {
	[EntityMetaKey.Selector]: CoinInstanceEntitySelector
	representation: CoinInstanceRepresentation
}

const isEvmContractAddress = (value: string) => (
	/^0x[a-fA-F0-9]{40}$/.test(value.trim())
)

const coinInstanceEntitySelectorKey = (instanceId: CoinInstanceEntitySelector) => (
	[
		instanceId.$network.caip2.namespace,
		instanceId.$network.caip2.reference,
		instanceId.type,
		instanceId.type === CoinInstanceType.Erc20Token ?
			instanceId.$contract.address
		:
			'',
	].join(':')
)

const coinInstanceStubRowsFromCoingeckoCoin = (
	coinId: CoinId,
	coin: CoingeckoCoin,
	chainIdByPlatformId: ReadonlyMap<string, number>,
	nativeChainIds: readonly number[]
) => {
	const seenKeys = new Set<string>()
	const rows: CoinInstanceStub[] = []
	const nativePlatformId = coin.asset_platform_id
	const nativeChainId = (
		nativePlatformId != null
		&& nativePlatformId !== '' ?
			chainIdByPlatformId.get(nativePlatformId)
		:
			undefined
	)

	const pushRow = (instanceId: CoinInstanceEntitySelector) => {
		const key = coinInstanceEntitySelectorKey(instanceId)
		if (seenKeys.has(key)) return

		seenKeys.add(key)
		const symbolTrimmed = coin.symbol.trim()
		const isNativeChain = (
			nativeChainId != null
			&& Number(instanceId.$network.caip2.reference) === nativeChainId
		)
		rows.push({
			[EntityMetaKey.Selector]: instanceId,
			representation: (
				coinId === CoinId.USDC && /\.e$/i.test(symbolTrimmed) ?
					CoinInstanceRepresentation.BridgeWrapped
				: coinId === CoinId.USDC ?
					CoinInstanceRepresentation.IssuerNative
				: (
					coinId === CoinId.ETH
					&& instanceId.type === CoinInstanceType.Erc20Token
					&& isNativeChain === false
				) ?
					CoinInstanceRepresentation.CanonicalL2Native
				: coinId === CoinId.ETH && symbolTrimmed.toUpperCase().startsWith('W') ?
					CoinInstanceRepresentation.CanonicalL2Native
				: (
					coinId === CoinId.ETH
					&& instanceId.type === CoinInstanceType.NativeCurrency
				) ?
					CoinInstanceRepresentation.IssuerNative
				:
					CoinInstanceRepresentation.Unknown
			),
		})
	}

	for (const chainId of [
		...(nativeChainId == null ? [] : [nativeChainId]),
		...nativeChainIds,
	])
		pushRow({
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: String(chainId),
				},
			},
			type: CoinInstanceType.NativeCurrency,
		})

	for (const [platformId, rawAddress] of Object.entries(coin.platforms)) {
		const address = rawAddress.trim()
		if (!isEvmContractAddress(address)) continue

		const chainId = chainIdByPlatformId.get(platformId)
		if (chainId == null) continue

		pushRow({
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: String(chainId),
				},
			},
			type: CoinInstanceType.Erc20Token,
			$contract: {
				$network: {
					caip2: {
						namespace: 'eip155',
						reference: String(chainId),
					},
				},
				address: EvmAddress.assert(address.toLowerCase()),
			},
		})
	}

	return rows
}

export const fetchCoinInstanceStubsForCoin = async (
	coinId: EntitySelector<typeof schema, EntityType.Coin>['coinId'],
	publicEnv: SourcePublicEnv
) => {
	const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
	const coingeckoId = idByCoinId[coinId]
	if (coingeckoId == null)
		return []

	const [coin, assetPlatforms] = await Promise.all([
		getCoin({
			publicEnv,
			id: coingeckoId,
		}),
		getAssetPlatforms({ publicEnv }),
	])
	if (coin == null) return []

	const chainIdByPlatformId = new Map(
		assetPlatforms.flatMap((platform) => (
			platform.chain_identifier == null ?
				[]
			:
				[[
					platform.id,
					platform.chain_identifier,
				] as const]
		))
	)

	return coinInstanceStubRowsFromCoingeckoCoin(
		coinId,
		coin,
		chainIdByPlatformId,
		assetPlatforms
			.flatMap((platform) => (
				platform.native_coin_id === coingeckoId
				&& platform.chain_identifier != null ?
					[platform.chain_identifier]
				:
					[]
			))
	)
}

const coinInstanceByKeyForEnv = async (
	publicEnv: SourcePublicEnv
) => {
	const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
	const coinInstanceByKey = new Map<string, {
		coinId: CoinId
		row: CoinInstanceStub
	}>()

	for (const coinId of Object.keys(idByCoinId)) {
		const rows = await fetchCoinInstanceStubsForCoin(
			coinId,
			publicEnv
		)
		for (const row of rows) {
			coinInstanceByKey.set(
				coinInstanceEntitySelectorKey(row[EntityMetaKey.Selector]),
				{
					coinId,
					row,
				}
			)
		}
	}

	return coinInstanceByKey
}

export const resolveCoinIdForCoinInstanceEntitySelector = async (
	instanceId: CoinInstanceEntitySelector,
	publicEnv: SourcePublicEnv
) => (
	(await coinInstanceByKeyForEnv(publicEnv))
		.get(coinInstanceEntitySelectorKey(instanceId))
		?.coinId
	?? null
)

export const resolveCoinInstanceRepresentation = async (
	instanceId: CoinInstanceEntitySelector,
	publicEnv: SourcePublicEnv
) => (
	(await coinInstanceByKeyForEnv(publicEnv))
		.get(coinInstanceEntitySelectorKey(instanceId))
		?.row.representation
)

export const resolveCanonicalCoinInstanceEntitySelector = async (
	instanceId: CoinInstanceEntitySelector,
	publicEnv: SourcePublicEnv
) => {
	const coinInstanceByKey = await coinInstanceByKeyForEnv(publicEnv)
	const self = coinInstanceByKey.get(coinInstanceEntitySelectorKey(instanceId))
	if (self == null) return undefined
	const rows = [...coinInstanceByKey.values()]
		.filter(({ coinId }) => coinId === self.coinId)
		.map(({ row }) => row)

	if (self.row.representation === CoinInstanceRepresentation.BridgeWrapped) {
		const issuerNative = rows.find((row) => (
			row.representation === CoinInstanceRepresentation.IssuerNative
			&& row[EntityMetaKey.Selector].$network.caip2.reference === '1'
		))
		return issuerNative?.[EntityMetaKey.Selector]
	}

	if (self.row.representation === CoinInstanceRepresentation.CanonicalL2Native) {
		return rows.find((row) => (
			row.representation === CoinInstanceRepresentation.IssuerNative
			&& row[EntityMetaKey.Selector].type === CoinInstanceType.NativeCurrency
		))?.[EntityMetaKey.Selector]
	}

	return undefined
}

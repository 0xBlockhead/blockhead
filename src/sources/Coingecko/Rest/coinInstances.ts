/**
 * Coin deployment rows for a logical {@link CoinId}, derived from CoinGecko coin + asset platforms.
 */

import { CoinInstanceRepresentation } from '$/constants/Bridge.ts'
import { CoinId } from '$/constants/Coin.ts'
import {
	CoinInstanceType,
} from '$/schema/EvmCoinInstance.ts'
import { EvmAddress } from '$/schema/ZeroExHex.ts'
import { EntityMetaKey } from '$/schema/$schema.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { getCoinWithAssetPlatforms } from '$/sources/Coingecko/Rest/queries.ts'
import type { CoingeckoCoin } from '$/sources/Coingecko/Rest/types.ts'
import type { SourcePublicEnv } from '$/sources/$sources.ts'


type EvmNetworkEntitySelector = Extract<
	EntitySelector<typeof schema, EntityType.Network>,
	{ readonly caip2: unknown }
>

export type CoinInstanceEntitySelector =
	| (
		Omit<
			Exclude<
				EntitySelector<typeof schema, EntityType.EvmCoinInstance>,
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
				EntitySelector<typeof schema, EntityType.EvmCoinInstance>,
				{ readonly $contract: unknown }
			>,
			'$contract' | '$network' | 'type'
		>
		& {
			readonly $contract: Extract<
				EntitySelector<typeof schema, EntityType.EvmCoinInstance>,
				{ readonly $contract: unknown }
			>['$contract']
			readonly $network: EvmNetworkEntitySelector
			readonly type: CoinInstanceType.Erc20Token
		}
	)

export type CoinInstanceStub = {
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

	const nativePlatformId = coin.asset_platform_id ?? undefined
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
		const representation = (
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
		)
		rows.push({
			[EntityMetaKey.Selector]: instanceId,
			representation,
		})
	}

	for (const chainId of [
		...(nativeChainId == null ? [] : [nativeChainId]),
		...nativeChainIds,
	]) {
		pushRow({
			$network: { caip2: { namespace: 'eip155', reference: String(chainId) } },
			type: CoinInstanceType.NativeCurrency,
		})
	}

	for (const [platformId, rawAddress] of Object.entries(coin.platforms ?? {})) {
		if (typeof rawAddress !== 'string') continue
		const address = rawAddress.trim()
		if (!isEvmContractAddress(address)) continue
		const chainId = chainIdByPlatformId.get(platformId)
		if (chainId == null) continue

		pushRow({
			$network: { caip2: { namespace: 'eip155', reference: String(chainId) } },
			type: CoinInstanceType.Erc20Token,
			$contract: {
				$network: { caip2: { namespace: 'eip155', reference: String(chainId) } },
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

	const { coin, assetPlatforms } = await getCoinWithAssetPlatforms(
		publicEnv,
		coingeckoId
	)
	if (coin == null) return []

	const chainIdByPlatformId = new Map(
		assetPlatforms
			.filter((platform): platform is typeof platform & { chain_identifier: number } => (
				typeof platform.chain_identifier === 'number'
			))
			.map((platform) => [
				platform.id,
				platform.chain_identifier,
			])
	)

	return coinInstanceStubRowsFromCoingeckoCoin(
		coinId,
		coin,
		chainIdByPlatformId,
		assetPlatforms
			.flatMap((platform) => (
				platform.native_coin_id === coingeckoId
				&& typeof platform.chain_identifier === 'number' ?
					[platform.chain_identifier]
				:
					[]
			))
	)
}

const coinIdByInstanceKeyForEnv = async (
	publicEnv: SourcePublicEnv
) => {
	const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
	const map = new Map<string, CoinId>()

	for (const coinId of Object.keys(idByCoinId)) {
		const rows = await fetchCoinInstanceStubsForCoin(
			coinId,
			publicEnv
		)
		for (const row of rows) {
			map.set(coinInstanceEntitySelectorKey(row[EntityMetaKey.Selector]), coinId)
		}
	}

	return map
}

export const resolveCoinIdForCoinInstanceEntitySelector = async (
	instanceId: CoinInstanceEntitySelector,
	publicEnv: SourcePublicEnv
) => {
	const map = await coinIdByInstanceKeyForEnv(publicEnv)
	return map.get(coinInstanceEntitySelectorKey(instanceId)) ?? null
}

export const resolveCoinInstanceRepresentation = async (
	instanceId: CoinInstanceEntitySelector,
	publicEnv: SourcePublicEnv
) => {
	const coinId = await resolveCoinIdForCoinInstanceEntitySelector(
		instanceId,
		publicEnv
	)
	if (coinId == null) return undefined

	const rows = await fetchCoinInstanceStubsForCoin(coinId, publicEnv)
	const instanceKey = coinInstanceEntitySelectorKey(instanceId)
	return rows.find((row) => (
		coinInstanceEntitySelectorKey(row[EntityMetaKey.Selector]) === instanceKey
	))?.representation
}

export const resolveCanonicalCoinInstanceEntitySelector = async (
	instanceId: CoinInstanceEntitySelector,
	publicEnv: SourcePublicEnv
) => {
	const coinId = await resolveCoinIdForCoinInstanceEntitySelector(
		instanceId,
		publicEnv
	)
	if (coinId == null) return undefined

	const rows = await fetchCoinInstanceStubsForCoin(coinId, publicEnv)
	const instanceKey = coinInstanceEntitySelectorKey(instanceId)
	const self = rows.find((row) => (
		coinInstanceEntitySelectorKey(row[EntityMetaKey.Selector]) === instanceKey
	))
	if (self == null) return undefined

	if (self.representation === CoinInstanceRepresentation.BridgeWrapped) {
		const issuerNative = rows.find((row) => (
			row.representation === CoinInstanceRepresentation.IssuerNative
			&& row[EntityMetaKey.Selector].$network.caip2.reference === '1'
		))
		return issuerNative?.[EntityMetaKey.Selector]
	}

	if (self.representation === CoinInstanceRepresentation.CanonicalL2Native) {
		return rows.find((row) => (
			row.representation === CoinInstanceRepresentation.IssuerNative
			&& row[EntityMetaKey.Selector].type === CoinInstanceType.NativeCurrency
		))?.[EntityMetaKey.Selector]
	}

	return undefined
}

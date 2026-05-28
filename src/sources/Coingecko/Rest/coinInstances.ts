/**
 * Coin deployment rows for a logical {@link CoinId}, derived from CoinGecko coin + asset platforms.
 */

import { CoinInstanceRepresentation } from '$/constants/Bridge.ts'
import { CoinId } from '$/constants/Coin.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import { EvmAddress } from '$/schema/$ZeroExHex.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import type { EntityId } from '$/schema/$schema.ts'
import type { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { getCoingeckoCoinWithAssetPlatforms } from '$/sources/Coingecko/Rest/queries.ts'
import type { CoingeckoCoin } from '$/sources/Coingecko/Rest/types.ts'
import type {
	LifiToken,
	LifiTokensResponse,
} from '$/sources/Lifi/Rest/types.ts'
import type { SourcePublicEnvFor } from '$/sources/index.ts'
import { Source } from '$/sources/$Source.ts'
import { stringify } from 'devalue'


const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'

type CoinInstanceEntityId = EntityId<typeof schema, EntityType.EvmCoinInstance>

export type CoinInstanceStub = {
	[EntityMetaKey.Id]: CoinInstanceEntityId
	representation: CoinInstanceRepresentation
}

const isEvmContractAddress = (value: string) => (
	/^0x[a-fA-F0-9]{40}$/.test(value.trim())
)

const lifiCoinKeyByChainIdAndAddress = (
	tokensByChainId: LifiTokensResponse['tokens'],
) => {
	const lookup = new Map<string, string>()

	for (const [chainIdString, tokens] of Object.entries(tokensByChainId)) {
		for (const token of tokens) {
			const coinKey = token.coinKey?.trim()
			if (coinKey == null || coinKey === '') continue
			lookup.set(
				`${chainIdString}:${token.address.toLowerCase()}`,
				coinKey,
			)
		}
	}

	return lookup
}

const lifiCoinKeyForInstance = (
	instanceId: CoinInstanceEntityId,
	lookup: ReadonlyMap<string, string>,
) => {
	const chainId = Number(instanceId.$network.caip2.reference)
	const address = (
		instanceId.type === CoinInstanceType.NativeCurrency ?
			NATIVE_TOKEN_ADDRESS
		:
			instanceId.$contract.address
	)
	return lookup.get(`${chainId}:${address.toLowerCase()}`)
}

const coinInstanceStubRowsFromCoingeckoCoin = (
	coinId: CoinId,
	coin: CoingeckoCoin,
	chainIdByPlatformId: ReadonlyMap<string, number>,
	lifiCoinKeyByAddress: ReadonlyMap<string, string>,
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

	const pushRow = (instanceId: CoinInstanceEntityId) => {
		const key = stringify(instanceId)
		if (seenKeys.has(key)) return
		seenKeys.add(key)
		const symbolTrimmed = (coin.symbol ?? '').trim()
		const lifiCoinKeyTrimmed = lifiCoinKeyForInstance(instanceId, lifiCoinKeyByAddress)?.trim()
			const isNativeChain = (
				nativeChainId != null
				&& Number(instanceId.$network.caip2.reference) === nativeChainId
			)
		const representation = (
			coinId === CoinId.USDC
			&& lifiCoinKeyTrimmed != null
			&& lifiCoinKeyTrimmed !== '' ?
				(
					/\.?e$/i.test(lifiCoinKeyTrimmed)
					|| lifiCoinKeyTrimmed.toLowerCase() === 'usdce' ?
						CoinInstanceRepresentation.BridgeWrapped
					: lifiCoinKeyTrimmed.toUpperCase() === 'USDC' ?
						CoinInstanceRepresentation.IssuerNative
					:	CoinInstanceRepresentation.Unknown
				)
			: coinId === CoinId.USDC && /\.e$/i.test(symbolTrimmed) ?
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
			:	CoinInstanceRepresentation.Unknown
		)
		rows.push({
			[EntityMetaKey.Id]: instanceId,
			representation,
		})
	}

	if (nativeChainId != null) {
		pushRow({
			$network: { caip2: { namespace: 'eip155', reference: String(nativeChainId) } },
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
	coinId: EntityId<typeof schema, EntityType.Coin>['coinId'],
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
) => {
	const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
	const coingeckoId = idByCoinId[coinId]
	if (coingeckoId == null) return []

	const { coin, assetPlatforms } = await getCoingeckoCoinWithAssetPlatforms(publicEnv, coingeckoId)
	if (coin == null) return []

	const chainIdByPlatformId = new Map(
		assetPlatforms
			.filter((platform): platform is typeof platform & { chain_identifier: number } => (
				typeof platform.chain_identifier === 'number'
			))
			.map((platform) => [
				platform.id,
				platform.chain_identifier,
			]),
	)

	let lifiCoinKeyByAddress = new Map<string, string>()

	try {
		const { fetchLifiTokens } = await import('$/sources/Lifi/Rest/queries.ts')
		const { tokens } = await fetchLifiTokens({ chainTypes: 'EVM' })
		lifiCoinKeyByAddress = lifiCoinKeyByChainIdAndAddress(tokens)
	}
	catch {
		lifiCoinKeyByAddress = new Map()
	}

	return coinInstanceStubRowsFromCoingeckoCoin(
		coinId,
		coin,
		chainIdByPlatformId,
		lifiCoinKeyByAddress,
	)
}

const coinIdByInstanceKeyCaches = new Map<string, Map<string, CoinId>>()

const coinIdByInstanceKeyForEnv = async (
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
) => {
	const cacheKey = stringify(publicEnv)
	const cached = coinIdByInstanceKeyCaches.get(cacheKey)
	if (cached != null) {
		return cached
	}

	const { idByCoinId } = await import('$/sources/Coingecko/Rest/constants.ts')
	const map = new Map<string, CoinId>()

	for (const coinId of Object.keys(idByCoinId)) {
		const rows = await fetchCoinInstanceStubsForCoin(
			coinId,
			publicEnv,
		)
		for (const row of rows) {
			map.set(stringify(row[EntityMetaKey.Id]), coinId)
		}
	}

	coinIdByInstanceKeyCaches.set(cacheKey, map)
	return map
}

export const resolveCoinIdForCoinInstanceEntityId = async (
	instanceId: CoinInstanceEntityId,
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
) => {
	const map = await coinIdByInstanceKeyForEnv(publicEnv)
	return map.get(stringify(instanceId)) ?? null
}

export const resolveCoinInstanceRepresentation = async (
	instanceId: CoinInstanceEntityId,
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
) => {
	const coinId = await resolveCoinIdForCoinInstanceEntityId(instanceId, publicEnv)
	if (coinId == null) return undefined

	const rows = await fetchCoinInstanceStubsForCoin(coinId, publicEnv)
	const instanceKey = stringify(instanceId)
	return rows.find((row) => (
		stringify(row[EntityMetaKey.Id]) === instanceKey
	))?.representation
}

export const resolveCanonicalCoinInstanceEntityId = async (
	instanceId: CoinInstanceEntityId,
	publicEnv: SourcePublicEnvFor<Source.Coingecko_Rest>,
) => {
	const coinId = await resolveCoinIdForCoinInstanceEntityId(instanceId, publicEnv)
	if (coinId == null) return undefined

	const rows = await fetchCoinInstanceStubsForCoin(coinId, publicEnv)
	const instanceKey = stringify(instanceId)
	const self = rows.find((row) => (
		stringify(row[EntityMetaKey.Id]) === instanceKey
	))
	if (self == null) return undefined

	if (self.representation === CoinInstanceRepresentation.BridgeWrapped) {
			const issuerNative = rows.find((row) => (
				row.representation === CoinInstanceRepresentation.IssuerNative
				&& row[EntityMetaKey.Id].$network.caip2.reference === '1'
			))
		return issuerNative?.[EntityMetaKey.Id]
	}

	if (self.representation === CoinInstanceRepresentation.CanonicalL2Native) {
		return rows.find((row) => (
			row.representation === CoinInstanceRepresentation.IssuerNative
			&& row[EntityMetaKey.Id].type === CoinInstanceType.NativeCurrency
		))?.[EntityMetaKey.Id]
	}

	return undefined
}

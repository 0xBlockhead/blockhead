// Generated from APP.ts. Do not edit by hand.

import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { match as matchBridgeRouteStepIndex } from '$/params/bridgeRouteStepIndex.ts'
import { match as matchEip155ChainId } from '$/params/eip155ChainId.ts'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchEvmTopicHash } from '$/params/evmTopicHash.ts'
import { match as matchEvmTxHash } from '$/params/evmTxHash.ts'
import { match as matchFarcasterFid } from '$/params/farcasterFid.ts'
import { match as matchIpfsNamespace } from '$/params/ipfsNamespace.ts'
import { match as matchIso4217 } from '$/params/iso4217.ts'
import { match as matchMarketVenueId } from '$/params/marketVenueId.ts'
import { match as matchNativeCurrencySlug } from '$/params/nativeCurrencySlug.ts'
import { match as matchNetworkCaip2 } from '$/params/networkCaip2.ts'
import { match as matchNetworkSlug } from '$/params/networkSlug.ts'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchNonNegativeNumber } from '$/params/nonNegativeNumber.ts'
import { match as matchPolkadotAccountId } from '$/params/polkadotAccountId.ts'
import { match as matchProposalKindSlug } from '$/params/proposalKindSlug.ts'
import { match as matchProposalRef } from '$/params/proposalRef.ts'
import { match as matchRssItemIdentityKind } from '$/params/rssItemIdentityKind.ts'
import { match as matchSolanaPubkey } from '$/params/solanaPubkey.ts'
import { match as matchSolanaSignature } from '$/params/solanaSignature.ts'
import { match as matchSpecificationRealmSlug } from '$/params/specificationRealmSlug.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { match as matchUserOperationHash } from '$/params/userOperationHash.ts'
import { match as matchUtxoTxId } from '$/params/utxoTxId.ts'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'

export type E2eRouteFixtureParams = Readonly<Partial<Record<string, string>>>

const requiredE2eRouteParam = (
	params: E2eRouteFixtureParams,
	routeId: string,
	paramName: string
) => {
	const value = params[paramName]
	if (value == null || value === '')
		throw new Error(`${routeId} is missing required route parameter ${paramName}`)
	return value
}

const encodeE2eRouteParam = (value: string, encoding: 'Opaque' | 'Path') => (
	encoding === 'Opaque' ?
		encodeURIComponent(value)
	:
		value.split('/').map(encodeURIComponent).join('/')
)

export const e2eRouteParamMatcherByName = {
	iso4217: matchIso4217,
	nonNegativeInteger: matchNonNegativeInteger,
	stringSegment: matchStringSegment,
	marketVenueId: matchMarketVenueId,
	eip155ChainId: matchEip155ChainId,
	nativeCurrencySlug: matchNativeCurrencySlug,
	evmAddress: matchEvmAddress,
	nonNegativeBigInt: matchNonNegativeBigInt,
	ipfsNamespace: matchIpfsNamespace,
	networkCaip2: matchNetworkCaip2,
	networkSlug: matchNetworkSlug,
	polkadotAccountId: matchPolkadotAccountId,
	solanaPubkey: matchSolanaPubkey,
	evmTxHash: matchEvmTxHash,
	solanaSignature: matchSolanaSignature,
	utxoTxId: matchUtxoTxId,
	absoluteUrl: matchAbsoluteUrl,
	zeroExHex: matchZeroExHex,
	userOperationHash: matchUserOperationHash,
	evmTopicHash: matchEvmTopicHash,
	specificationRealmSlug: matchSpecificationRealmSlug,
	proposalKindSlug: matchProposalKindSlug,
	proposalRef: matchProposalRef,
	farcasterFid: matchFarcasterFid,
	rssItemIdentityKind: matchRssItemIdentityKind,
	nonNegativeNumber: matchNonNegativeNumber,
	bridgeRouteStepIndex: matchBridgeRouteStepIndex,
} as const

export type E2eRouteProbeCase = {
	id: string
	params: Readonly<Record<string, string>>
}

export type E2eRouteFixtureMapping = {
	id: string
	routeKind: string
	projectionEntity?: string
	probeCases: readonly E2eRouteProbeCase[]
	projectionPath?: readonly [string, ...string[]]
	boundaryLiveOptional?: true
}

export type E2eRouteFixtureMetadata = {
	nodeId: string
	probeOwnerNodeId?: string
	routeId: string
	publicPath: string
	parameterMatchers: Readonly<Record<string, readonly (keyof typeof e2eRouteParamMatcherByName)[]>>
	mappings: readonly E2eRouteFixtureMapping[]
	resolve: (params: E2eRouteFixtureParams) => string
	boundaryLiveOptional?: true
}

export const e2eRouteFixtureMetadataByNodeId = {
	'/(assets)/(currencies)/currency/[iso4217]': {
		nodeId: '/(assets)/(currencies)/currency/[iso4217]',
		probeOwnerNodeId: '/(assets)/(currencies)/currency/[iso4217]',
		routeId: '/(assets)/(currencies)/currency/[iso4217=iso4217]',
		publicPath: '/currency/[iso4217]',
		parameterMatchers: {
			iso4217: [
				'iso4217',
			],
		},
		mappings: [
			{
				id: 'Currency.Iso4217',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							iso4217: '/currency/[iso4217]:Currency.Iso4217.1.iso4217',
						},
					},
				],
			},
		],
		resolve: (params) => ['/currency/', requiredE2eRouteParam(params, '/(assets)/(currencies)/currency/[iso4217=iso4217]', 'iso4217')].join(''),
	},
	'/(assets)/(currencies)/currency/[iso4217]/observations/[timestampMs]': {
		nodeId: '/(assets)/(currencies)/currency/[iso4217]/observations/[timestampMs]',
		probeOwnerNodeId: '/(assets)/(currencies)/currency/[iso4217]/observations/[timestampMs]',
		routeId: '/(assets)/(currencies)/currency/[iso4217=iso4217]/(currency)/observations/[timestampMs=nonNegativeInteger]',
		publicPath: '/currency/[iso4217]/observations/[timestampMs]',
		parameterMatchers: {
			iso4217: [
				'iso4217',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'Currency_Timestamp.CurrencyTimestampMs',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							iso4217: '/currency/[iso4217]/observations/[timestampMs]:Currency_Timestamp.CurrencyTimestampMs.1.iso4217',
							timestampMs: '/currency/[iso4217]/observations/[timestampMs]:Currency_Timestamp.CurrencyTimestampMs.1.timestampMs',
						},
					},
				],
			},
		],
		resolve: (params) => ['/currency/', requiredE2eRouteParam(params, '/(assets)/(currencies)/currency/[iso4217=iso4217]/(currency)/observations/[timestampMs=nonNegativeInteger]', 'iso4217'), '/observations/', requiredE2eRouteParam(params, '/(assets)/(currencies)/currency/[iso4217=iso4217]/(currency)/observations/[timestampMs=nonNegativeInteger]', 'timestampMs')].join(''),
	},
	'/(assets)/(marketAssets)/market-asset/[kind]/[assetKey]': {
		nodeId: '/(assets)/(marketAssets)/market-asset/[kind]/[assetKey]',
		probeOwnerNodeId: '/(assets)/(marketAssets)/market-asset/[kind]/[assetKey]',
		routeId: '/(assets)/(marketAssets)/market-asset/[kind=stringSegment]/[assetKey=stringSegment]',
		publicPath: '/market-asset/[kind]/[assetKey]',
		parameterMatchers: {
			kind: [
				'stringSegment',
			],
			assetKey: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'MarketAsset.KindAssetKey',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							kind: '/market-asset/[kind]/[assetKey]:MarketAsset.KindAssetKey.1.kind',
							assetKey: '/market-asset/[kind]/[assetKey]:MarketAsset.KindAssetKey.1.assetKey',
						},
					},
				],
			},
		],
		resolve: (params) => ['/market-asset/', requiredE2eRouteParam(params, '/(assets)/(marketAssets)/market-asset/[kind=stringSegment]/[assetKey=stringSegment]', 'kind'), '/', requiredE2eRouteParam(params, '/(assets)/(marketAssets)/market-asset/[kind=stringSegment]/[assetKey=stringSegment]', 'assetKey')].join(''),
	},
	'/(assets)/(marketVenues)/market-venue/[marketVenueId]': {
		nodeId: '/(assets)/(marketVenues)/market-venue/[marketVenueId]',
		probeOwnerNodeId: '/(assets)/(marketVenues)/market-venue/[marketVenueId]',
		routeId: '/(assets)/(marketVenues)/market-venue/[marketVenueId=marketVenueId]',
		publicPath: '/market-venue/[marketVenueId]',
		parameterMatchers: {
			marketVenueId: [
				'marketVenueId',
			],
		},
		mappings: [
			{
				id: 'MarketVenue.MarketVenueId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							marketVenueId: '/market-venue/[marketVenueId]:MarketVenue.MarketVenueId.1.marketVenueId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/market-venue/', requiredE2eRouteParam(params, '/(assets)/(marketVenues)/market-venue/[marketVenueId=marketVenueId]', 'marketVenueId')].join(''),
	},
	'/(assets)/bridge-capability/[fromChainId]/[fromCoinInstanceSlug]/[toChainId]/[toCoinInstanceSlug]/[toolKey]': {
		nodeId: '/(assets)/bridge-capability/[fromChainId]/[fromCoinInstanceSlug]/[toChainId]/[toCoinInstanceSlug]/[toolKey]',
		probeOwnerNodeId: '/(assets)/bridge-capability/[fromChainId]/[fromCoinInstanceSlug]/[toChainId]/[toCoinInstanceSlug]/[toolKey]',
		routeId: '/(assets)/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toChainId=eip155ChainId]/[toCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toolKey=stringSegment]',
		publicPath: '/bridge-capability/[fromChainId]/[fromCoinInstanceSlug]/[toChainId]/[toCoinInstanceSlug]/[toolKey]',
		parameterMatchers: {
			fromChainId: [
				'eip155ChainId',
			],
			fromCoinInstanceSlug: [
				'nativeCurrencySlug',
				'evmAddress',
			],
			toChainId: [
				'eip155ChainId',
			],
			toCoinInstanceSlug: [
				'nativeCurrencySlug',
				'evmAddress',
			],
			toolKey: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'CoinBridgeCapability.EvmCoinInstanceEvmCoinInstanceToolKey',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							fromChainId: '/bridge-capability/[fromChainId]/[fromCoinInstanceSlug]/[toChainId]/[toCoinInstanceSlug]/[toolKey]:CoinBridgeCapability.EvmCoinInstanceEvmCoinInstanceToolKey.1.fromChainId',
							fromCoinInstanceSlug: '/bridge-capability/[fromChainId]/[fromCoinInstanceSlug]/[toChainId]/[toCoinInstanceSlug]/[toolKey]:CoinBridgeCapability.EvmCoinInstanceEvmCoinInstanceToolKey.1.fromCoinInstanceSlug',
							toChainId: '/bridge-capability/[fromChainId]/[fromCoinInstanceSlug]/[toChainId]/[toCoinInstanceSlug]/[toolKey]:CoinBridgeCapability.EvmCoinInstanceEvmCoinInstanceToolKey.1.toChainId',
							toCoinInstanceSlug: '/bridge-capability/[fromChainId]/[fromCoinInstanceSlug]/[toChainId]/[toCoinInstanceSlug]/[toolKey]:CoinBridgeCapability.EvmCoinInstanceEvmCoinInstanceToolKey.1.toCoinInstanceSlug',
							toolKey: '/bridge-capability/[fromChainId]/[fromCoinInstanceSlug]/[toChainId]/[toCoinInstanceSlug]/[toolKey]:CoinBridgeCapability.EvmCoinInstanceEvmCoinInstanceToolKey.1.toolKey',
						},
					},
				],
			},
		],
		resolve: (params) => ['/bridge-capability/', requiredE2eRouteParam(params, '/(assets)/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toChainId=eip155ChainId]/[toCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toolKey=stringSegment]', 'fromChainId'), '/', requiredE2eRouteParam(params, '/(assets)/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toChainId=eip155ChainId]/[toCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toolKey=stringSegment]', 'fromCoinInstanceSlug'), '/', requiredE2eRouteParam(params, '/(assets)/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toChainId=eip155ChainId]/[toCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toolKey=stringSegment]', 'toChainId'), '/', requiredE2eRouteParam(params, '/(assets)/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toChainId=eip155ChainId]/[toCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toolKey=stringSegment]', 'toCoinInstanceSlug'), '/', requiredE2eRouteParam(params, '/(assets)/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toChainId=eip155ChainId]/[toCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toolKey=stringSegment]', 'toolKey')].join(''),
	},
	'/(assets)/coin-instance/[chainId]/[coinInstanceSlug]': {
		nodeId: '/(assets)/coin-instance/[chainId]/[coinInstanceSlug]',
		probeOwnerNodeId: '/(assets)/coin-instance/[chainId]/[coinInstanceSlug]',
		routeId: '/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]',
		publicPath: '/coin-instance/[chainId]/[coinInstanceSlug]',
		parameterMatchers: {
			chainId: [
				'eip155ChainId',
			],
			coinInstanceSlug: [
				'nativeCurrencySlug',
				'evmAddress',
			],
		},
		mappings: [
			{
				id: 'EvmCoinInstance.NetworkType',
				routeKind: 'projection',
				projectionEntity: 'EvmCoinInstance',
				probeCases: [
					{
						id: 'default',
						params: {
							chainId: '/coin-instance/[chainId]/[coinInstanceSlug]:EvmCoinInstance.NetworkType.1.chainId',
							coinInstanceSlug: '/coin-instance/[chainId]/[coinInstanceSlug]:EvmCoinInstance.NetworkType.1.coinInstanceSlug',
						},
					},
				],
				projectionPath: [
					'NativeCurrency',
				],
			},
			{
				id: 'EvmCoinInstance.NetworkTypeContract',
				routeKind: 'projection',
				projectionEntity: 'EvmCoinInstance',
				probeCases: [
					{
						id: 'default',
						params: {
							chainId: '/coin-instance/[chainId]/[coinInstanceSlug]:EvmCoinInstance.NetworkTypeContract.1.chainId',
							coinInstanceSlug: '/coin-instance/[chainId]/[coinInstanceSlug]:EvmCoinInstance.NetworkTypeContract.1.coinInstanceSlug',
						},
					},
				],
				projectionPath: [
					'Erc20Token',
				],
			},
		],
		resolve: (params) => ['/coin-instance/', requiredE2eRouteParam(params, '/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', 'chainId'), '/', requiredE2eRouteParam(params, '/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', 'coinInstanceSlug')].join(''),
	},
	'/(assets)/coin/[coinId]': {
		nodeId: '/(assets)/coin/[coinId]',
		probeOwnerNodeId: '/(assets)/coin/[coinId]',
		routeId: '/(assets)/coin/[coinId=stringSegment]',
		publicPath: '/coin/[coinId]',
		parameterMatchers: {
			coinId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'Coin.CoinId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							coinId: '/coin/[coinId]:Coin.CoinId.1.coinId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/coin/', requiredE2eRouteParam(params, '/(assets)/coin/[coinId=stringSegment]', 'coinId')].join(''),
	},
	'/(assets)/coin/[coinId]/observations/[timestampMs]/[source]': {
		nodeId: '/(assets)/coin/[coinId]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(assets)/coin/[coinId]/observations/[timestampMs]/[source]',
		routeId: '/(assets)/coin/[coinId=stringSegment]/(coin)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/coin/[coinId]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			coinId: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'Coin_Timestamp.CoinTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							coinId: '/coin/[coinId]/observations/[timestampMs]/[source]:Coin_Timestamp.CoinTimestampMsSource.1.coinId',
							timestampMs: '/coin/[coinId]/observations/[timestampMs]/[source]:Coin_Timestamp.CoinTimestampMsSource.1.timestampMs',
							source: '/coin/[coinId]/observations/[timestampMs]/[source]:Coin_Timestamp.CoinTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/coin/', requiredE2eRouteParam(params, '/(assets)/coin/[coinId=stringSegment]/(coin)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'coinId'), '/observations/', requiredE2eRouteParam(params, '/(assets)/coin/[coinId=stringSegment]/(coin)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(assets)/coin/[coinId=stringSegment]/(coin)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(assets)/pool/[chainId]/[poolId]': {
		nodeId: '/(assets)/pool/[chainId]/[poolId]',
		probeOwnerNodeId: '/(assets)/pool/[chainId]/[poolId]',
		routeId: '/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]',
		publicPath: '/pool/[chainId]/[poolId]',
		parameterMatchers: {
			chainId: [
				'eip155ChainId',
			],
			poolId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'LiquidityPool.EvmNetworkId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							chainId: '/pool/[chainId]/[poolId]:LiquidityPool.EvmNetworkId.1.chainId',
							poolId: '/pool/[chainId]/[poolId]:LiquidityPool.EvmNetworkId.1.poolId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/pool/', requiredE2eRouteParam(params, '/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]', 'chainId'), '/', requiredE2eRouteParam(params, '/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]', 'poolId')].join(''),
	},
	'/(assets)/pool/[chainId]/[poolId]/block/[blockNumber]': {
		nodeId: '/(assets)/pool/[chainId]/[poolId]/block/[blockNumber]',
		probeOwnerNodeId: '/(assets)/pool/[chainId]/[poolId]/block/[blockNumber]',
		routeId: '/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/block/[blockNumber=nonNegativeBigInt]',
		publicPath: '/pool/[chainId]/[poolId]/block/[blockNumber]',
		parameterMatchers: {
			chainId: [
				'eip155ChainId',
			],
			poolId: [
				'stringSegment',
			],
			blockNumber: [
				'nonNegativeBigInt',
			],
		},
		mappings: [
			{
				id: 'LiquidityPool_Block.LiquidityPoolBlockNumber',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							chainId: '/pool/[chainId]/[poolId]/block/[blockNumber]:LiquidityPool_Block.LiquidityPoolBlockNumber.1.chainId',
							poolId: '/pool/[chainId]/[poolId]/block/[blockNumber]:LiquidityPool_Block.LiquidityPoolBlockNumber.1.poolId',
							blockNumber: '/pool/[chainId]/[poolId]/block/[blockNumber]:LiquidityPool_Block.LiquidityPoolBlockNumber.1.blockNumber',
						},
					},
				],
			},
		],
		resolve: (params) => ['/pool/', requiredE2eRouteParam(params, '/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/block/[blockNumber=nonNegativeBigInt]', 'chainId'), '/', requiredE2eRouteParam(params, '/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/block/[blockNumber=nonNegativeBigInt]', 'poolId'), '/block/', requiredE2eRouteParam(params, '/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/block/[blockNumber=nonNegativeBigInt]', 'blockNumber')].join(''),
	},
	'/(assets)/pool/[chainId]/[poolId]/observations/[timestampMs]/[feedKey]': {
		nodeId: '/(assets)/pool/[chainId]/[poolId]/observations/[timestampMs]/[feedKey]',
		probeOwnerNodeId: '/(assets)/pool/[chainId]/[poolId]/observations/[timestampMs]/[feedKey]',
		routeId: '/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/observations/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]',
		publicPath: '/pool/[chainId]/[poolId]/observations/[timestampMs]/[feedKey]',
		parameterMatchers: {
			chainId: [
				'eip155ChainId',
			],
			poolId: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			feedKey: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'LiquidityPool_Timestamp.LiquidityPoolTimestampMsFeedKey',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							chainId: '/pool/[chainId]/[poolId]/observations/[timestampMs]/[feedKey]:LiquidityPool_Timestamp.LiquidityPoolTimestampMsFeedKey.1.chainId',
							poolId: '/pool/[chainId]/[poolId]/observations/[timestampMs]/[feedKey]:LiquidityPool_Timestamp.LiquidityPoolTimestampMsFeedKey.1.poolId',
							timestampMs: '/pool/[chainId]/[poolId]/observations/[timestampMs]/[feedKey]:LiquidityPool_Timestamp.LiquidityPoolTimestampMsFeedKey.1.timestampMs',
							feedKey: '/pool/[chainId]/[poolId]/observations/[timestampMs]/[feedKey]:LiquidityPool_Timestamp.LiquidityPoolTimestampMsFeedKey.1.feedKey',
						},
					},
				],
			},
		],
		resolve: (params) => ['/pool/', requiredE2eRouteParam(params, '/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/observations/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'chainId'), '/', requiredE2eRouteParam(params, '/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/observations/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'poolId'), '/observations/', requiredE2eRouteParam(params, '/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/observations/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'timestampMs'), '/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/observations/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'feedKey'), 'Opaque')].join(''),
	},
	'/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]': {
		nodeId: '/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]',
		probeOwnerNodeId: '/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]',
		routeId: '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]',
		publicPath: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]',
		parameterMatchers: {
			marketVenue: [
				'marketVenueId',
			],
			baseKind: [
				'stringSegment',
			],
			base: [
				'stringSegment',
			],
			quoteKind: [
				'stringSegment',
			],
			quote: [
				'stringSegment',
			],
			marketKind: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'Market.BaseQuoteMarketVenueKind',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							marketVenue: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]:Market.BaseQuoteMarketVenueKind.1.marketVenue',
							baseKind: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]:Market.BaseQuoteMarketVenueKind.1.baseKind',
							base: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]:Market.BaseQuoteMarketVenueKind.1.base',
							quoteKind: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]:Market.BaseQuoteMarketVenueKind.1.quoteKind',
							quote: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]:Market.BaseQuoteMarketVenueKind.1.quote',
							marketKind: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]:Market.BaseQuoteMarketVenueKind.1.marketKind',
						},
					},
				],
			},
		],
		resolve: (params) => ['/venue/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', 'marketVenue'), '/market/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', 'baseKind'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', 'base'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', 'quoteKind'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', 'quote'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]', 'marketKind')].join(''),
	},
	'/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]': {
		nodeId: '/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]',
		probeOwnerNodeId: '/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]',
		routeId: '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]',
		publicPath: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]',
		parameterMatchers: {
			marketVenue: [
				'marketVenueId',
			],
			baseKind: [
				'stringSegment',
			],
			base: [
				'stringSegment',
			],
			quoteKind: [
				'stringSegment',
			],
			quote: [
				'stringSegment',
			],
			marketKind: [
				'stringSegment',
			],
			timeIntervalUnit: [
				'stringSegment',
			],
			timeIntervalValue: [
				'nonNegativeInteger',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'Market_TimeInterval_Timestamp.MarketTimeIntervalTimestampMs',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							marketVenue: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]:Market_TimeInterval_Timestamp.MarketTimeIntervalTimestampMs.1.marketVenue',
							baseKind: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]:Market_TimeInterval_Timestamp.MarketTimeIntervalTimestampMs.1.baseKind',
							base: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]:Market_TimeInterval_Timestamp.MarketTimeIntervalTimestampMs.1.base',
							quoteKind: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]:Market_TimeInterval_Timestamp.MarketTimeIntervalTimestampMs.1.quoteKind',
							quote: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]:Market_TimeInterval_Timestamp.MarketTimeIntervalTimestampMs.1.quote',
							marketKind: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]:Market_TimeInterval_Timestamp.MarketTimeIntervalTimestampMs.1.marketKind',
							timeIntervalUnit: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]:Market_TimeInterval_Timestamp.MarketTimeIntervalTimestampMs.1.timeIntervalUnit',
							timeIntervalValue: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]:Market_TimeInterval_Timestamp.MarketTimeIntervalTimestampMs.1.timeIntervalValue',
							timestampMs: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]:Market_TimeInterval_Timestamp.MarketTimeIntervalTimestampMs.1.timestampMs',
						},
					},
				],
			},
		],
		resolve: (params) => ['/venue/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]', 'marketVenue'), '/market/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]', 'baseKind'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]', 'base'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]', 'quoteKind'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]', 'quote'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]', 'marketKind'), '/candles/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]', 'timeIntervalUnit'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]', 'timeIntervalValue'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]', 'timestampMs')].join(''),
	},
	'/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs]/[feedKey]': {
		nodeId: '/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs]/[feedKey]',
		probeOwnerNodeId: '/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs]/[feedKey]',
		routeId: '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/derivatives/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]',
		publicPath: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs]/[feedKey]',
		parameterMatchers: {
			marketVenue: [
				'marketVenueId',
			],
			baseKind: [
				'stringSegment',
			],
			base: [
				'stringSegment',
			],
			quoteKind: [
				'stringSegment',
			],
			quote: [
				'stringSegment',
			],
			marketKind: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			feedKey: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'Market_Derivative_Timestamp.MarketTimestampMsFeedKey',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							marketVenue: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs]/[feedKey]:Market_Derivative_Timestamp.MarketTimestampMsFeedKey.1.marketVenue',
							baseKind: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs]/[feedKey]:Market_Derivative_Timestamp.MarketTimestampMsFeedKey.1.baseKind',
							base: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs]/[feedKey]:Market_Derivative_Timestamp.MarketTimestampMsFeedKey.1.base',
							quoteKind: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs]/[feedKey]:Market_Derivative_Timestamp.MarketTimestampMsFeedKey.1.quoteKind',
							quote: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs]/[feedKey]:Market_Derivative_Timestamp.MarketTimestampMsFeedKey.1.quote',
							marketKind: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs]/[feedKey]:Market_Derivative_Timestamp.MarketTimestampMsFeedKey.1.marketKind',
							timestampMs: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs]/[feedKey]:Market_Derivative_Timestamp.MarketTimestampMsFeedKey.1.timestampMs',
							feedKey: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs]/[feedKey]:Market_Derivative_Timestamp.MarketTimestampMsFeedKey.1.feedKey',
						},
					},
				],
			},
		],
		resolve: (params) => ['/venue/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/derivatives/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'marketVenue'), '/market/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/derivatives/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'baseKind'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/derivatives/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'base'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/derivatives/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'quoteKind'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/derivatives/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'quote'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/derivatives/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'marketKind'), '/derivatives/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/derivatives/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'timestampMs'), '/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/derivatives/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'feedKey'), 'Opaque')].join(''),
	},
	'/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price': {
		nodeId: '/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price',
		probeOwnerNodeId: '/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price',
		routeId: '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price',
		publicPath: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price',
		parameterMatchers: {
			marketVenue: [
				'marketVenueId',
			],
			baseKind: [
				'stringSegment',
			],
			base: [
				'stringSegment',
			],
			quoteKind: [
				'stringSegment',
			],
			quote: [
				'stringSegment',
			],
			marketKind: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'MarketPrice.Market',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							marketVenue: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price:MarketPrice.Market.1.marketVenue',
							baseKind: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price:MarketPrice.Market.1.baseKind',
							base: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price:MarketPrice.Market.1.base',
							quoteKind: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price:MarketPrice.Market.1.quoteKind',
							quote: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price:MarketPrice.Market.1.quote',
							marketKind: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price:MarketPrice.Market.1.marketKind',
						},
					},
				],
			},
		],
		resolve: (params) => ['/venue/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price', 'marketVenue'), '/market/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price', 'baseKind'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price', 'base'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price', 'quoteKind'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price', 'quote'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price', 'marketKind'), '/price'].join(''),
	},
	'/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs]/[feedKey]': {
		nodeId: '/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs]/[feedKey]',
		probeOwnerNodeId: '/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs]/[feedKey]',
		routeId: '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price/(marketPrice)/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]',
		publicPath: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs]/[feedKey]',
		parameterMatchers: {
			marketVenue: [
				'marketVenueId',
			],
			baseKind: [
				'stringSegment',
			],
			base: [
				'stringSegment',
			],
			quoteKind: [
				'stringSegment',
			],
			quote: [
				'stringSegment',
			],
			marketKind: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			feedKey: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'Market_Timestamp.MarketTimestampMsFeedKey',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							marketVenue: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs]/[feedKey]:Market_Timestamp.MarketTimestampMsFeedKey.1.marketVenue',
							baseKind: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs]/[feedKey]:Market_Timestamp.MarketTimestampMsFeedKey.1.baseKind',
							base: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs]/[feedKey]:Market_Timestamp.MarketTimestampMsFeedKey.1.base',
							quoteKind: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs]/[feedKey]:Market_Timestamp.MarketTimestampMsFeedKey.1.quoteKind',
							quote: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs]/[feedKey]:Market_Timestamp.MarketTimestampMsFeedKey.1.quote',
							marketKind: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs]/[feedKey]:Market_Timestamp.MarketTimestampMsFeedKey.1.marketKind',
							timestampMs: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs]/[feedKey]:Market_Timestamp.MarketTimestampMsFeedKey.1.timestampMs',
							feedKey: '/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs]/[feedKey]:Market_Timestamp.MarketTimestampMsFeedKey.1.feedKey',
						},
					},
				],
			},
		],
		resolve: (params) => ['/venue/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price/(marketPrice)/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'marketVenue'), '/market/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price/(marketPrice)/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'baseKind'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price/(marketPrice)/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'base'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price/(marketPrice)/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'quoteKind'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price/(marketPrice)/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'quote'), '/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price/(marketPrice)/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'marketKind'), '/price/quotes/', requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price/(marketPrice)/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'timestampMs'), '/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price/(marketPrice)/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]', 'feedKey'), 'Opaque')].join(''),
	},
	'/(explore)/(ens)/ens/name/[ensName]': {
		nodeId: '/(explore)/(ens)/ens/name/[ensName]',
		probeOwnerNodeId: '/(explore)/(ens)/ens/name/[ensName]',
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]',
		publicPath: '/ens/name/[ensName]',
		parameterMatchers: {
			ensName: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'EnsName.NormalizedName',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							ensName: '/ens/name/[ensName]:EnsName.NormalizedName.1.ensName',
						},
					},
				],
			},
		],
		resolve: (params) => ['/ens/name/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]', 'ensName'), 'Opaque')].join(''),
	},
	'/(explore)/(ens)/ens/name/[ensName]/observations/[timestampMs]/[source]': {
		nodeId: '/(explore)/(ens)/ens/name/[ensName]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/(ens)/ens/name/[ensName]/observations/[timestampMs]/[source]',
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/ens/name/[ensName]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			ensName: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'EnsName_Timestamp.NameTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							ensName: '/ens/name/[ensName]/observations/[timestampMs]/[source]:EnsName_Timestamp.NameTimestampMsSource.1.ensName',
							timestampMs: '/ens/name/[ensName]/observations/[timestampMs]/[source]:EnsName_Timestamp.NameTimestampMsSource.1.timestampMs',
							source: '/ens/name/[ensName]/observations/[timestampMs]/[source]:EnsName_Timestamp.NameTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/ens/name/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'ensName'), 'Opaque'), '/observations/', requiredE2eRouteParam(params, '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(ens)/ens/name/[ensName]/record/[recordId]': {
		nodeId: '/(explore)/(ens)/ens/name/[ensName]/record/[recordId]',
		probeOwnerNodeId: '/(explore)/(ens)/ens/name/[ensName]/record/[recordId]',
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/record/[recordId=stringSegment]',
		publicPath: '/ens/name/[ensName]/record/[recordId]',
		parameterMatchers: {
			ensName: [
				'stringSegment',
			],
			recordId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'EnsRecord.NameRecordKey',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							ensName: '/ens/name/[ensName]/record/[recordId]:EnsRecord.NameRecordKey.1.ensName',
							recordId: '/ens/name/[ensName]/record/[recordId]:EnsRecord.NameRecordKey.1.recordId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/ens/name/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/record/[recordId=stringSegment]', 'ensName'), 'Opaque'), '/record/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/record/[recordId=stringSegment]', 'recordId'), 'Opaque')].join(''),
	},
	'/(explore)/(ens)/ens/name/[ensName]/record/[recordId]/observations/[timestampMs]/[source]': {
		nodeId: '/(explore)/(ens)/ens/name/[ensName]/record/[recordId]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/(ens)/ens/name/[ensName]/record/[recordId]/observations/[timestampMs]/[source]',
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/record/[recordId=stringSegment]/(ensRecord)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/ens/name/[ensName]/record/[recordId]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			ensName: [
				'stringSegment',
			],
			recordId: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'EnsRecord_Timestamp.RecordTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							ensName: '/ens/name/[ensName]/record/[recordId]/observations/[timestampMs]/[source]:EnsRecord_Timestamp.RecordTimestampMsSource.1.ensName',
							recordId: '/ens/name/[ensName]/record/[recordId]/observations/[timestampMs]/[source]:EnsRecord_Timestamp.RecordTimestampMsSource.1.recordId',
							timestampMs: '/ens/name/[ensName]/record/[recordId]/observations/[timestampMs]/[source]:EnsRecord_Timestamp.RecordTimestampMsSource.1.timestampMs',
							source: '/ens/name/[ensName]/record/[recordId]/observations/[timestampMs]/[source]:EnsRecord_Timestamp.RecordTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/ens/name/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/record/[recordId=stringSegment]/(ensRecord)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'ensName'), 'Opaque'), '/record/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/record/[recordId=stringSegment]/(ensRecord)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'recordId'), 'Opaque'), '/observations/', requiredE2eRouteParam(params, '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/record/[recordId=stringSegment]/(ensRecord)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/record/[recordId=stringSegment]/(ensRecord)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(ens)/ens/name/[ensName]/records': {
		nodeId: '/(explore)/(ens)/ens/name/[ensName]/records',
		probeOwnerNodeId: '/(explore)/(ens)/ens/name/[ensName]',
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/records',
		publicPath: '/ens/name/[ensName]/records',
		parameterMatchers: {
			ensName: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'EnsName.NormalizedName',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							ensName: '/ens/name/[ensName]:EnsName.NormalizedName.1.ensName',
						},
					},
				],
			},
		],
		resolve: (params) => ['/ens/name/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/records', 'ensName'), 'Opaque'), '/records'].join(''),
	},
	'/(explore)/(ens)/ens/name/[ensName]/resolver': {
		nodeId: '/(explore)/(ens)/ens/name/[ensName]/resolver',
		probeOwnerNodeId: '/(explore)/(ens)/ens/name/[ensName]',
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/resolver',
		publicPath: '/ens/name/[ensName]/resolver',
		parameterMatchers: {
			ensName: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'EnsName.NormalizedName',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							ensName: '/ens/name/[ensName]:EnsName.NormalizedName.1.ensName',
						},
					},
				],
			},
		],
		resolve: (params) => ['/ens/name/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/resolver', 'ensName'), 'Opaque'), '/resolver'].join(''),
	},
	'/(explore)/(ens)/ens/name/[ensName]/resolves-to': {
		nodeId: '/(explore)/(ens)/ens/name/[ensName]/resolves-to',
		probeOwnerNodeId: '/(explore)/(ens)/ens/name/[ensName]',
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/resolves-to',
		publicPath: '/ens/name/[ensName]/resolves-to',
		parameterMatchers: {
			ensName: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'EnsName.NormalizedName',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							ensName: '/ens/name/[ensName]:EnsName.NormalizedName.1.ensName',
						},
					},
				],
			},
		],
		resolve: (params) => ['/ens/name/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/resolves-to', 'ensName'), 'Opaque'), '/resolves-to'].join(''),
	},
	'/(explore)/(ens)/ens/observations/[timestampMs]/[source]': {
		nodeId: '/(explore)/(ens)/ens/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/(ens)/ens/observations/[timestampMs]/[source]',
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/ens/observations/[timestampMs]/[source]',
		parameterMatchers: {
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: '_GlobalEnsNetwork_Timestamp.HubTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							timestampMs: '/ens/observations/[timestampMs]/[source]:_GlobalEnsNetwork_Timestamp.HubTimestampMsSource.1.timestampMs',
							source: '/ens/observations/[timestampMs]/[source]:_GlobalEnsNetwork_Timestamp.HubTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/ens/observations/', requiredE2eRouteParam(params, '/(explore)/(ens)/ens/(globalEnsNetwork)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/(ens)/ens/(globalEnsNetwork)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(ipfs)/[namespace]/[target]': {
		nodeId: '/(explore)/(ipfs)/[namespace]/[target]',
		probeOwnerNodeId: '/(explore)/(ipfs)/[namespace]/[target]',
		routeId: '/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]',
		publicPath: '/[namespace]/[target]',
		parameterMatchers: {
			namespace: [
				'ipfsNamespace',
			],
			target: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'IpfsResource.ResourceAddress',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'base',
						params: {
							namespace: '/[namespace]/[target]:IpfsResource.ResourceAddress.1.namespace',
							target: '/[namespace]/[target]:IpfsResource.ResourceAddress.1.target',
						},
					},
				],
			},
		],
		resolve: (params) => ['/', requiredE2eRouteParam(params, '/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]', 'namespace'), '/', requiredE2eRouteParam(params, '/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]', 'target')].join(''),
	},
	'/(explore)/(ipfs)/[namespace]/[target]/path/[...contentPath]': {
		nodeId: '/(explore)/(ipfs)/[namespace]/[target]/path/[...contentPath]',
		probeOwnerNodeId: '/(explore)/(ipfs)/[namespace]/[target]',
		routeId: '/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]/path/[...contentPath=stringSegment]',
		publicPath: '/[namespace]/[target]/path/[...contentPath]',
		parameterMatchers: {
			namespace: [
				'ipfsNamespace',
			],
			target: [
				'stringSegment',
			],
			contentPath: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'IpfsResource.ResourceAddress',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'path',
						params: {
							namespace: '/[namespace]/[target]:IpfsResource.ResourceAddress.1.namespace',
							target: '/[namespace]/[target]:IpfsResource.ResourceAddress.1.target',
							contentPath: '/[namespace]/[target]/path/[...contentPath]:IpfsResource.ResourceAddress.path.1.contentPath',
						},
					},
				],
			},
		],
		resolve: (params) => ['/', requiredE2eRouteParam(params, '/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]/path/[...contentPath=stringSegment]', 'namespace'), '/', requiredE2eRouteParam(params, '/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]/path/[...contentPath=stringSegment]', 'target'), '/path/', requiredE2eRouteParam(params, '/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]/path/[...contentPath=stringSegment]', 'contentPath')].join(''),
	},
	'/(explore)/(networks)/network/[network]': {
		nodeId: '/(explore)/(networks)/network/[network]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]',
		publicPath: '/network/[network]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]', 'network')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]': {
		nodeId: '/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]',
		publicPath: '/network/[network]/account/[accountId]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			accountId: [
				'polkadotAccountId',
				'stringSegment',
				'evmAddress',
				'solanaPubkey',
			],
		},
		mappings: [
			{
				id: 'PolkadotAccount.NetworkAccountId',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/account/[accountId]:PolkadotAccount.NetworkAccountId.1.network',
							accountId: '/network/[network]/account/[accountId]:PolkadotAccount.NetworkAccountId.1.accountId',
						},
					},
				],
				projectionPath: [
					'Polkadot',
				],
			},
			{
				id: 'CosmosAccount.NetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/account/[accountId]:CosmosAccount.NetworkAddress.1.network',
							accountId: '/network/[network]/account/[accountId]:CosmosAccount.NetworkAddress.1.accountId',
						},
					},
				],
				projectionPath: [
					'Cosmos',
				],
			},
			{
				id: 'HederaAccount.NetworkAccountId',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/account/[accountId]:HederaAccount.NetworkAccountId.1.network',
							accountId: '/network/[network]/account/[accountId]:HederaAccount.NetworkAccountId.1.accountId',
						},
					},
				],
				projectionPath: [
					'Hedera',
				],
			},
			{
				id: 'CardanoAddress.NetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/account/[accountId]:CardanoAddress.NetworkAddress.1.network',
							accountId: '/network/[network]/account/[accountId]:CardanoAddress.NetworkAddress.1.accountId',
						},
					},
				],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'EvmNetworkAccount.EvmNetworkEvmAccount',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/account/[accountId]:EvmNetworkAccount.EvmNetworkEvmAccount.1.network',
							accountId: '/network/[network]/account/[accountId]:EvmNetworkAccount.EvmNetworkEvmAccount.1.accountId',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaAccount.NetworkPubkey',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/account/[accountId]:SolanaAccount.NetworkPubkey.1.network',
							accountId: '/network/[network]/account/[accountId]:SolanaAccount.NetworkPubkey.1.accountId',
						},
					},
				],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'TonAccount.NetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/account/[accountId]:TonAccount.NetworkAddress.1.network',
							accountId: '/network/[network]/account/[accountId]:TonAccount.NetworkAddress.1.accountId',
						},
					},
				],
				projectionPath: [
					'Ton',
				],
			},
			{
				id: 'XrplAccount.NetworkAccount',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/account/[accountId]:XrplAccount.NetworkAccount.1.network',
							accountId: '/network/[network]/account/[accountId]:XrplAccount.NetworkAccount.1.accountId',
						},
					},
				],
				projectionPath: [
					'Xrpl',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', 'network'), '/account/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', 'accountId')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/observation/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/observation/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/observation/[timestampMs]/[source]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]/(selection)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/network/[network]/account/[accountId]/observation/[timestampMs]/[source]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			accountId: [
				'polkadotAccountId',
				'stringSegment',
				'evmAddress',
				'solanaPubkey',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'PolkadotAccount_Timestamp.AccountTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/account/[accountId]/observation/[timestampMs]/[source]:PolkadotAccount_Timestamp.AccountTimestampMsSource.1.network',
							accountId: '/network/[network]/account/[accountId]/observation/[timestampMs]/[source]:PolkadotAccount_Timestamp.AccountTimestampMsSource.1.accountId',
							timestampMs: '/network/[network]/account/[accountId]/observation/[timestampMs]/[source]:PolkadotAccount_Timestamp.AccountTimestampMsSource.1.timestampMs',
							source: '/network/[network]/account/[accountId]/observation/[timestampMs]/[source]:PolkadotAccount_Timestamp.AccountTimestampMsSource.1.source',
						},
					},
				],
				projectionPath: [
					'Polkadot',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]/(selection)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'network'), '/account/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]/(selection)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'accountId'), '/observation/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]/(selection)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]/(selection)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(blobs)/blob/[transactionId]/[indexInTransaction]': {
		nodeId: '/(explore)/(networks)/network/[network]/(blobs)/blob/[transactionId]/[indexInTransaction]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(blobs)/blob/[transactionId]/[indexInTransaction]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blobs)/blob/[transactionId=evmTxHash]/[indexInTransaction=nonNegativeInteger]',
		publicPath: '/network/[network]/blob/[transactionId]/[indexInTransaction]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			transactionId: [
				'evmTxHash',
			],
			indexInTransaction: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'EvmBlob.TransactionIndexInTransaction',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/blob/[transactionId]/[indexInTransaction]:EvmBlob.TransactionIndexInTransaction.1.network',
							transactionId: '/network/[network]/blob/[transactionId]/[indexInTransaction]:EvmBlob.TransactionIndexInTransaction.1.transactionId',
							indexInTransaction: '/network/[network]/blob/[transactionId]/[indexInTransaction]:EvmBlob.TransactionIndexInTransaction.1.indexInTransaction',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blobs)/blob/[transactionId=evmTxHash]/[indexInTransaction=nonNegativeInteger]', 'network'), '/blob/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blobs)/blob/[transactionId=evmTxHash]/[indexInTransaction=nonNegativeInteger]', 'transactionId'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blobs)/blob/[transactionId=evmTxHash]/[indexInTransaction=nonNegativeInteger]', 'indexInTransaction')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]': {
		nodeId: '/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
		publicPath: '/network/[network]/block/[blockNumber]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			blockNumber: [
				'nonNegativeBigInt',
			],
		},
		mappings: [
			{
				id: 'EvmBlock.EvmNetworkBlockNumber',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/block/[blockNumber]:EvmBlock.EvmNetworkBlockNumber.1.network',
							blockNumber: '/network/[network]/block/[blockNumber]:EvmBlock.EvmNetworkBlockNumber.1.blockNumber',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaBlock.Slot',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/block/[blockNumber]:SolanaBlock.Slot.1.network',
							blockNumber: '/network/[network]/block/[blockNumber]:SolanaBlock.Slot.1.blockNumber',
						},
					},
				],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'UtxoBlock.NetworkHeight',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/block/[blockNumber]:UtxoBlock.NetworkHeight.1.network',
							blockNumber: '/network/[network]/block/[blockNumber]:UtxoBlock.NetworkHeight.1.blockNumber',
						},
					},
				],
				projectionPath: [
					'Utxo',
				],
			},
			{
				id: 'PolkadotBlock.NetworkBlockNumber',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/block/[blockNumber]:PolkadotBlock.NetworkBlockNumber.1.network',
							blockNumber: '/network/[network]/block/[blockNumber]:PolkadotBlock.NetworkBlockNumber.1.blockNumber',
						},
					},
				],
				projectionPath: [
					'Polkadot',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]', 'network'), '/block/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]', 'blockNumber')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]': {
		nodeId: '/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]',
		publicPath: '/network/[network]/block/[blockNumber]/[hash]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			blockNumber: [
				'nonNegativeBigInt',
			],
			hash: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'PolkadotBlock.NetworkBlockNumberHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/block/[blockNumber]/[hash]:PolkadotBlock.NetworkBlockNumberHash.1.network',
							blockNumber: '/network/[network]/block/[blockNumber]/[hash]:PolkadotBlock.NetworkBlockNumberHash.1.blockNumber',
							hash: '/network/[network]/block/[blockNumber]/[hash]:PolkadotBlock.NetworkBlockNumberHash.1.hash',
						},
					},
				],
				projectionPath: [
					'Polkadot',
				],
			},
			{
				id: 'UtxoBlock.NetworkHeightHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/block/[blockNumber]/[hash]:UtxoBlock.NetworkHeightHash.1.network',
							blockNumber: '/network/[network]/block/[blockNumber]/[hash]:UtxoBlock.NetworkHeightHash.1.blockNumber',
							hash: '/network/[network]/block/[blockNumber]/[hash]:UtxoBlock.NetworkHeightHash.1.hash',
						},
					},
				],
				projectionPath: [
					'Utxo',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]', 'network'), '/block/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]', 'blockNumber'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]', 'hash')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]/event/[eventIndex]': {
		nodeId: '/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]/event/[eventIndex]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]/event/[eventIndex]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]/(selection)/event/[eventIndex=nonNegativeInteger]',
		publicPath: '/network/[network]/block/[blockNumber]/[hash]/event/[eventIndex]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			blockNumber: [
				'nonNegativeBigInt',
			],
			hash: [
				'stringSegment',
			],
			eventIndex: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'PolkadotEvent.BlockIndexInBlock',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/block/[blockNumber]/[hash]/event/[eventIndex]:PolkadotEvent.BlockIndexInBlock.1.network',
							blockNumber: '/network/[network]/block/[blockNumber]/[hash]/event/[eventIndex]:PolkadotEvent.BlockIndexInBlock.1.blockNumber',
							hash: '/network/[network]/block/[blockNumber]/[hash]/event/[eventIndex]:PolkadotEvent.BlockIndexInBlock.1.hash',
							eventIndex: '/network/[network]/block/[blockNumber]/[hash]/event/[eventIndex]:PolkadotEvent.BlockIndexInBlock.1.eventIndex',
						},
					},
				],
				projectionPath: [
					'Polkadot',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]/(selection)/event/[eventIndex=nonNegativeInteger]', 'network'), '/block/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]/(selection)/event/[eventIndex=nonNegativeInteger]', 'blockNumber'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]/(selection)/event/[eventIndex=nonNegativeInteger]', 'hash'), '/event/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]/(selection)/event/[eventIndex=nonNegativeInteger]', 'eventIndex')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]/extrinsic/[extrinsicIndex]': {
		nodeId: '/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]/extrinsic/[extrinsicIndex]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]/extrinsic/[extrinsicIndex]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]/(selection)/extrinsic/[extrinsicIndex=nonNegativeInteger]',
		publicPath: '/network/[network]/block/[blockNumber]/[hash]/extrinsic/[extrinsicIndex]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			blockNumber: [
				'nonNegativeBigInt',
			],
			hash: [
				'stringSegment',
			],
			extrinsicIndex: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'PolkadotExtrinsic.BlockIndexInBlock',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/block/[blockNumber]/[hash]/extrinsic/[extrinsicIndex]:PolkadotExtrinsic.BlockIndexInBlock.1.network',
							blockNumber: '/network/[network]/block/[blockNumber]/[hash]/extrinsic/[extrinsicIndex]:PolkadotExtrinsic.BlockIndexInBlock.1.blockNumber',
							hash: '/network/[network]/block/[blockNumber]/[hash]/extrinsic/[extrinsicIndex]:PolkadotExtrinsic.BlockIndexInBlock.1.hash',
							extrinsicIndex: '/network/[network]/block/[blockNumber]/[hash]/extrinsic/[extrinsicIndex]:PolkadotExtrinsic.BlockIndexInBlock.1.extrinsicIndex',
						},
					},
				],
				projectionPath: [
					'Polkadot',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]/(selection)/extrinsic/[extrinsicIndex=nonNegativeInteger]', 'network'), '/block/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]/(selection)/extrinsic/[extrinsicIndex=nonNegativeInteger]', 'blockNumber'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]/(selection)/extrinsic/[extrinsicIndex=nonNegativeInteger]', 'hash'), '/extrinsic/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]/(selection)/extrinsic/[extrinsicIndex=nonNegativeInteger]', 'extrinsicIndex')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/transactions': {
		nodeId: '/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/transactions',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/transactions',
		publicPath: '/network/[network]/block/[blockNumber]/transactions',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			blockNumber: [
				'nonNegativeBigInt',
			],
		},
		mappings: [
			{
				id: 'EvmBlock.EvmNetworkBlockNumber',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/block/[blockNumber]:EvmBlock.EvmNetworkBlockNumber.1.network',
							blockNumber: '/network/[network]/block/[blockNumber]:EvmBlock.EvmNetworkBlockNumber.1.blockNumber',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaBlock.Slot',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/block/[blockNumber]:SolanaBlock.Slot.1.network',
							blockNumber: '/network/[network]/block/[blockNumber]:SolanaBlock.Slot.1.blockNumber',
						},
					},
				],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'UtxoBlock.NetworkHeight',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/block/[blockNumber]:UtxoBlock.NetworkHeight.1.network',
							blockNumber: '/network/[network]/block/[blockNumber]:UtxoBlock.NetworkHeight.1.blockNumber',
						},
					},
				],
				projectionPath: [
					'Utxo',
				],
			},
			{
				id: 'PolkadotBlock.NetworkBlockNumber',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/block/[blockNumber]:PolkadotBlock.NetworkBlockNumber.1.network',
							blockNumber: '/network/[network]/block/[blockNumber]:PolkadotBlock.NetworkBlockNumber.1.blockNumber',
						},
					},
				],
				projectionPath: [
					'Polkadot',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/transactions', 'network'), '/block/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/transactions', 'blockNumber'), '/transactions'].join(''),
	},
	'/(explore)/(networks)/network/[network]/(contracts)/contract/[address]': {
		nodeId: '/(explore)/(networks)/network/[network]/(contracts)/contract/[address]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(contracts)/contract/[address]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddress]',
		publicPath: '/network/[network]/contract/[address]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			address: [
				'evmAddress',
			],
		},
		mappings: [
			{
				id: 'EvmContract.EvmNetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/contract/[address]:EvmContract.EvmNetworkAddress.1.network',
							address: '/network/[network]/contract/[address]:EvmContract.EvmNetworkAddress.1.address',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddress]', 'network'), '/contract/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddress]', 'address')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(contracts)/contract/[address]/verification': {
		nodeId: '/(explore)/(networks)/network/[network]/(contracts)/contract/[address]/verification',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(contracts)/contract/[address]/verification',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddress]/(evmContract)/verification',
		publicPath: '/network/[network]/contract/[address]/verification',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			address: [
				'evmAddress',
			],
		},
		mappings: [
			{
				id: 'EvmContractVerification.EvmContract',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/contract/[address]/verification:EvmContractVerification.EvmContract.1.network',
							address: '/network/[network]/contract/[address]/verification:EvmContractVerification.EvmContract.1.address',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddress]/(evmContract)/verification', 'network'), '/contract/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddress]/(evmContract)/verification', 'address'), '/verification'].join(''),
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]',
		publicPath: '/network/[network]/tx/[transactionId]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			transactionId: [
				'evmTxHash',
				'solanaSignature',
				'utxoTxId',
			],
		},
		mappings: [
			{
				id: 'EvmTransaction.EvmNetworkTxHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]:EvmTransaction.EvmNetworkTxHash.1.network',
							transactionId: '/network/[network]/tx/[transactionId]:EvmTransaction.EvmNetworkTxHash.1.transactionId',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaTransaction.NetworkSignature',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]:SolanaTransaction.NetworkSignature.1.network',
							transactionId: '/network/[network]/tx/[transactionId]:SolanaTransaction.NetworkSignature.1.transactionId',
						},
					},
				],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'CardanoTransaction.NetworkHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]:CardanoTransaction.NetworkHash.1.network',
							transactionId: '/network/[network]/tx/[transactionId]:CardanoTransaction.NetworkHash.1.transactionId',
						},
					},
				],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'UtxoTransaction.NetworkTxId',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]:UtxoTransaction.NetworkTxId.1.network',
							transactionId: '/network/[network]/tx/[transactionId]:UtxoTransaction.NetworkTxId.1.transactionId',
						},
					},
				],
				projectionPath: [
					'Utxo',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', 'network'), '/tx/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', 'transactionId')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/input/[inputIndex]': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/input/[inputIndex]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/input/[inputIndex]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/input/[inputIndex=nonNegativeInteger]',
		publicPath: '/network/[network]/tx/[transactionId]/input/[inputIndex]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			transactionId: [
				'evmTxHash',
				'solanaSignature',
				'utxoTxId',
			],
			inputIndex: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'CardanoTxInput.TransactionInputIndex',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]/input/[inputIndex]:CardanoTxInput.TransactionInputIndex.1.network',
							transactionId: '/network/[network]/tx/[transactionId]/input/[inputIndex]:CardanoTxInput.TransactionInputIndex.1.transactionId',
							inputIndex: '/network/[network]/tx/[transactionId]/input/[inputIndex]:CardanoTxInput.TransactionInputIndex.1.inputIndex',
						},
					},
				],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'UtxoInput.TransactionIndexInTransaction',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]/input/[inputIndex]:UtxoInput.TransactionIndexInTransaction.1.network',
							transactionId: '/network/[network]/tx/[transactionId]/input/[inputIndex]:UtxoInput.TransactionIndexInTransaction.1.transactionId',
							inputIndex: '/network/[network]/tx/[transactionId]/input/[inputIndex]:UtxoInput.TransactionIndexInTransaction.1.inputIndex',
						},
					},
				],
				projectionPath: [
					'Utxo',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/input/[inputIndex=nonNegativeInteger]', 'network'), '/tx/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/input/[inputIndex=nonNegativeInteger]', 'transactionId'), '/input/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/input/[inputIndex=nonNegativeInteger]', 'inputIndex')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/inputs': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/inputs',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/inputs',
		publicPath: '/network/[network]/tx/[transactionId]/inputs',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			transactionId: [
				'evmTxHash',
				'solanaSignature',
				'utxoTxId',
			],
		},
		mappings: [
			{
				id: 'EvmTransaction.EvmNetworkTxHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]:EvmTransaction.EvmNetworkTxHash.1.network',
							transactionId: '/network/[network]/tx/[transactionId]:EvmTransaction.EvmNetworkTxHash.1.transactionId',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaTransaction.NetworkSignature',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]:SolanaTransaction.NetworkSignature.1.network',
							transactionId: '/network/[network]/tx/[transactionId]:SolanaTransaction.NetworkSignature.1.transactionId',
						},
					},
				],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'CardanoTransaction.NetworkHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]:CardanoTransaction.NetworkHash.1.network',
							transactionId: '/network/[network]/tx/[transactionId]:CardanoTransaction.NetworkHash.1.transactionId',
						},
					},
				],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'UtxoTransaction.NetworkTxId',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]:UtxoTransaction.NetworkTxId.1.network',
							transactionId: '/network/[network]/tx/[transactionId]:UtxoTransaction.NetworkTxId.1.transactionId',
						},
					},
				],
				projectionPath: [
					'Utxo',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/inputs', 'network'), '/tx/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/inputs', 'transactionId'), '/inputs'].join(''),
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]',
		publicPath: '/network/[network]/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			transactionId: [
				'evmTxHash',
				'solanaSignature',
				'utxoTxId',
			],
			instructionKind: [
				'stringSegment',
			],
			indexInTransaction: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'SolanaInstruction.SolanaTransactionIndexInTransaction',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]:SolanaInstruction.SolanaTransactionIndexInTransaction.1.network',
							transactionId: '/network/[network]/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]:SolanaInstruction.SolanaTransactionIndexInTransaction.1.transactionId',
							instructionKind: '/network/[network]/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]:SolanaInstruction.SolanaTransactionIndexInTransaction.1.instructionKind',
							indexInTransaction: '/network/[network]/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]:SolanaInstruction.SolanaTransactionIndexInTransaction.1.indexInTransaction',
						},
					},
				],
				projectionPath: [
					'Solana',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]', 'network'), '/tx/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]', 'transactionId'), '/instruction/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]', 'instructionKind'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]', 'indexInTransaction')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]/inner/[indexInInstruction]': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]/inner/[indexInInstruction]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]/inner/[indexInInstruction]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/(solanaInstruction)/inner/[indexInInstruction=nonNegativeInteger]',
		publicPath: '/network/[network]/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]/inner/[indexInInstruction]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			transactionId: [
				'evmTxHash',
				'solanaSignature',
				'utxoTxId',
			],
			instructionKind: [
				'stringSegment',
			],
			indexInTransaction: [
				'nonNegativeInteger',
			],
			indexInInstruction: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'SolanaInstruction.SolanaTransactionIndexInInstruction',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]/inner/[indexInInstruction]:SolanaInstruction.SolanaTransactionIndexInInstruction.1.network',
							transactionId: '/network/[network]/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]/inner/[indexInInstruction]:SolanaInstruction.SolanaTransactionIndexInInstruction.1.transactionId',
							instructionKind: '/network/[network]/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]/inner/[indexInInstruction]:SolanaInstruction.SolanaTransactionIndexInInstruction.1.instructionKind',
							indexInTransaction: '/network/[network]/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]/inner/[indexInInstruction]:SolanaInstruction.SolanaTransactionIndexInInstruction.1.indexInTransaction',
							indexInInstruction: '/network/[network]/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]/inner/[indexInInstruction]:SolanaInstruction.SolanaTransactionIndexInInstruction.1.indexInInstruction',
						},
					},
				],
				projectionPath: [
					'Solana',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/(solanaInstruction)/inner/[indexInInstruction=nonNegativeInteger]', 'network'), '/tx/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/(solanaInstruction)/inner/[indexInInstruction=nonNegativeInteger]', 'transactionId'), '/instruction/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/(solanaInstruction)/inner/[indexInInstruction=nonNegativeInteger]', 'instructionKind'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/(solanaInstruction)/inner/[indexInInstruction=nonNegativeInteger]', 'indexInTransaction'), '/inner/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/(solanaInstruction)/inner/[indexInInstruction=nonNegativeInteger]', 'indexInInstruction')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/internal-transfer/[indexInTransaction]': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/internal-transfer/[indexInTransaction]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/internal-transfer/[indexInTransaction]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/internal-transfer/[indexInTransaction=nonNegativeInteger]',
		publicPath: '/network/[network]/tx/[transactionId]/internal-transfer/[indexInTransaction]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			transactionId: [
				'evmTxHash',
				'solanaSignature',
				'utxoTxId',
			],
			indexInTransaction: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'EvmInternalTransfer.TransactionIndexInTransaction',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]/internal-transfer/[indexInTransaction]:EvmInternalTransfer.TransactionIndexInTransaction.1.network',
							transactionId: '/network/[network]/tx/[transactionId]/internal-transfer/[indexInTransaction]:EvmInternalTransfer.TransactionIndexInTransaction.1.transactionId',
							indexInTransaction: '/network/[network]/tx/[transactionId]/internal-transfer/[indexInTransaction]:EvmInternalTransfer.TransactionIndexInTransaction.1.indexInTransaction',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/internal-transfer/[indexInTransaction=nonNegativeInteger]', 'network'), '/tx/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/internal-transfer/[indexInTransaction=nonNegativeInteger]', 'transactionId'), '/internal-transfer/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/internal-transfer/[indexInTransaction=nonNegativeInteger]', 'indexInTransaction')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/log/[indexInTransaction]': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/log/[indexInTransaction]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/log/[indexInTransaction]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/log/[indexInTransaction=nonNegativeInteger]',
		publicPath: '/network/[network]/tx/[transactionId]/log/[indexInTransaction]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			transactionId: [
				'evmTxHash',
				'solanaSignature',
				'utxoTxId',
			],
			indexInTransaction: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'EvmLog.TransactionIndexInTransaction',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]/log/[indexInTransaction]:EvmLog.TransactionIndexInTransaction.1.network',
							transactionId: '/network/[network]/tx/[transactionId]/log/[indexInTransaction]:EvmLog.TransactionIndexInTransaction.1.transactionId',
							indexInTransaction: '/network/[network]/tx/[transactionId]/log/[indexInTransaction]:EvmLog.TransactionIndexInTransaction.1.indexInTransaction',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/log/[indexInTransaction=nonNegativeInteger]', 'network'), '/tx/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/log/[indexInTransaction=nonNegativeInteger]', 'transactionId'), '/log/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/log/[indexInTransaction=nonNegativeInteger]', 'indexInTransaction')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/log/[indexInTransaction]/token-transfer/[transferIndex]': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/log/[indexInTransaction]/token-transfer/[transferIndex]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/log/[indexInTransaction]/token-transfer/[transferIndex]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/log/[indexInTransaction=nonNegativeInteger]/(evmLog)/token-transfer/[transferIndex=nonNegativeInteger]',
		publicPath: '/network/[network]/tx/[transactionId]/log/[indexInTransaction]/token-transfer/[transferIndex]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			transactionId: [
				'evmTxHash',
				'solanaSignature',
				'utxoTxId',
			],
			indexInTransaction: [
				'nonNegativeInteger',
			],
			transferIndex: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'EvmTokenTransfer.LogIndexInLog',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]/log/[indexInTransaction]/token-transfer/[transferIndex]:EvmTokenTransfer.LogIndexInLog.1.network',
							transactionId: '/network/[network]/tx/[transactionId]/log/[indexInTransaction]/token-transfer/[transferIndex]:EvmTokenTransfer.LogIndexInLog.1.transactionId',
							indexInTransaction: '/network/[network]/tx/[transactionId]/log/[indexInTransaction]/token-transfer/[transferIndex]:EvmTokenTransfer.LogIndexInLog.1.indexInTransaction',
							transferIndex: '/network/[network]/tx/[transactionId]/log/[indexInTransaction]/token-transfer/[transferIndex]:EvmTokenTransfer.LogIndexInLog.1.transferIndex',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/log/[indexInTransaction=nonNegativeInteger]/(evmLog)/token-transfer/[transferIndex=nonNegativeInteger]', 'network'), '/tx/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/log/[indexInTransaction=nonNegativeInteger]/(evmLog)/token-transfer/[transferIndex=nonNegativeInteger]', 'transactionId'), '/log/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/log/[indexInTransaction=nonNegativeInteger]/(evmLog)/token-transfer/[transferIndex=nonNegativeInteger]', 'indexInTransaction'), '/token-transfer/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/log/[indexInTransaction=nonNegativeInteger]/(evmLog)/token-transfer/[transferIndex=nonNegativeInteger]', 'transferIndex')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/output/[outputIndex]': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/output/[outputIndex]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/output/[outputIndex]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/output/[outputIndex=nonNegativeInteger]',
		publicPath: '/network/[network]/tx/[transactionId]/output/[outputIndex]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			transactionId: [
				'evmTxHash',
				'solanaSignature',
				'utxoTxId',
			],
			outputIndex: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'CardanoTxOutput.TransactionOutputIndex',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]/output/[outputIndex]:CardanoTxOutput.TransactionOutputIndex.1.network',
							transactionId: '/network/[network]/tx/[transactionId]/output/[outputIndex]:CardanoTxOutput.TransactionOutputIndex.1.transactionId',
							outputIndex: '/network/[network]/tx/[transactionId]/output/[outputIndex]:CardanoTxOutput.TransactionOutputIndex.1.outputIndex',
						},
					},
				],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'UtxoOutput.TransactionIndexInTransaction',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]/output/[outputIndex]:UtxoOutput.TransactionIndexInTransaction.1.network',
							transactionId: '/network/[network]/tx/[transactionId]/output/[outputIndex]:UtxoOutput.TransactionIndexInTransaction.1.transactionId',
							outputIndex: '/network/[network]/tx/[transactionId]/output/[outputIndex]:UtxoOutput.TransactionIndexInTransaction.1.outputIndex',
						},
					},
				],
				projectionPath: [
					'Utxo',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/output/[outputIndex=nonNegativeInteger]', 'network'), '/tx/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/output/[outputIndex=nonNegativeInteger]', 'transactionId'), '/output/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/output/[outputIndex=nonNegativeInteger]', 'outputIndex')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/outputs': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/outputs',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/outputs',
		publicPath: '/network/[network]/tx/[transactionId]/outputs',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			transactionId: [
				'evmTxHash',
				'solanaSignature',
				'utxoTxId',
			],
		},
		mappings: [
			{
				id: 'EvmTransaction.EvmNetworkTxHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]:EvmTransaction.EvmNetworkTxHash.1.network',
							transactionId: '/network/[network]/tx/[transactionId]:EvmTransaction.EvmNetworkTxHash.1.transactionId',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaTransaction.NetworkSignature',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]:SolanaTransaction.NetworkSignature.1.network',
							transactionId: '/network/[network]/tx/[transactionId]:SolanaTransaction.NetworkSignature.1.transactionId',
						},
					},
				],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'CardanoTransaction.NetworkHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]:CardanoTransaction.NetworkHash.1.network',
							transactionId: '/network/[network]/tx/[transactionId]:CardanoTransaction.NetworkHash.1.transactionId',
						},
					},
				],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'UtxoTransaction.NetworkTxId',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]:UtxoTransaction.NetworkTxId.1.network',
							transactionId: '/network/[network]/tx/[transactionId]:UtxoTransaction.NetworkTxId.1.transactionId',
						},
					},
				],
				projectionPath: [
					'Utxo',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/outputs', 'network'), '/tx/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/outputs', 'transactionId'), '/outputs'].join(''),
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/shielded-action/[pool]/[actionKind]/[actionIndex]': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/shielded-action/[pool]/[actionKind]/[actionIndex]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/shielded-action/[pool]/[actionKind]/[actionIndex]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]',
		publicPath: '/network/[network]/tx/[transactionId]/shielded-action/[pool]/[actionKind]/[actionIndex]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			transactionId: [
				'evmTxHash',
				'solanaSignature',
				'utxoTxId',
			],
			pool: [
				'stringSegment',
			],
			actionKind: [
				'stringSegment',
			],
			actionIndex: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'ZcashShieldedAction.TransactionPoolActionKindIndexInTransaction',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]/shielded-action/[pool]/[actionKind]/[actionIndex]:ZcashShieldedAction.TransactionPoolActionKindIndexInTransaction.1.network',
							transactionId: '/network/[network]/tx/[transactionId]/shielded-action/[pool]/[actionKind]/[actionIndex]:ZcashShieldedAction.TransactionPoolActionKindIndexInTransaction.1.transactionId',
							pool: '/network/[network]/tx/[transactionId]/shielded-action/[pool]/[actionKind]/[actionIndex]:ZcashShieldedAction.TransactionPoolActionKindIndexInTransaction.1.pool',
							actionKind: '/network/[network]/tx/[transactionId]/shielded-action/[pool]/[actionKind]/[actionIndex]:ZcashShieldedAction.TransactionPoolActionKindIndexInTransaction.1.actionKind',
							actionIndex: '/network/[network]/tx/[transactionId]/shielded-action/[pool]/[actionKind]/[actionIndex]:ZcashShieldedAction.TransactionPoolActionKindIndexInTransaction.1.actionIndex',
						},
					},
				],
				projectionPath: [
					'Zcash',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]', 'network'), '/tx/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]', 'transactionId'), '/shielded-action/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]', 'pool'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]', 'actionKind'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]', 'actionIndex')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/shielded-actions': {
		nodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/shielded-actions',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/shielded-actions',
		publicPath: '/network/[network]/tx/[transactionId]/shielded-actions',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			transactionId: [
				'evmTxHash',
				'solanaSignature',
				'utxoTxId',
			],
		},
		mappings: [
			{
				id: 'EvmTransaction.EvmNetworkTxHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]:EvmTransaction.EvmNetworkTxHash.1.network',
							transactionId: '/network/[network]/tx/[transactionId]:EvmTransaction.EvmNetworkTxHash.1.transactionId',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaTransaction.NetworkSignature',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]:SolanaTransaction.NetworkSignature.1.network',
							transactionId: '/network/[network]/tx/[transactionId]:SolanaTransaction.NetworkSignature.1.transactionId',
						},
					},
				],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'CardanoTransaction.NetworkHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]:CardanoTransaction.NetworkHash.1.network',
							transactionId: '/network/[network]/tx/[transactionId]:CardanoTransaction.NetworkHash.1.transactionId',
						},
					},
				],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'UtxoTransaction.NetworkTxId',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/tx/[transactionId]:UtxoTransaction.NetworkTxId.1.network',
							transactionId: '/network/[network]/tx/[transactionId]:UtxoTransaction.NetworkTxId.1.transactionId',
						},
					},
				],
				projectionPath: [
					'Utxo',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/shielded-actions', 'network'), '/tx/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/shielded-actions', 'transactionId'), '/shielded-actions'].join(''),
	},
	'/(explore)/(networks)/network/[network]/(upgrades)/consensus/[upgradeSlug]': {
		nodeId: '/(explore)/(networks)/network/[network]/(upgrades)/consensus/[upgradeSlug]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(upgrades)/consensus/[upgradeSlug]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/consensus/[upgradeSlug=stringSegment]',
		publicPath: '/network/[network]/consensus/[upgradeSlug]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			upgradeSlug: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'EthereumConsensusUpgrade.EvmNetworkSlug',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/consensus/[upgradeSlug]:EthereumConsensusUpgrade.EvmNetworkSlug.1.network',
							upgradeSlug: '/network/[network]/consensus/[upgradeSlug]:EthereumConsensusUpgrade.EvmNetworkSlug.1.upgradeSlug',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/consensus/[upgradeSlug=stringSegment]', 'network'), '/consensus/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/consensus/[upgradeSlug=stringSegment]', 'upgradeSlug')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(upgrades)/execution/[upgradeSlug]': {
		nodeId: '/(explore)/(networks)/network/[network]/(upgrades)/execution/[upgradeSlug]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(upgrades)/execution/[upgradeSlug]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/execution/[upgradeSlug=stringSegment]',
		publicPath: '/network/[network]/execution/[upgradeSlug]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			upgradeSlug: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'EthereumExecutionUpgrade.EvmNetworkSlug',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/execution/[upgradeSlug]:EthereumExecutionUpgrade.EvmNetworkSlug.1.network',
							upgradeSlug: '/network/[network]/execution/[upgradeSlug]:EthereumExecutionUpgrade.EvmNetworkSlug.1.upgradeSlug',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/execution/[upgradeSlug=stringSegment]', 'network'), '/execution/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/execution/[upgradeSlug=stringSegment]', 'upgradeSlug')].join(''),
	},
	'/(explore)/(networks)/network/[network]/(upgrades)/upgrade/[upgradeSlug]': {
		nodeId: '/(explore)/(networks)/network/[network]/(upgrades)/upgrade/[upgradeSlug]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/(upgrades)/upgrade/[upgradeSlug]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/upgrade/[upgradeSlug=stringSegment]',
		publicPath: '/network/[network]/upgrade/[upgradeSlug]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			upgradeSlug: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'EthereumNetworkUpgrade.EvmNetworkSlug',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/upgrade/[upgradeSlug]:EthereumNetworkUpgrade.EvmNetworkSlug.1.network',
							upgradeSlug: '/network/[network]/upgrade/[upgradeSlug]:EthereumNetworkUpgrade.EvmNetworkSlug.1.upgradeSlug',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/upgrade/[upgradeSlug=stringSegment]', 'network'), '/upgrade/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/upgrade/[upgradeSlug=stringSegment]', 'upgradeSlug')].join(''),
	},
	'/(explore)/(networks)/network/[network]/accounts': {
		nodeId: '/(explore)/(networks)/network/[network]/accounts',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/accounts',
		publicPath: '/network/[network]/accounts',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/accounts', 'network'), '/accounts'].join(''),
	},
	'/(explore)/(networks)/network/[network]/activity/day/[dayStartTimestampMs]': {
		nodeId: '/(explore)/(networks)/network/[network]/activity/day/[dayStartTimestampMs]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/activity/day/[dayStartTimestampMs]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/activity/day/[dayStartTimestampMs=nonNegativeInteger]',
		publicPath: '/network/[network]/activity/day/[dayStartTimestampMs]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			dayStartTimestampMs: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'Network_Activity_Day.NetworkDayStartTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/activity/day/[dayStartTimestampMs]:Network_Activity_Day.NetworkDayStartTimestampMsSource.1.network',
							dayStartTimestampMs: '/network/[network]/activity/day/[dayStartTimestampMs]:Network_Activity_Day.NetworkDayStartTimestampMsSource.1.dayStartTimestampMs',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/activity/day/[dayStartTimestampMs=nonNegativeInteger]', 'network'), '/activity/day/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/activity/day/[dayStartTimestampMs=nonNegativeInteger]', 'dayStartTimestampMs')].join(''),
	},
	'/(explore)/(networks)/network/[network]/actor/[address]': {
		nodeId: '/(explore)/(networks)/network/[network]/actor/[address]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/actor/[address]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/actor/[address=stringSegment]',
		publicPath: '/network/[network]/actor/[address]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			address: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'FilecoinActor.NetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/actor/[address]:FilecoinActor.NetworkAddress.1.network',
							address: '/network/[network]/actor/[address]:FilecoinActor.NetworkAddress.1.address',
						},
					},
				],
				projectionPath: [
					'Filecoin',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/actor/[address=stringSegment]', 'network'), '/actor/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/actor/[address=stringSegment]', 'address')].join(''),
	},
	'/(explore)/(networks)/network/[network]/actor/[address]/observations/[height]/[tipsetKey]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/actor/[address]/observations/[height]/[tipsetKey]/[source]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/actor/[address]/observations/[height]/[tipsetKey]/[source]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/actor/[address=stringSegment]/(filecoinActor)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]',
		publicPath: '/network/[network]/actor/[address]/observations/[height]/[tipsetKey]/[source]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			address: [
				'stringSegment',
			],
			height: [
				'nonNegativeBigInt',
			],
			tipsetKey: [
				'stringSegment',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'FilecoinActor_Timestamp.ActorHeightTipsetKeySource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/actor/[address]/observations/[height]/[tipsetKey]/[source]:FilecoinActor_Timestamp.ActorHeightTipsetKeySource.1.network',
							address: '/network/[network]/actor/[address]/observations/[height]/[tipsetKey]/[source]:FilecoinActor_Timestamp.ActorHeightTipsetKeySource.1.address',
							height: '/network/[network]/actor/[address]/observations/[height]/[tipsetKey]/[source]:FilecoinActor_Timestamp.ActorHeightTipsetKeySource.1.height',
							tipsetKey: '/network/[network]/actor/[address]/observations/[height]/[tipsetKey]/[source]:FilecoinActor_Timestamp.ActorHeightTipsetKeySource.1.tipsetKey',
							source: '/network/[network]/actor/[address]/observations/[height]/[tipsetKey]/[source]:FilecoinActor_Timestamp.ActorHeightTipsetKeySource.1.source',
						},
					},
				],
				projectionPath: [
					'Filecoin',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/actor/[address=stringSegment]/(filecoinActor)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', 'network'), '/actor/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/actor/[address=stringSegment]/(filecoinActor)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', 'address'), '/observations/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/actor/[address=stringSegment]/(filecoinActor)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', 'height'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/actor/[address=stringSegment]/(filecoinActor)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', 'tipsetKey'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/actor/[address=stringSegment]/(filecoinActor)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(networks)/network/[network]/address/[address]': {
		nodeId: '/(explore)/(networks)/network/[network]/address/[address]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/address/[address]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]',
		publicPath: '/network/[network]/address/[address]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			address: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'UtxoAddress.NetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/address/[address]:UtxoAddress.NetworkAddress.1.network',
							address: '/network/[network]/address/[address]:UtxoAddress.NetworkAddress.1.address',
						},
					},
				],
				projectionPath: [
					'Utxo',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]', 'network'), '/address/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]', 'address')].join(''),
	},
	'/(explore)/(networks)/network/[network]/address/[address]/observations': {
		nodeId: '/(explore)/(networks)/network/[network]/address/[address]/observations',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/address/[address]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]/(utxoAddress)/observations',
		publicPath: '/network/[network]/address/[address]/observations',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			address: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'UtxoAddress.NetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/address/[address]:UtxoAddress.NetworkAddress.1.network',
							address: '/network/[network]/address/[address]:UtxoAddress.NetworkAddress.1.address',
						},
					},
				],
				projectionPath: [
					'Utxo',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]/(utxoAddress)/observations', 'network'), '/address/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]/(utxoAddress)/observations', 'address'), '/observations'].join(''),
	},
	'/(explore)/(networks)/network/[network]/address/[address]/observations/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/address/[address]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/address/[address]/observations/[timestampMs]/[source]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]/(utxoAddress)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/network/[network]/address/[address]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			address: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'UtxoAddress_Timestamp.AddressTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/address/[address]/observations/[timestampMs]/[source]:UtxoAddress_Timestamp.AddressTimestampMsSource.1.network',
							address: '/network/[network]/address/[address]/observations/[timestampMs]/[source]:UtxoAddress_Timestamp.AddressTimestampMsSource.1.address',
							timestampMs: '/network/[network]/address/[address]/observations/[timestampMs]/[source]:UtxoAddress_Timestamp.AddressTimestampMsSource.1.timestampMs',
							source: '/network/[network]/address/[address]/observations/[timestampMs]/[source]:UtxoAddress_Timestamp.AddressTimestampMsSource.1.source',
						},
					},
				],
				projectionPath: [
					'Utxo',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]/(utxoAddress)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'network'), '/address/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]/(utxoAddress)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'address'), '/observations/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]/(utxoAddress)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]/(utxoAddress)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(networks)/network/[network]/amendment/[amendmentId]': {
		nodeId: '/(explore)/(networks)/network/[network]/amendment/[amendmentId]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/amendment/[amendmentId]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/amendment/[amendmentId=stringSegment]',
		publicPath: '/network/[network]/amendment/[amendmentId]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			amendmentId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'XrplAmendment.NetworkAmendmentId',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/amendment/[amendmentId]:XrplAmendment.NetworkAmendmentId.1.network',
							amendmentId: '/network/[network]/amendment/[amendmentId]:XrplAmendment.NetworkAmendmentId.1.amendmentId',
						},
					},
				],
				projectionPath: [
					'Xrpl',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/amendment/[amendmentId=stringSegment]', 'network'), '/amendment/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/amendment/[amendmentId=stringSegment]', 'amendmentId')].join(''),
	},
	'/(explore)/(networks)/network/[network]/amm/[ammAccount]': {
		nodeId: '/(explore)/(networks)/network/[network]/amm/[ammAccount]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/amm/[ammAccount]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/amm/[ammAccount=stringSegment]',
		publicPath: '/network/[network]/amm/[ammAccount]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			ammAccount: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'XrplAmm.NetworkAmmAccount',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/amm/[ammAccount]:XrplAmm.NetworkAmmAccount.1.network',
							ammAccount: '/network/[network]/amm/[ammAccount]:XrplAmm.NetworkAmmAccount.1.ammAccount',
						},
					},
				],
				projectionPath: [
					'Xrpl',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/amm/[ammAccount=stringSegment]', 'network'), '/amm/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/amm/[ammAccount=stringSegment]', 'ammAccount')].join(''),
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]': {
		nodeId: '/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]',
		publicPath: '/network/[network]/asset/[kind]/[assetKey]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			kind: [
				'stringSegment',
			],
			assetKey: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'AssetInstance.NetworkKindAssetKey',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/asset/[kind]/[assetKey]:AssetInstance.NetworkKindAssetKey.1.network',
							kind: '/network/[network]/asset/[kind]/[assetKey]:AssetInstance.NetworkKindAssetKey.1.kind',
							assetKey: '/network/[network]/asset/[kind]/[assetKey]:AssetInstance.NetworkKindAssetKey.1.assetKey',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]', 'network'), '/asset/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]', 'kind'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]', 'assetKey')].join(''),
	},
	'/(explore)/(networks)/network/[network]/attestations': {
		nodeId: '/(explore)/(networks)/network/[network]/attestations',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/attestations',
		publicPath: '/network/[network]/attestations',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/attestations', 'network'), '/attestations'].join(''),
	},
	'/(explore)/(networks)/network/[network]/blobs': {
		nodeId: '/(explore)/(networks)/network/[network]/blobs',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/blobs',
		publicPath: '/network/[network]/blobs',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/blobs', 'network'), '/blobs'].join(''),
	},
	'/(explore)/(networks)/network/[network]/block-explorers': {
		nodeId: '/(explore)/(networks)/network/[network]/block-explorers',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/block-explorers',
		publicPath: '/network/[network]/block-explorers',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/block-explorers', 'network'), '/block-explorers'].join(''),
	},
	'/(explore)/(networks)/network/[network]/blocks': {
		nodeId: '/(explore)/(networks)/network/[network]/blocks',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/blocks',
		publicPath: '/network/[network]/blocks',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/blocks', 'network'), '/blocks'].join(''),
	},
	'/(explore)/(networks)/network/[network]/bridges': {
		nodeId: '/(explore)/(networks)/network/[network]/bridges',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/bridges',
		publicPath: '/network/[network]/bridges',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/bridges', 'network'), '/bridges'].join(''),
	},
	'/(explore)/(networks)/network/[network]/bridges/[toCaip2]/[url]': {
		nodeId: '/(explore)/(networks)/network/[network]/bridges/[toCaip2]/[url]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/bridges/[toCaip2]/[url]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/bridges/[toCaip2=networkCaip2]/[url=absoluteUrl]',
		publicPath: '/network/[network]/bridges/[toCaip2]/[url]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			toCaip2: [
				'networkCaip2',
			],
			url: [
				'absoluteUrl',
			],
		},
		mappings: [
			{
				id: 'EvmNetworkBridge.FromToUrl',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/bridges/[toCaip2]/[url]:EvmNetworkBridge.FromToUrl.1.network',
							toCaip2: '/network/[network]/bridges/[toCaip2]/[url]:EvmNetworkBridge.FromToUrl.1.toCaip2',
							url: '/network/[network]/bridges/[toCaip2]/[url]:EvmNetworkBridge.FromToUrl.1.url',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/bridges/[toCaip2=networkCaip2]/[url=absoluteUrl]', 'network'), '/bridges/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/bridges/[toCaip2=networkCaip2]/[url=absoluteUrl]', 'toCaip2'), '/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/bridges/[toCaip2=networkCaip2]/[url=absoluteUrl]', 'url'), 'Opaque')].join(''),
	},
	'/(explore)/(networks)/network/[network]/channels': {
		nodeId: '/(explore)/(networks)/network/[network]/channels',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/channels',
		publicPath: '/network/[network]/channels',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/channels', 'network'), '/channels'].join(''),
	},
	'/(explore)/(networks)/network/[network]/channels/[channelId]': {
		nodeId: '/(explore)/(networks)/network/[network]/channels/[channelId]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/channels/[channelId]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/channels/[channelId=stringSegment]',
		publicPath: '/network/[network]/channels/[channelId]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			channelId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'LightningChannel.NetworkChannelId',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/channels/[channelId]:LightningChannel.NetworkChannelId.1.network',
							channelId: '/network/[network]/channels/[channelId]:LightningChannel.NetworkChannelId.1.channelId',
						},
					},
				],
				projectionPath: [
					'Lightning',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/channels/[channelId=stringSegment]', 'network'), '/channels/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/channels/[channelId=stringSegment]', 'channelId')].join(''),
	},
	'/(explore)/(networks)/network/[network]/committees': {
		nodeId: '/(explore)/(networks)/network/[network]/committees',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/committees',
		publicPath: '/network/[network]/committees',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/committees', 'network'), '/committees'].join(''),
	},
	'/(explore)/(networks)/network/[network]/contracts': {
		nodeId: '/(explore)/(networks)/network/[network]/contracts',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/contracts',
		publicPath: '/network/[network]/contracts',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/contracts', 'network'), '/contracts'].join(''),
	},
	'/(explore)/(networks)/network/[network]/drep/[drepCredential]': {
		nodeId: '/(explore)/(networks)/network/[network]/drep/[drepCredential]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/drep/[drepCredential]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/drep/[drepCredential=stringSegment]',
		publicPath: '/network/[network]/drep/[drepCredential]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			drepCredential: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'CardanoDRep.NetworkDrepCredential',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/drep/[drepCredential]:CardanoDRep.NetworkDrepCredential.1.network',
							drepCredential: '/network/[network]/drep/[drepCredential]:CardanoDRep.NetworkDrepCredential.1.drepCredential',
						},
					},
				],
				projectionPath: [
					'Cardano',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/drep/[drepCredential=stringSegment]', 'network'), '/drep/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/drep/[drepCredential=stringSegment]', 'drepCredential')].join(''),
	},
	'/(explore)/(networks)/network/[network]/epoch/[epoch]': {
		nodeId: '/(explore)/(networks)/network/[network]/epoch/[epoch]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/epoch/[epoch]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/epoch/[epoch=nonNegativeInteger]',
		publicPath: '/network/[network]/epoch/[epoch]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			epoch: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'BeaconEpoch.EvmNetworkEpoch',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/epoch/[epoch]:BeaconEpoch.EvmNetworkEpoch.1.network',
							epoch: '/network/[network]/epoch/[epoch]:BeaconEpoch.EvmNetworkEpoch.1.epoch',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/epoch/[epoch=nonNegativeInteger]', 'network'), '/epoch/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/epoch/[epoch=nonNegativeInteger]', 'epoch')].join(''),
	},
	'/(explore)/(networks)/network/[network]/epochs': {
		nodeId: '/(explore)/(networks)/network/[network]/epochs',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/epochs',
		publicPath: '/network/[network]/epochs',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/epochs', 'network'), '/epochs'].join(''),
	},
	'/(explore)/(networks)/network/[network]/erc-20-transfers': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-20-transfers',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-20-transfers',
		publicPath: '/network/[network]/erc-20-transfers',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-20-transfers', 'network'), '/erc-20-transfers'].join(''),
	},
	'/(explore)/(networks)/network/[network]/erc-4337/account-factories': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/account-factories',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factories',
		publicPath: '/network/[network]/erc-4337/account-factories',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factories', 'network'), '/erc-4337/account-factories'].join(''),
	},
	'/(explore)/(networks)/network/[network]/erc-4337/account-factory/[address]': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/account-factory/[address]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/erc-4337/account-factory/[address]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]',
		publicPath: '/network/[network]/erc-4337/account-factory/[address]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			address: [
				'evmAddress',
			],
		},
		mappings: [
			{
				id: 'Erc4337AccountFactory.EvmNetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/erc-4337/account-factory/[address]:Erc4337AccountFactory.EvmNetworkAddress.1.network',
							address: '/network/[network]/erc-4337/account-factory/[address]:Erc4337AccountFactory.EvmNetworkAddress.1.address',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]', 'network'), '/erc-4337/account-factory/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]', 'address')].join(''),
	},
	'/(explore)/(networks)/network/[network]/erc-4337/account-factory/[address]/observations': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/account-factory/[address]/observations',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/erc-4337/account-factory/[address]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]/(erc4337AccountFactory)/observations',
		publicPath: '/network/[network]/erc-4337/account-factory/[address]/observations',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			address: [
				'evmAddress',
			],
		},
		mappings: [
			{
				id: 'Erc4337AccountFactory.EvmNetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/erc-4337/account-factory/[address]:Erc4337AccountFactory.EvmNetworkAddress.1.network',
							address: '/network/[network]/erc-4337/account-factory/[address]:Erc4337AccountFactory.EvmNetworkAddress.1.address',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]/(erc4337AccountFactory)/observations', 'network'), '/erc-4337/account-factory/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]/(erc4337AccountFactory)/observations', 'address'), '/observations'].join(''),
	},
	'/(explore)/(networks)/network/[network]/erc-4337/account-factory/[address]/observations/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/account-factory/[address]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/erc-4337/account-factory/[address]/observations/[timestampMs]/[source]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]/(erc4337AccountFactory)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/network/[network]/erc-4337/account-factory/[address]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			address: [
				'evmAddress',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'Erc4337AccountFactory_Timestamp.FactoryTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/erc-4337/account-factory/[address]/observations/[timestampMs]/[source]:Erc4337AccountFactory_Timestamp.FactoryTimestampMsSource.1.network',
							address: '/network/[network]/erc-4337/account-factory/[address]/observations/[timestampMs]/[source]:Erc4337AccountFactory_Timestamp.FactoryTimestampMsSource.1.address',
							timestampMs: '/network/[network]/erc-4337/account-factory/[address]/observations/[timestampMs]/[source]:Erc4337AccountFactory_Timestamp.FactoryTimestampMsSource.1.timestampMs',
							source: '/network/[network]/erc-4337/account-factory/[address]/observations/[timestampMs]/[source]:Erc4337AccountFactory_Timestamp.FactoryTimestampMsSource.1.source',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]/(erc4337AccountFactory)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'network'), '/erc-4337/account-factory/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]/(erc4337AccountFactory)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'address'), '/observations/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]/(erc4337AccountFactory)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]/(erc4337AccountFactory)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(networks)/network/[network]/erc-4337/bundler/[address]': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/bundler/[address]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/erc-4337/bundler/[address]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]',
		publicPath: '/network/[network]/erc-4337/bundler/[address]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			address: [
				'evmAddress',
			],
		},
		mappings: [
			{
				id: 'Erc4337Bundler.EvmNetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/erc-4337/bundler/[address]:Erc4337Bundler.EvmNetworkAddress.1.network',
							address: '/network/[network]/erc-4337/bundler/[address]:Erc4337Bundler.EvmNetworkAddress.1.address',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]', 'network'), '/erc-4337/bundler/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]', 'address')].join(''),
	},
	'/(explore)/(networks)/network/[network]/erc-4337/bundler/[address]/observations': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/bundler/[address]/observations',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/erc-4337/bundler/[address]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]/(erc4337Bundler)/observations',
		publicPath: '/network/[network]/erc-4337/bundler/[address]/observations',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			address: [
				'evmAddress',
			],
		},
		mappings: [
			{
				id: 'Erc4337Bundler.EvmNetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/erc-4337/bundler/[address]:Erc4337Bundler.EvmNetworkAddress.1.network',
							address: '/network/[network]/erc-4337/bundler/[address]:Erc4337Bundler.EvmNetworkAddress.1.address',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]/(erc4337Bundler)/observations', 'network'), '/erc-4337/bundler/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]/(erc4337Bundler)/observations', 'address'), '/observations'].join(''),
	},
	'/(explore)/(networks)/network/[network]/erc-4337/bundler/[address]/observations/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/bundler/[address]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/erc-4337/bundler/[address]/observations/[timestampMs]/[source]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]/(erc4337Bundler)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/network/[network]/erc-4337/bundler/[address]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			address: [
				'evmAddress',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'Erc4337Bundler_Timestamp.BundlerTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/erc-4337/bundler/[address]/observations/[timestampMs]/[source]:Erc4337Bundler_Timestamp.BundlerTimestampMsSource.1.network',
							address: '/network/[network]/erc-4337/bundler/[address]/observations/[timestampMs]/[source]:Erc4337Bundler_Timestamp.BundlerTimestampMsSource.1.address',
							timestampMs: '/network/[network]/erc-4337/bundler/[address]/observations/[timestampMs]/[source]:Erc4337Bundler_Timestamp.BundlerTimestampMsSource.1.timestampMs',
							source: '/network/[network]/erc-4337/bundler/[address]/observations/[timestampMs]/[source]:Erc4337Bundler_Timestamp.BundlerTimestampMsSource.1.source',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]/(erc4337Bundler)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'network'), '/erc-4337/bundler/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]/(erc4337Bundler)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'address'), '/observations/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]/(erc4337Bundler)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]/(erc4337Bundler)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(networks)/network/[network]/erc-4337/bundlers': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/bundlers',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundlers',
		publicPath: '/network/[network]/erc-4337/bundlers',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundlers', 'network'), '/erc-4337/bundlers'].join(''),
	},
	'/(explore)/(networks)/network/[network]/erc-4337/paymaster/[address]': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/paymaster/[address]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/erc-4337/paymaster/[address]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymaster/[address=evmAddress]',
		publicPath: '/network/[network]/erc-4337/paymaster/[address]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			address: [
				'evmAddress',
			],
		},
		mappings: [
			{
				id: 'Erc4337Paymaster.EvmNetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/erc-4337/paymaster/[address]:Erc4337Paymaster.EvmNetworkAddress.1.network',
							address: '/network/[network]/erc-4337/paymaster/[address]:Erc4337Paymaster.EvmNetworkAddress.1.address',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymaster/[address=evmAddress]', 'network'), '/erc-4337/paymaster/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymaster/[address=evmAddress]', 'address')].join(''),
	},
	'/(explore)/(networks)/network/[network]/erc-4337/paymaster/[address]/observations': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/paymaster/[address]/observations',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/erc-4337/paymaster/[address]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymaster/[address=evmAddress]/(erc4337Paymaster)/observations',
		publicPath: '/network/[network]/erc-4337/paymaster/[address]/observations',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			address: [
				'evmAddress',
			],
		},
		mappings: [
			{
				id: 'Erc4337Paymaster.EvmNetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/erc-4337/paymaster/[address]:Erc4337Paymaster.EvmNetworkAddress.1.network',
							address: '/network/[network]/erc-4337/paymaster/[address]:Erc4337Paymaster.EvmNetworkAddress.1.address',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymaster/[address=evmAddress]/(erc4337Paymaster)/observations', 'network'), '/erc-4337/paymaster/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymaster/[address=evmAddress]/(erc4337Paymaster)/observations', 'address'), '/observations'].join(''),
	},
	'/(explore)/(networks)/network/[network]/erc-4337/paymaster/[address]/observations/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/paymaster/[address]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/erc-4337/paymaster/[address]/observations/[timestampMs]/[source]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymaster/[address=evmAddress]/(erc4337Paymaster)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/network/[network]/erc-4337/paymaster/[address]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			address: [
				'evmAddress',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'Erc4337Paymaster_Timestamp.PaymasterTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/erc-4337/paymaster/[address]/observations/[timestampMs]/[source]:Erc4337Paymaster_Timestamp.PaymasterTimestampMsSource.1.network',
							address: '/network/[network]/erc-4337/paymaster/[address]/observations/[timestampMs]/[source]:Erc4337Paymaster_Timestamp.PaymasterTimestampMsSource.1.address',
							timestampMs: '/network/[network]/erc-4337/paymaster/[address]/observations/[timestampMs]/[source]:Erc4337Paymaster_Timestamp.PaymasterTimestampMsSource.1.timestampMs',
							source: '/network/[network]/erc-4337/paymaster/[address]/observations/[timestampMs]/[source]:Erc4337Paymaster_Timestamp.PaymasterTimestampMsSource.1.source',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymaster/[address=evmAddress]/(erc4337Paymaster)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'network'), '/erc-4337/paymaster/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymaster/[address=evmAddress]/(erc4337Paymaster)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'address'), '/observations/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymaster/[address=evmAddress]/(erc4337Paymaster)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymaster/[address=evmAddress]/(erc4337Paymaster)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(networks)/network/[network]/erc-4337/paymasters': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/paymasters',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymasters',
		publicPath: '/network/[network]/erc-4337/paymasters',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymasters', 'network'), '/erc-4337/paymasters'].join(''),
	},
	'/(explore)/(networks)/network/[network]/erc-4337/smart-account/[address]': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/smart-account/[address]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/erc-4337/smart-account/[address]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-account/[address=evmAddress]',
		publicPath: '/network/[network]/erc-4337/smart-account/[address]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			address: [
				'evmAddress',
			],
		},
		mappings: [
			{
				id: 'Erc4337SmartAccount.EvmNetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/erc-4337/smart-account/[address]:Erc4337SmartAccount.EvmNetworkAddress.1.network',
							address: '/network/[network]/erc-4337/smart-account/[address]:Erc4337SmartAccount.EvmNetworkAddress.1.address',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-account/[address=evmAddress]', 'network'), '/erc-4337/smart-account/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-account/[address=evmAddress]', 'address')].join(''),
	},
	'/(explore)/(networks)/network/[network]/erc-4337/smart-account/[address]/observations': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/smart-account/[address]/observations',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/erc-4337/smart-account/[address]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-account/[address=evmAddress]/(erc4337SmartAccount)/observations',
		publicPath: '/network/[network]/erc-4337/smart-account/[address]/observations',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			address: [
				'evmAddress',
			],
		},
		mappings: [
			{
				id: 'Erc4337SmartAccount.EvmNetworkAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/erc-4337/smart-account/[address]:Erc4337SmartAccount.EvmNetworkAddress.1.network',
							address: '/network/[network]/erc-4337/smart-account/[address]:Erc4337SmartAccount.EvmNetworkAddress.1.address',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-account/[address=evmAddress]/(erc4337SmartAccount)/observations', 'network'), '/erc-4337/smart-account/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-account/[address=evmAddress]/(erc4337SmartAccount)/observations', 'address'), '/observations'].join(''),
	},
	'/(explore)/(networks)/network/[network]/erc-4337/smart-account/[address]/observations/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/smart-account/[address]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/erc-4337/smart-account/[address]/observations/[timestampMs]/[source]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-account/[address=evmAddress]/(erc4337SmartAccount)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/network/[network]/erc-4337/smart-account/[address]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			address: [
				'evmAddress',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'Erc4337SmartAccount_Timestamp.AccountTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/erc-4337/smart-account/[address]/observations/[timestampMs]/[source]:Erc4337SmartAccount_Timestamp.AccountTimestampMsSource.1.network',
							address: '/network/[network]/erc-4337/smart-account/[address]/observations/[timestampMs]/[source]:Erc4337SmartAccount_Timestamp.AccountTimestampMsSource.1.address',
							timestampMs: '/network/[network]/erc-4337/smart-account/[address]/observations/[timestampMs]/[source]:Erc4337SmartAccount_Timestamp.AccountTimestampMsSource.1.timestampMs',
							source: '/network/[network]/erc-4337/smart-account/[address]/observations/[timestampMs]/[source]:Erc4337SmartAccount_Timestamp.AccountTimestampMsSource.1.source',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-account/[address=evmAddress]/(erc4337SmartAccount)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'network'), '/erc-4337/smart-account/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-account/[address=evmAddress]/(erc4337SmartAccount)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'address'), '/observations/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-account/[address=evmAddress]/(erc4337SmartAccount)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-account/[address=evmAddress]/(erc4337SmartAccount)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(networks)/network/[network]/erc-4337/smart-accounts': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/smart-accounts',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-accounts',
		publicPath: '/network/[network]/erc-4337/smart-accounts',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-accounts', 'network'), '/erc-4337/smart-accounts'].join(''),
	},
	'/(explore)/(networks)/network/[network]/erc-4337/user-operations': {
		nodeId: '/(explore)/(networks)/network/[network]/erc-4337/user-operations',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/user-operations',
		publicPath: '/network/[network]/erc-4337/user-operations',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/user-operations', 'network'), '/erc-4337/user-operations'].join(''),
	},
	'/(explore)/(networks)/network/[network]/faucets': {
		nodeId: '/(explore)/(networks)/network/[network]/faucets',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/faucets',
		publicPath: '/network/[network]/faucets',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/faucets', 'network'), '/faucets'].join(''),
	},
	'/(explore)/(networks)/network/[network]/fee-market': {
		nodeId: '/(explore)/(networks)/network/[network]/fee-market',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/fee-market',
		publicPath: '/network/[network]/fee-market',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/fee-market', 'network'), '/fee-market'].join(''),
	},
	'/(explore)/(networks)/network/[network]/fee-market/block/[blockNumber]': {
		nodeId: '/(explore)/(networks)/network/[network]/fee-market/block/[blockNumber]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/fee-market/block/[blockNumber]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/fee-market/block/[blockNumber=nonNegativeBigInt]',
		publicPath: '/network/[network]/fee-market/block/[blockNumber]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			blockNumber: [
				'nonNegativeBigInt',
			],
		},
		mappings: [
			{
				id: 'EvmNetwork_GasFee_Block.EvmNetworkBlockNumber',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/fee-market/block/[blockNumber]:EvmNetwork_GasFee_Block.EvmNetworkBlockNumber.1.network',
							blockNumber: '/network/[network]/fee-market/block/[blockNumber]:EvmNetwork_GasFee_Block.EvmNetworkBlockNumber.1.blockNumber',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/fee-market/block/[blockNumber=nonNegativeBigInt]', 'network'), '/fee-market/block/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/fee-market/block/[blockNumber=nonNegativeBigInt]', 'blockNumber')].join(''),
	},
	'/(explore)/(networks)/network/[network]/finality': {
		nodeId: '/(explore)/(networks)/network/[network]/finality',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/finality',
		publicPath: '/network/[network]/finality',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/finality', 'network'), '/finality'].join(''),
	},
	'/(explore)/(networks)/network/[network]/finality/[timestampMs]': {
		nodeId: '/(explore)/(networks)/network/[network]/finality/[timestampMs]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/finality/[timestampMs]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/finality/[timestampMs=nonNegativeInteger]',
		publicPath: '/network/[network]/finality/[timestampMs]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'EthereumBeaconFinality_Timestamp.EvmNetworkTimestampMs',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/finality/[timestampMs]:EthereumBeaconFinality_Timestamp.EvmNetworkTimestampMs.1.network',
							timestampMs: '/network/[network]/finality/[timestampMs]:EthereumBeaconFinality_Timestamp.EvmNetworkTimestampMs.1.timestampMs',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/finality/[timestampMs=nonNegativeInteger]', 'network'), '/finality/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/finality/[timestampMs=nonNegativeInteger]', 'timestampMs')].join(''),
	},
	'/(explore)/(networks)/network/[network]/gas-estimates': {
		nodeId: '/(explore)/(networks)/network/[network]/gas-estimates',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/gas-estimates',
		publicPath: '/network/[network]/gas-estimates',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/gas-estimates', 'network'), '/gas-estimates'].join(''),
	},
	'/(explore)/(networks)/network/[network]/gas-estimates/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/gas-estimates/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/gas-estimates/[timestampMs]/[source]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/gas-estimates/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/network/[network]/gas-estimates/[timestampMs]/[source]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'EvmNetwork_GasEstimate_Timestamp.NetworkTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/gas-estimates/[timestampMs]/[source]:EvmNetwork_GasEstimate_Timestamp.NetworkTimestampMsSource.1.network',
							timestampMs: '/network/[network]/gas-estimates/[timestampMs]/[source]:EvmNetwork_GasEstimate_Timestamp.NetworkTimestampMsSource.1.timestampMs',
							source: '/network/[network]/gas-estimates/[timestampMs]/[source]:EvmNetwork_GasEstimate_Timestamp.NetworkTimestampMsSource.1.source',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/gas-estimates/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'network'), '/gas-estimates/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/gas-estimates/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/gas-estimates/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(networks)/network/[network]/governance': {
		nodeId: '/(explore)/(networks)/network/[network]/governance',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance',
		publicPath: '/network/[network]/governance',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance', 'network'), '/governance'].join(''),
	},
	'/(explore)/(networks)/network/[network]/governance/committee/epoch/[epoch]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/governance/committee/epoch/[epoch]/[source]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/governance/committee/epoch/[epoch]/[source]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/committee/epoch/[epoch=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/network/[network]/governance/committee/epoch/[epoch]/[source]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			epoch: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'CardanoCommittee_Epoch.NetworkEpochSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/governance/committee/epoch/[epoch]/[source]:CardanoCommittee_Epoch.NetworkEpochSource.1.network',
							epoch: '/network/[network]/governance/committee/epoch/[epoch]/[source]:CardanoCommittee_Epoch.NetworkEpochSource.1.epoch',
							source: '/network/[network]/governance/committee/epoch/[epoch]/[source]:CardanoCommittee_Epoch.NetworkEpochSource.1.source',
						},
					},
				],
				projectionPath: [
					'Cardano',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/committee/epoch/[epoch=nonNegativeInteger]/[source=stringSegment]', 'network'), '/governance/committee/epoch/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/committee/epoch/[epoch=nonNegativeInteger]/[source=stringSegment]', 'epoch'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/committee/epoch/[epoch=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(networks)/network/[network]/governance/proposal/[proposalTxHash]/[proposalIndex]': {
		nodeId: '/(explore)/(networks)/network/[network]/governance/proposal/[proposalTxHash]/[proposalIndex]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/governance/proposal/[proposalTxHash]/[proposalIndex]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]',
		publicPath: '/network/[network]/governance/proposal/[proposalTxHash]/[proposalIndex]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			proposalTxHash: [
				'stringSegment',
			],
			proposalIndex: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'CardanoGovernanceProposal.NetworkProposalTxHashProposalIndex',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/governance/proposal/[proposalTxHash]/[proposalIndex]:CardanoGovernanceProposal.NetworkProposalTxHashProposalIndex.1.network',
							proposalTxHash: '/network/[network]/governance/proposal/[proposalTxHash]/[proposalIndex]:CardanoGovernanceProposal.NetworkProposalTxHashProposalIndex.1.proposalTxHash',
							proposalIndex: '/network/[network]/governance/proposal/[proposalTxHash]/[proposalIndex]:CardanoGovernanceProposal.NetworkProposalTxHashProposalIndex.1.proposalIndex',
						},
					},
				],
				projectionPath: [
					'Cardano',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]', 'network'), '/governance/proposal/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]', 'proposalTxHash'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]', 'proposalIndex')].join(''),
	},
	'/(explore)/(networks)/network/[network]/invoices': {
		nodeId: '/(explore)/(networks)/network/[network]/invoices',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/invoices',
		publicPath: '/network/[network]/invoices',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/invoices', 'network'), '/invoices'].join(''),
	},
	'/(explore)/(networks)/network/[network]/invoices/[paymentHash]': {
		nodeId: '/(explore)/(networks)/network/[network]/invoices/[paymentHash]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/invoices/[paymentHash]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/invoices/[paymentHash=stringSegment]',
		publicPath: '/network/[network]/invoices/[paymentHash]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			paymentHash: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'BlockheadLightningInvoice.NetworkPaymentHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/invoices/[paymentHash]:BlockheadLightningInvoice.NetworkPaymentHash.1.network',
							paymentHash: '/network/[network]/invoices/[paymentHash]:BlockheadLightningInvoice.NetworkPaymentHash.1.paymentHash',
						},
					},
				],
				projectionPath: [
					'Lightning',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/invoices/[paymentHash=stringSegment]', 'network'), '/invoices/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/invoices/[paymentHash=stringSegment]', 'paymentHash')].join(''),
	},
	'/(explore)/(networks)/network/[network]/ledger/[ledgerIndex]': {
		nodeId: '/(explore)/(networks)/network/[network]/ledger/[ledgerIndex]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/ledger/[ledgerIndex]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ledger/[ledgerIndex=nonNegativeBigInt]',
		publicPath: '/network/[network]/ledger/[ledgerIndex]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			ledgerIndex: [
				'nonNegativeBigInt',
			],
		},
		mappings: [
			{
				id: 'XrplLedger.NetworkLedgerIndex',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/ledger/[ledgerIndex]:XrplLedger.NetworkLedgerIndex.1.network',
							ledgerIndex: '/network/[network]/ledger/[ledgerIndex]:XrplLedger.NetworkLedgerIndex.1.ledgerIndex',
						},
					},
				],
				projectionPath: [
					'Xrpl',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ledger/[ledgerIndex=nonNegativeBigInt]', 'network'), '/ledger/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ledger/[ledgerIndex=nonNegativeBigInt]', 'ledgerIndex')].join(''),
	},
	'/(explore)/(networks)/network/[network]/mempool': {
		nodeId: '/(explore)/(networks)/network/[network]/mempool',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mempool',
		publicPath: '/network/[network]/mempool',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mempool', 'network'), '/mempool'].join(''),
	},
	'/(explore)/(networks)/network/[network]/mempool/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/mempool/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/mempool/[timestampMs]/[source]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mempool/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/network/[network]/mempool/[timestampMs]/[source]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'EvmNetwork_Txpool_Timestamp.NetworkTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/mempool/[timestampMs]/[source]:EvmNetwork_Txpool_Timestamp.NetworkTimestampMsSource.1.network',
							timestampMs: '/network/[network]/mempool/[timestampMs]/[source]:EvmNetwork_Txpool_Timestamp.NetworkTimestampMsSource.1.timestampMs',
							source: '/network/[network]/mempool/[timestampMs]/[source]:EvmNetwork_Txpool_Timestamp.NetworkTimestampMsSource.1.source',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mempool/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'network'), '/mempool/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mempool/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mempool/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(networks)/network/[network]/mev/builder/[builderPubkey]': {
		nodeId: '/(explore)/(networks)/network/[network]/mev/builder/[builderPubkey]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/mev/builder/[builderPubkey]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builder/[builderPubkey=stringSegment]',
		publicPath: '/network/[network]/mev/builder/[builderPubkey]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			builderPubkey: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'MevBuilder.EvmNetworkBuilderPubkey',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/mev/builder/[builderPubkey]:MevBuilder.EvmNetworkBuilderPubkey.1.network',
							builderPubkey: '/network/[network]/mev/builder/[builderPubkey]:MevBuilder.EvmNetworkBuilderPubkey.1.builderPubkey',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builder/[builderPubkey=stringSegment]', 'network'), '/mev/builder/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builder/[builderPubkey=stringSegment]', 'builderPubkey')].join(''),
	},
	'/(explore)/(networks)/network/[network]/mev/builder/[builderPubkey]/timestamp/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/mev/builder/[builderPubkey]/timestamp/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/mev/builder/[builderPubkey]/timestamp/[timestampMs]/[source]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builder/[builderPubkey=stringSegment]/(mevBuilder)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/network/[network]/mev/builder/[builderPubkey]/timestamp/[timestampMs]/[source]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			builderPubkey: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'MevBuilder_Timestamp.BuilderTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/mev/builder/[builderPubkey]/timestamp/[timestampMs]/[source]:MevBuilder_Timestamp.BuilderTimestampMsSource.1.network',
							builderPubkey: '/network/[network]/mev/builder/[builderPubkey]/timestamp/[timestampMs]/[source]:MevBuilder_Timestamp.BuilderTimestampMsSource.1.builderPubkey',
							timestampMs: '/network/[network]/mev/builder/[builderPubkey]/timestamp/[timestampMs]/[source]:MevBuilder_Timestamp.BuilderTimestampMsSource.1.timestampMs',
							source: '/network/[network]/mev/builder/[builderPubkey]/timestamp/[timestampMs]/[source]:MevBuilder_Timestamp.BuilderTimestampMsSource.1.source',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builder/[builderPubkey=stringSegment]/(mevBuilder)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'network'), '/mev/builder/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builder/[builderPubkey=stringSegment]/(mevBuilder)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'builderPubkey'), '/timestamp/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builder/[builderPubkey=stringSegment]/(mevBuilder)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builder/[builderPubkey=stringSegment]/(mevBuilder)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(networks)/network/[network]/mev/builders': {
		nodeId: '/(explore)/(networks)/network/[network]/mev/builders',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builders',
		publicPath: '/network/[network]/mev/builders',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builders', 'network'), '/mev/builders'].join(''),
	},
	'/(explore)/(networks)/network/[network]/mev/payload/[relayHost]/[slot]/[blockHash]': {
		nodeId: '/(explore)/(networks)/network/[network]/mev/payload/[relayHost]/[slot]/[blockHash]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/mev/payload/[relayHost]/[slot]/[blockHash]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/payload/[relayHost=stringSegment]/[slot=nonNegativeInteger]/[blockHash=zeroExHex]',
		publicPath: '/network/[network]/mev/payload/[relayHost]/[slot]/[blockHash]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			relayHost: [
				'stringSegment',
			],
			slot: [
				'nonNegativeInteger',
			],
			blockHash: [
				'zeroExHex',
			],
		},
		mappings: [
			{
				id: 'MevRelay_ProposerPayloadDelivered.EvmNetworkRelayHostSlotBlockHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/mev/payload/[relayHost]/[slot]/[blockHash]:MevRelay_ProposerPayloadDelivered.EvmNetworkRelayHostSlotBlockHash.1.network',
							relayHost: '/network/[network]/mev/payload/[relayHost]/[slot]/[blockHash]:MevRelay_ProposerPayloadDelivered.EvmNetworkRelayHostSlotBlockHash.1.relayHost',
							slot: '/network/[network]/mev/payload/[relayHost]/[slot]/[blockHash]:MevRelay_ProposerPayloadDelivered.EvmNetworkRelayHostSlotBlockHash.1.slot',
							blockHash: '/network/[network]/mev/payload/[relayHost]/[slot]/[blockHash]:MevRelay_ProposerPayloadDelivered.EvmNetworkRelayHostSlotBlockHash.1.blockHash',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/payload/[relayHost=stringSegment]/[slot=nonNegativeInteger]/[blockHash=zeroExHex]', 'network'), '/mev/payload/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/payload/[relayHost=stringSegment]/[slot=nonNegativeInteger]/[blockHash=zeroExHex]', 'relayHost'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/payload/[relayHost=stringSegment]/[slot=nonNegativeInteger]/[blockHash=zeroExHex]', 'slot'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/payload/[relayHost=stringSegment]/[slot=nonNegativeInteger]/[blockHash=zeroExHex]', 'blockHash')].join(''),
	},
	'/(explore)/(networks)/network/[network]/mev/payloads': {
		nodeId: '/(explore)/(networks)/network/[network]/mev/payloads',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/payloads',
		publicPath: '/network/[network]/mev/payloads',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/payloads', 'network'), '/mev/payloads'].join(''),
	},
	'/(explore)/(networks)/network/[network]/mev/relay/[host]': {
		nodeId: '/(explore)/(networks)/network/[network]/mev/relay/[host]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/mev/relay/[host]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relay/[host=stringSegment]',
		publicPath: '/network/[network]/mev/relay/[host]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			host: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'MevRelay.EvmNetworkHost',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/mev/relay/[host]:MevRelay.EvmNetworkHost.1.network',
							host: '/network/[network]/mev/relay/[host]:MevRelay.EvmNetworkHost.1.host',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relay/[host=stringSegment]', 'network'), '/mev/relay/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relay/[host=stringSegment]', 'host')].join(''),
	},
	'/(explore)/(networks)/network/[network]/mev/relay/[host]/timestamp/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/mev/relay/[host]/timestamp/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/mev/relay/[host]/timestamp/[timestampMs]/[source]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relay/[host=stringSegment]/(mevRelay)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/network/[network]/mev/relay/[host]/timestamp/[timestampMs]/[source]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			host: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'MevRelay_Timestamp.RelayTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/mev/relay/[host]/timestamp/[timestampMs]/[source]:MevRelay_Timestamp.RelayTimestampMsSource.1.network',
							host: '/network/[network]/mev/relay/[host]/timestamp/[timestampMs]/[source]:MevRelay_Timestamp.RelayTimestampMsSource.1.host',
							timestampMs: '/network/[network]/mev/relay/[host]/timestamp/[timestampMs]/[source]:MevRelay_Timestamp.RelayTimestampMsSource.1.timestampMs',
							source: '/network/[network]/mev/relay/[host]/timestamp/[timestampMs]/[source]:MevRelay_Timestamp.RelayTimestampMsSource.1.source',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relay/[host=stringSegment]/(mevRelay)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'network'), '/mev/relay/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relay/[host=stringSegment]/(mevRelay)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'host'), '/timestamp/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relay/[host=stringSegment]/(mevRelay)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relay/[host=stringSegment]/(mevRelay)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(networks)/network/[network]/mev/relays': {
		nodeId: '/(explore)/(networks)/network/[network]/mev/relays',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relays',
		publicPath: '/network/[network]/mev/relays',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relays', 'network'), '/mev/relays'].join(''),
	},
	'/(explore)/(networks)/network/[network]/miner/[minerAddress]': {
		nodeId: '/(explore)/(networks)/network/[network]/miner/[minerAddress]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/miner/[minerAddress]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]',
		publicPath: '/network/[network]/miner/[minerAddress]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			minerAddress: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'FilecoinMiner.NetworkMinerAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/miner/[minerAddress]:FilecoinMiner.NetworkMinerAddress.1.network',
							minerAddress: '/network/[network]/miner/[minerAddress]:FilecoinMiner.NetworkMinerAddress.1.minerAddress',
						},
					},
				],
				projectionPath: [
					'Filecoin',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]', 'network'), '/miner/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]', 'minerAddress')].join(''),
	},
	'/(explore)/(networks)/network/[network]/miner/[minerAddress]/observations/[height]/[tipsetKey]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/miner/[minerAddress]/observations/[height]/[tipsetKey]/[source]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/miner/[minerAddress]/observations/[height]/[tipsetKey]/[source]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]/(filecoinMiner)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]',
		publicPath: '/network/[network]/miner/[minerAddress]/observations/[height]/[tipsetKey]/[source]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			minerAddress: [
				'stringSegment',
			],
			height: [
				'nonNegativeBigInt',
			],
			tipsetKey: [
				'stringSegment',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'FilecoinMiner_Timestamp.MinerHeightTipsetKeySource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/miner/[minerAddress]/observations/[height]/[tipsetKey]/[source]:FilecoinMiner_Timestamp.MinerHeightTipsetKeySource.1.network',
							minerAddress: '/network/[network]/miner/[minerAddress]/observations/[height]/[tipsetKey]/[source]:FilecoinMiner_Timestamp.MinerHeightTipsetKeySource.1.minerAddress',
							height: '/network/[network]/miner/[minerAddress]/observations/[height]/[tipsetKey]/[source]:FilecoinMiner_Timestamp.MinerHeightTipsetKeySource.1.height',
							tipsetKey: '/network/[network]/miner/[minerAddress]/observations/[height]/[tipsetKey]/[source]:FilecoinMiner_Timestamp.MinerHeightTipsetKeySource.1.tipsetKey',
							source: '/network/[network]/miner/[minerAddress]/observations/[height]/[tipsetKey]/[source]:FilecoinMiner_Timestamp.MinerHeightTipsetKeySource.1.source',
						},
					},
				],
				projectionPath: [
					'Filecoin',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]/(filecoinMiner)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', 'network'), '/miner/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]/(filecoinMiner)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', 'minerAddress'), '/observations/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]/(filecoinMiner)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', 'height'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]/(filecoinMiner)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', 'tipsetKey'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]/(filecoinMiner)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(networks)/network/[network]/native-assets': {
		nodeId: '/(explore)/(networks)/network/[network]/native-assets',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/native-assets',
		publicPath: '/network/[network]/native-assets',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/native-assets', 'network'), '/native-assets'].join(''),
	},
	'/(explore)/(networks)/network/[network]/nft-transfers': {
		nodeId: '/(explore)/(networks)/network/[network]/nft-transfers',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nft-transfers',
		publicPath: '/network/[network]/nft-transfers',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nft-transfers', 'network'), '/nft-transfers'].join(''),
	},
	'/(explore)/(networks)/network/[network]/nodes': {
		nodeId: '/(explore)/(networks)/network/[network]/nodes',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nodes',
		publicPath: '/network/[network]/nodes',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nodes', 'network'), '/nodes'].join(''),
	},
	'/(explore)/(networks)/network/[network]/nodes/[pubkey]': {
		nodeId: '/(explore)/(networks)/network/[network]/nodes/[pubkey]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/nodes/[pubkey]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nodes/[pubkey=stringSegment]',
		publicPath: '/network/[network]/nodes/[pubkey]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			pubkey: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'LightningNode.NetworkPublicKey',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/nodes/[pubkey]:LightningNode.NetworkPublicKey.1.network',
							pubkey: '/network/[network]/nodes/[pubkey]:LightningNode.NetworkPublicKey.1.pubkey',
						},
					},
				],
				projectionPath: [
					'Lightning',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nodes/[pubkey=stringSegment]', 'network'), '/nodes/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nodes/[pubkey=stringSegment]', 'pubkey')].join(''),
	},
	'/(explore)/(networks)/network/[network]/observation/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/observation/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/observation/[timestampMs]/[source]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/network/[network]/observation/[timestampMs]/[source]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'Network_Timestamp.NetworkTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/observation/[timestampMs]/[source]:Network_Timestamp.NetworkTimestampMsSource.1.network',
							timestampMs: '/network/[network]/observation/[timestampMs]/[source]:Network_Timestamp.NetworkTimestampMsSource.1.timestampMs',
							source: '/network/[network]/observation/[timestampMs]/[source]:Network_Timestamp.NetworkTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'network'), '/observation/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(networks)/network/[network]/observations': {
		nodeId: '/(explore)/(networks)/network/[network]/observations',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations',
		publicPath: '/network/[network]/observations',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations', 'network'), '/observations'].join(''),
	},
	'/(explore)/(networks)/network/[network]/observations/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/observations/[timestampMs]/[source]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/network/[network]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'EvmNetwork_Timestamp.NetworkTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/observations/[timestampMs]/[source]:EvmNetwork_Timestamp.NetworkTimestampMsSource.1.network',
							timestampMs: '/network/[network]/observations/[timestampMs]/[source]:EvmNetwork_Timestamp.NetworkTimestampMsSource.1.timestampMs',
							source: '/network/[network]/observations/[timestampMs]/[source]:EvmNetwork_Timestamp.NetworkTimestampMsSource.1.source',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'network'), '/observations/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(networks)/network/[network]/pallet/[palletName]': {
		nodeId: '/(explore)/(networks)/network/[network]/pallet/[palletName]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/pallet/[palletName]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/pallet/[palletName=stringSegment]',
		publicPath: '/network/[network]/pallet/[palletName]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			palletName: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'PolkadotPallet.NetworkPalletName',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/pallet/[palletName]:PolkadotPallet.NetworkPalletName.1.network',
							palletName: '/network/[network]/pallet/[palletName]:PolkadotPallet.NetworkPalletName.1.palletName',
						},
					},
				],
				projectionPath: [
					'Polkadot',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/pallet/[palletName=stringSegment]', 'network'), '/pallet/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/pallet/[palletName=stringSegment]', 'palletName')].join(''),
	},
	'/(explore)/(networks)/network/[network]/payments': {
		nodeId: '/(explore)/(networks)/network/[network]/payments',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/payments',
		publicPath: '/network/[network]/payments',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/payments', 'network'), '/payments'].join(''),
	},
	'/(explore)/(networks)/network/[network]/payments/[paymentHash]': {
		nodeId: '/(explore)/(networks)/network/[network]/payments/[paymentHash]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/payments/[paymentHash]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/payments/[paymentHash=stringSegment]',
		publicPath: '/network/[network]/payments/[paymentHash]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			paymentHash: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'BlockheadLightningPayment.NetworkPaymentHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/payments/[paymentHash]:BlockheadLightningPayment.NetworkPaymentHash.1.network',
							paymentHash: '/network/[network]/payments/[paymentHash]:BlockheadLightningPayment.NetworkPaymentHash.1.paymentHash',
						},
					},
				],
				projectionPath: [
					'Lightning',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/payments/[paymentHash=stringSegment]', 'network'), '/payments/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/payments/[paymentHash=stringSegment]', 'paymentHash')].join(''),
	},
	'/(explore)/(networks)/network/[network]/precompiles': {
		nodeId: '/(explore)/(networks)/network/[network]/precompiles',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/precompiles',
		publicPath: '/network/[network]/precompiles',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/precompiles', 'network'), '/precompiles'].join(''),
	},
	'/(explore)/(networks)/network/[network]/program/[programId]': {
		nodeId: '/(explore)/(networks)/network/[network]/program/[programId]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/program/[programId]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/program/[programId=stringSegment]',
		publicPath: '/network/[network]/program/[programId]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			programId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'SolanaProgram.NetworkProgramId',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/program/[programId]:SolanaProgram.NetworkProgramId.1.network',
							programId: '/network/[network]/program/[programId]:SolanaProgram.NetworkProgramId.1.programId',
						},
					},
				],
				projectionPath: [
					'Solana',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/program/[programId=stringSegment]', 'network'), '/program/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/program/[programId=stringSegment]', 'programId')].join(''),
	},
	'/(explore)/(networks)/network/[network]/programs': {
		nodeId: '/(explore)/(networks)/network/[network]/programs',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/programs',
		publicPath: '/network/[network]/programs',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/programs', 'network'), '/programs'].join(''),
	},
	'/(explore)/(networks)/network/[network]/rollup/[projectId]': {
		nodeId: '/(explore)/(networks)/network/[network]/rollup/[projectId]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/rollup/[projectId]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rollup/[projectId=stringSegment]',
		publicPath: '/network/[network]/rollup/[projectId]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			projectId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'EvmRollup.EvmNetworkProjectId',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/rollup/[projectId]:EvmRollup.EvmNetworkProjectId.1.network',
							projectId: '/network/[network]/rollup/[projectId]:EvmRollup.EvmNetworkProjectId.1.projectId',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rollup/[projectId=stringSegment]', 'network'), '/rollup/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rollup/[projectId=stringSegment]', 'projectId')].join(''),
	},
	'/(explore)/(networks)/network/[network]/rollup/[projectId]/timestamp/[timestampMs]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/rollup/[projectId]/timestamp/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/rollup/[projectId]/timestamp/[timestampMs]/[source]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rollup/[projectId=stringSegment]/(evmRollup)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/network/[network]/rollup/[projectId]/timestamp/[timestampMs]/[source]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			projectId: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'EvmRollup_Timestamp.RollupTimestampMsSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/rollup/[projectId]/timestamp/[timestampMs]/[source]:EvmRollup_Timestamp.RollupTimestampMsSource.1.network',
							projectId: '/network/[network]/rollup/[projectId]/timestamp/[timestampMs]/[source]:EvmRollup_Timestamp.RollupTimestampMsSource.1.projectId',
							timestampMs: '/network/[network]/rollup/[projectId]/timestamp/[timestampMs]/[source]:EvmRollup_Timestamp.RollupTimestampMsSource.1.timestampMs',
							source: '/network/[network]/rollup/[projectId]/timestamp/[timestampMs]/[source]:EvmRollup_Timestamp.RollupTimestampMsSource.1.source',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rollup/[projectId=stringSegment]/(evmRollup)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'network'), '/rollup/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rollup/[projectId=stringSegment]/(evmRollup)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'projectId'), '/timestamp/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rollup/[projectId=stringSegment]/(evmRollup)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rollup/[projectId=stringSegment]/(evmRollup)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(networks)/network/[network]/rpc-urls': {
		nodeId: '/(explore)/(networks)/network/[network]/rpc-urls',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rpc-urls',
		publicPath: '/network/[network]/rpc-urls',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rpc-urls', 'network'), '/rpc-urls'].join(''),
	},
	'/(explore)/(networks)/network/[network]/shielded-pool/[pool]': {
		nodeId: '/(explore)/(networks)/network/[network]/shielded-pool/[pool]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/shielded-pool/[pool]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/shielded-pool/[pool=stringSegment]',
		publicPath: '/network/[network]/shielded-pool/[pool]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			pool: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'ZcashShieldedPool.NetworkPool',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/shielded-pool/[pool]:ZcashShieldedPool.NetworkPool.1.network',
							pool: '/network/[network]/shielded-pool/[pool]:ZcashShieldedPool.NetworkPool.1.pool',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]/shielded-pool/[pool]:ZcashShieldedPool.NetworkPool.2.network',
							pool: '/network/[network]/shielded-pool/[pool]:ZcashShieldedPool.NetworkPool.2.pool',
						},
					},
				],
				projectionPath: [
					'Zcash',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/shielded-pool/[pool=stringSegment]', 'network'), '/shielded-pool/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/shielded-pool/[pool=stringSegment]', 'pool')].join(''),
	},
	'/(explore)/(networks)/network/[network]/slashings': {
		nodeId: '/(explore)/(networks)/network/[network]/slashings',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slashings',
		publicPath: '/network/[network]/slashings',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slashings', 'network'), '/slashings'].join(''),
	},
	'/(explore)/(networks)/network/[network]/slot/[slot]': {
		nodeId: '/(explore)/(networks)/network/[network]/slot/[slot]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/slot/[slot]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]',
		publicPath: '/network/[network]/slot/[slot]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			slot: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'BeaconSlot.EvmNetworkSlot',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/slot/[slot]:BeaconSlot.EvmNetworkSlot.1.network',
							slot: '/network/[network]/slot/[slot]:BeaconSlot.EvmNetworkSlot.1.slot',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]', 'network'), '/slot/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]', 'slot')].join(''),
	},
	'/(explore)/(networks)/network/[network]/slot/[slot]/attestation/[index]': {
		nodeId: '/(explore)/(networks)/network/[network]/slot/[slot]/attestation/[index]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/slot/[slot]/attestation/[index]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/attestation/[index=nonNegativeInteger]',
		publicPath: '/network/[network]/slot/[slot]/attestation/[index]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			slot: [
				'nonNegativeInteger',
			],
			index: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'BeaconAttestation.EvmNetworkSlotIndexInSlot',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/slot/[slot]/attestation/[index]:BeaconAttestation.EvmNetworkSlotIndexInSlot.1.network',
							slot: '/network/[network]/slot/[slot]/attestation/[index]:BeaconAttestation.EvmNetworkSlotIndexInSlot.1.slot',
							index: '/network/[network]/slot/[slot]/attestation/[index]:BeaconAttestation.EvmNetworkSlotIndexInSlot.1.index',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/attestation/[index=nonNegativeInteger]', 'network'), '/slot/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/attestation/[index=nonNegativeInteger]', 'slot'), '/attestation/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/attestation/[index=nonNegativeInteger]', 'index')].join(''),
	},
	'/(explore)/(networks)/network/[network]/slot/[slot]/committee/[index]': {
		nodeId: '/(explore)/(networks)/network/[network]/slot/[slot]/committee/[index]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/slot/[slot]/committee/[index]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/committee/[index=nonNegativeInteger]',
		publicPath: '/network/[network]/slot/[slot]/committee/[index]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			slot: [
				'nonNegativeInteger',
			],
			index: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'BeaconCommittee.EvmNetworkSlotIndexInSlot',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/slot/[slot]/committee/[index]:BeaconCommittee.EvmNetworkSlotIndexInSlot.1.network',
							slot: '/network/[network]/slot/[slot]/committee/[index]:BeaconCommittee.EvmNetworkSlotIndexInSlot.1.slot',
							index: '/network/[network]/slot/[slot]/committee/[index]:BeaconCommittee.EvmNetworkSlotIndexInSlot.1.index',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/committee/[index=nonNegativeInteger]', 'network'), '/slot/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/committee/[index=nonNegativeInteger]', 'slot'), '/committee/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/committee/[index=nonNegativeInteger]', 'index')].join(''),
	},
	'/(explore)/(networks)/network/[network]/slot/[slot]/slashing/[kind]/[index]': {
		nodeId: '/(explore)/(networks)/network/[network]/slot/[slot]/slashing/[kind]/[index]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/slot/[slot]/slashing/[kind]/[index]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/slashing/[kind=stringSegment]/[index=nonNegativeInteger]',
		publicPath: '/network/[network]/slot/[slot]/slashing/[kind]/[index]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			slot: [
				'nonNegativeInteger',
			],
			kind: [
				'stringSegment',
			],
			index: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'BeaconSlashing.EvmNetworkSlotKindIndexInSlot',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/slot/[slot]/slashing/[kind]/[index]:BeaconSlashing.EvmNetworkSlotKindIndexInSlot.1.network',
							slot: '/network/[network]/slot/[slot]/slashing/[kind]/[index]:BeaconSlashing.EvmNetworkSlotKindIndexInSlot.1.slot',
							kind: '/network/[network]/slot/[slot]/slashing/[kind]/[index]:BeaconSlashing.EvmNetworkSlotKindIndexInSlot.1.kind',
							index: '/network/[network]/slot/[slot]/slashing/[kind]/[index]:BeaconSlashing.EvmNetworkSlotKindIndexInSlot.1.index',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/slashing/[kind=stringSegment]/[index=nonNegativeInteger]', 'network'), '/slot/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/slashing/[kind=stringSegment]/[index=nonNegativeInteger]', 'slot'), '/slashing/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/slashing/[kind=stringSegment]/[index=nonNegativeInteger]', 'kind'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/slashing/[kind=stringSegment]/[index=nonNegativeInteger]', 'index')].join(''),
	},
	'/(explore)/(networks)/network/[network]/slot/[slot]/withdrawal/[index]': {
		nodeId: '/(explore)/(networks)/network/[network]/slot/[slot]/withdrawal/[index]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/slot/[slot]/withdrawal/[index]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/withdrawal/[index=nonNegativeInteger]',
		publicPath: '/network/[network]/slot/[slot]/withdrawal/[index]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			slot: [
				'nonNegativeInteger',
			],
			index: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'BeaconWithdrawal.EvmNetworkSlotIndexInSlot',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/slot/[slot]/withdrawal/[index]:BeaconWithdrawal.EvmNetworkSlotIndexInSlot.1.network',
							slot: '/network/[network]/slot/[slot]/withdrawal/[index]:BeaconWithdrawal.EvmNetworkSlotIndexInSlot.1.slot',
							index: '/network/[network]/slot/[slot]/withdrawal/[index]:BeaconWithdrawal.EvmNetworkSlotIndexInSlot.1.index',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/withdrawal/[index=nonNegativeInteger]', 'network'), '/slot/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/withdrawal/[index=nonNegativeInteger]', 'slot'), '/withdrawal/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/withdrawal/[index=nonNegativeInteger]', 'index')].join(''),
	},
	'/(explore)/(networks)/network/[network]/slots': {
		nodeId: '/(explore)/(networks)/network/[network]/slots',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slots',
		publicPath: '/network/[network]/slots',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slots', 'network'), '/slots'].join(''),
	},
	'/(explore)/(networks)/network/[network]/stake-pool/[poolId]': {
		nodeId: '/(explore)/(networks)/network/[network]/stake-pool/[poolId]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/stake-pool/[poolId]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/stake-pool/[poolId=stringSegment]',
		publicPath: '/network/[network]/stake-pool/[poolId]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			poolId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'CardanoStakePool.NetworkPoolId',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/stake-pool/[poolId]:CardanoStakePool.NetworkPoolId.1.network',
							poolId: '/network/[network]/stake-pool/[poolId]:CardanoStakePool.NetworkPoolId.1.poolId',
						},
					},
				],
				projectionPath: [
					'Cardano',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/stake-pool/[poolId=stringSegment]', 'network'), '/stake-pool/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/stake-pool/[poolId=stringSegment]', 'poolId')].join(''),
	},
	'/(explore)/(networks)/network/[network]/sync-committee/[period]': {
		nodeId: '/(explore)/(networks)/network/[network]/sync-committee/[period]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/sync-committee/[period]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sync-committee/[period=nonNegativeInteger]',
		publicPath: '/network/[network]/sync-committee/[period]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			period: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'BeaconSyncCommittee.EvmNetworkPeriod',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/sync-committee/[period]:BeaconSyncCommittee.EvmNetworkPeriod.1.network',
							period: '/network/[network]/sync-committee/[period]:BeaconSyncCommittee.EvmNetworkPeriod.1.period',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sync-committee/[period=nonNegativeInteger]', 'network'), '/sync-committee/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sync-committee/[period=nonNegativeInteger]', 'period')].join(''),
	},
	'/(explore)/(networks)/network/[network]/sync-committees': {
		nodeId: '/(explore)/(networks)/network/[network]/sync-committees',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sync-committees',
		publicPath: '/network/[network]/sync-committees',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sync-committees', 'network'), '/sync-committees'].join(''),
	},
	'/(explore)/(networks)/network/[network]/token-account/[tokenAccountPubkey]': {
		nodeId: '/(explore)/(networks)/network/[network]/token-account/[tokenAccountPubkey]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/token-account/[tokenAccountPubkey]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-account/[tokenAccountPubkey=stringSegment]',
		publicPath: '/network/[network]/token-account/[tokenAccountPubkey]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			tokenAccountPubkey: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'SolanaTokenAccount.NetworkTokenAccountPubkey',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/token-account/[tokenAccountPubkey]:SolanaTokenAccount.NetworkTokenAccountPubkey.1.network',
							tokenAccountPubkey: '/network/[network]/token-account/[tokenAccountPubkey]:SolanaTokenAccount.NetworkTokenAccountPubkey.1.tokenAccountPubkey',
						},
					},
				],
				projectionPath: [
					'Solana',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-account/[tokenAccountPubkey=stringSegment]', 'network'), '/token-account/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-account/[tokenAccountPubkey=stringSegment]', 'tokenAccountPubkey')].join(''),
	},
	'/(explore)/(networks)/network/[network]/token-accounts': {
		nodeId: '/(explore)/(networks)/network/[network]/token-accounts',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-accounts',
		publicPath: '/network/[network]/token-accounts',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-accounts', 'network'), '/token-accounts'].join(''),
	},
	'/(explore)/(networks)/network/[network]/token-mint/[mintAddress]': {
		nodeId: '/(explore)/(networks)/network/[network]/token-mint/[mintAddress]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/token-mint/[mintAddress]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-mint/[mintAddress=stringSegment]',
		publicPath: '/network/[network]/token-mint/[mintAddress]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			mintAddress: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'SolanaTokenMint.NetworkMintAddress',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/token-mint/[mintAddress]:SolanaTokenMint.NetworkMintAddress.1.network',
							mintAddress: '/network/[network]/token-mint/[mintAddress]:SolanaTokenMint.NetworkMintAddress.1.mintAddress',
						},
					},
				],
				projectionPath: [
					'Solana',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-mint/[mintAddress=stringSegment]', 'network'), '/token-mint/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-mint/[mintAddress=stringSegment]', 'mintAddress')].join(''),
	},
	'/(explore)/(networks)/network/[network]/token-mints': {
		nodeId: '/(explore)/(networks)/network/[network]/token-mints',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-mints',
		publicPath: '/network/[network]/token-mints',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-mints', 'network'), '/token-mints'].join(''),
	},
	'/(explore)/(networks)/network/[network]/transaction/[hash]': {
		nodeId: '/(explore)/(networks)/network/[network]/transaction/[hash]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/transaction/[hash]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/transaction/[hash=stringSegment]',
		publicPath: '/network/[network]/transaction/[hash]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			hash: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'XrplTransaction.NetworkHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/transaction/[hash]:XrplTransaction.NetworkHash.1.network',
							hash: '/network/[network]/transaction/[hash]:XrplTransaction.NetworkHash.1.hash',
						},
					},
				],
				projectionPath: [
					'Xrpl',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/transaction/[hash=stringSegment]', 'network'), '/transaction/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/transaction/[hash=stringSegment]', 'hash')].join(''),
	},
	'/(explore)/(networks)/network/[network]/transactions': {
		nodeId: '/(explore)/(networks)/network/[network]/transactions',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/transactions',
		publicPath: '/network/[network]/transactions',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/transactions', 'network'), '/transactions'].join(''),
	},
	'/(explore)/(networks)/network/[network]/trustline/[account]/[currency]/[issuer]': {
		nodeId: '/(explore)/(networks)/network/[network]/trustline/[account]/[currency]/[issuer]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/trustline/[account]/[currency]/[issuer]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]',
		publicPath: '/network/[network]/trustline/[account]/[currency]/[issuer]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			account: [
				'stringSegment',
			],
			currency: [
				'stringSegment',
			],
			issuer: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'XrplTrustline.NetworkAccountCurrencyIssuer',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/trustline/[account]/[currency]/[issuer]:XrplTrustline.NetworkAccountCurrencyIssuer.1.network',
							account: '/network/[network]/trustline/[account]/[currency]/[issuer]:XrplTrustline.NetworkAccountCurrencyIssuer.1.account',
							currency: '/network/[network]/trustline/[account]/[currency]/[issuer]:XrplTrustline.NetworkAccountCurrencyIssuer.1.currency',
							issuer: '/network/[network]/trustline/[account]/[currency]/[issuer]:XrplTrustline.NetworkAccountCurrencyIssuer.1.issuer',
						},
					},
				],
				projectionPath: [
					'Xrpl',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]', 'network'), '/trustline/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]', 'account'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]', 'currency'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]', 'issuer')].join(''),
	},
	'/(explore)/(networks)/network/[network]/upgrades': {
		nodeId: '/(explore)/(networks)/network/[network]/upgrades',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/upgrades',
		publicPath: '/network/[network]/upgrades',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/upgrades', 'network'), '/upgrades'].join(''),
	},
	'/(explore)/(networks)/network/[network]/user-operation/[userOperationHash]': {
		nodeId: '/(explore)/(networks)/network/[network]/user-operation/[userOperationHash]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/user-operation/[userOperationHash]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/user-operation/[userOperationHash=userOperationHash]',
		publicPath: '/network/[network]/user-operation/[userOperationHash]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			userOperationHash: [
				'userOperationHash',
			],
		},
		mappings: [
			{
				id: 'EvmUserOperation.EvmNetworkHash',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/user-operation/[userOperationHash]:EvmUserOperation.EvmNetworkHash.1.network',
							userOperationHash: '/network/[network]/user-operation/[userOperationHash]:EvmUserOperation.EvmNetworkHash.1.userOperationHash',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/user-operation/[userOperationHash=userOperationHash]', 'network'), '/user-operation/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/user-operation/[userOperationHash=userOperationHash]', 'userOperationHash')].join(''),
	},
	'/(explore)/(networks)/network/[network]/validator/[validatorId]': {
		nodeId: '/(explore)/(networks)/network/[network]/validator/[validatorId]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/validator/[validatorId]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]',
		publicPath: '/network/[network]/validator/[validatorId]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			validatorId: [
				'nonNegativeInteger',
				'solanaPubkey',
			],
		},
		mappings: [
			{
				id: 'BeaconValidator.NetworkIndexInNetwork',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/validator/[validatorId]:BeaconValidator.NetworkIndexInNetwork.1.network',
							validatorId: '/network/[network]/validator/[validatorId]:BeaconValidator.NetworkIndexInNetwork.1.validatorId',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaValidator.NetworkVotePubkey',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/validator/[validatorId]:SolanaValidator.NetworkVotePubkey.1.network',
							validatorId: '/network/[network]/validator/[validatorId]:SolanaValidator.NetworkVotePubkey.1.validatorId',
						},
					},
				],
				projectionPath: [
					'Solana',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', 'network'), '/validator/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]', 'validatorId')].join(''),
	},
	'/(explore)/(networks)/network/[network]/validator/[validatorId]/observations/[slot]/[source]': {
		nodeId: '/(explore)/(networks)/network/[network]/validator/[validatorId]/observations/[slot]/[source]',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]/validator/[validatorId]/observations/[slot]/[source]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]/(selection)/observations/[slot=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/network/[network]/validator/[validatorId]/observations/[slot]/[source]',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
			validatorId: [
				'nonNegativeInteger',
				'solanaPubkey',
			],
			slot: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'BeaconValidator_Timestamp.ValidatorSlotSource',
				routeKind: 'projection',
				projectionEntity: 'Network',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]/validator/[validatorId]/observations/[slot]/[source]:BeaconValidator_Timestamp.ValidatorSlotSource.1.network',
							validatorId: '/network/[network]/validator/[validatorId]/observations/[slot]/[source]:BeaconValidator_Timestamp.ValidatorSlotSource.1.validatorId',
							slot: '/network/[network]/validator/[validatorId]/observations/[slot]/[source]:BeaconValidator_Timestamp.ValidatorSlotSource.1.slot',
							source: '/network/[network]/validator/[validatorId]/observations/[slot]/[source]:BeaconValidator_Timestamp.ValidatorSlotSource.1.source',
						},
					},
				],
				projectionPath: [
					'Evm',
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]/(selection)/observations/[slot=nonNegativeInteger]/[source=stringSegment]', 'network'), '/validator/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]/(selection)/observations/[slot=nonNegativeInteger]/[source=stringSegment]', 'validatorId'), '/observations/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]/(selection)/observations/[slot=nonNegativeInteger]/[source=stringSegment]', 'slot'), '/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]/(selection)/observations/[slot=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(networks)/network/[network]/validators': {
		nodeId: '/(explore)/(networks)/network/[network]/validators',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validators',
		publicPath: '/network/[network]/validators',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validators', 'network'), '/validators'].join(''),
	},
	'/(explore)/(networks)/network/[network]/withdrawals': {
		nodeId: '/(explore)/(networks)/network/[network]/withdrawals',
		probeOwnerNodeId: '/(explore)/(networks)/network/[network]',
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/withdrawals',
		publicPath: '/network/[network]/withdrawals',
		parameterMatchers: {
			network: [
				'networkCaip2',
				'networkSlug',
			],
		},
		mappings: [
			{
				id: 'Network.Caip2',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Caip2.1.network',
						},
					},
				],
			},
			{
				id: 'Network.Slug',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							network: '/network/[network]:Network.Slug.1.network',
						},
					},
					{
						id: 'variant-2',
						params: {
							network: '/network/[network]:Network.Slug.2.network',
						},
					},
					{
						id: 'variant-3',
						params: {
							network: '/network/[network]:Network.Slug.3.network',
						},
					},
					{
						id: 'variant-4',
						params: {
							network: '/network/[network]:Network.Slug.4.network',
						},
					},
					{
						id: 'variant-5',
						params: {
							network: '/network/[network]:Network.Slug.5.network',
						},
					},
					{
						id: 'variant-6',
						params: {
							network: '/network/[network]:Network.Slug.6.network',
						},
					},
					{
						id: 'variant-7',
						params: {
							network: '/network/[network]:Network.Slug.7.network',
						},
					},
					{
						id: 'variant-8',
						params: {
							network: '/network/[network]:Network.Slug.8.network',
						},
					},
					{
						id: 'variant-9',
						params: {
							network: '/network/[network]:Network.Slug.9.network',
						},
					},
					{
						id: 'variant-10',
						params: {
							network: '/network/[network]:Network.Slug.10.network',
						},
					},
					{
						id: 'variant-11',
						params: {
							network: '/network/[network]:Network.Slug.11.network',
						},
					},
					{
						id: 'variant-12',
						params: {
							network: '/network/[network]:Network.Slug.12.network',
						},
					},
					{
						id: 'variant-13',
						params: {
							network: '/network/[network]:Network.Slug.13.network',
						},
					},
					{
						id: 'variant-14',
						params: {
							network: '/network/[network]:Network.Slug.14.network',
						},
					},
					{
						id: 'variant-15',
						params: {
							network: '/network/[network]:Network.Slug.15.network',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network/', requiredE2eRouteParam(params, '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/withdrawals', 'network'), '/withdrawals'].join(''),
	},
	'/(explore)/(protocols)/evm/(calldata)/calldata/[hex]': {
		nodeId: '/(explore)/(protocols)/evm/(calldata)/calldata/[hex]',
		probeOwnerNodeId: '/(explore)/(protocols)/evm/(calldata)/calldata/[hex]',
		routeId: '/(explore)/(protocols)/evm/(evmProtocol)/(calldata)/calldata/[hex=zeroExHex]',
		publicPath: '/evm/calldata/[hex]',
		parameterMatchers: {
			hex: [
				'zeroExHex',
			],
		},
		mappings: [
			{
				id: 'EvmCalldata.Hex',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							hex: '/evm/calldata/[hex]:EvmCalldata.Hex.1.hex',
						},
					},
				],
			},
		],
		resolve: (params) => ['/evm/calldata/', requiredE2eRouteParam(params, '/(explore)/(protocols)/evm/(evmProtocol)/(calldata)/calldata/[hex=zeroExHex]', 'hex')].join(''),
	},
	'/(explore)/(protocols)/evm/(errors)/error/[hex]': {
		nodeId: '/(explore)/(protocols)/evm/(errors)/error/[hex]',
		probeOwnerNodeId: '/(explore)/(protocols)/evm/(errors)/error/[hex]',
		routeId: '/(explore)/(protocols)/evm/(evmProtocol)/(errors)/error/[hex=zeroExHex]',
		publicPath: '/evm/error/[hex]',
		parameterMatchers: {
			hex: [
				'zeroExHex',
			],
		},
		mappings: [
			{
				id: 'EvmError.Hex',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							hex: '/evm/error/[hex]:EvmError.Hex.1.hex',
						},
					},
				],
			},
		],
		resolve: (params) => ['/evm/error/', requiredE2eRouteParam(params, '/(explore)/(protocols)/evm/(evmProtocol)/(errors)/error/[hex=zeroExHex]', 'hex')].join(''),
	},
	'/(explore)/(protocols)/evm/(errors)/error/[hex]/observations/[timestampMs]/[source]': {
		nodeId: '/(explore)/(protocols)/evm/(errors)/error/[hex]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/(protocols)/evm/(errors)/error/[hex]/observations/[timestampMs]/[source]',
		routeId: '/(explore)/(protocols)/evm/(evmProtocol)/(errors)/error/[hex=zeroExHex]/(evmError)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/evm/error/[hex]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			hex: [
				'zeroExHex',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'EvmError_Timestamp.ErrorTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							hex: '/evm/error/[hex]/observations/[timestampMs]/[source]:EvmError_Timestamp.ErrorTimestampMsSource.1.hex',
							timestampMs: '/evm/error/[hex]/observations/[timestampMs]/[source]:EvmError_Timestamp.ErrorTimestampMsSource.1.timestampMs',
							source: '/evm/error/[hex]/observations/[timestampMs]/[source]:EvmError_Timestamp.ErrorTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/evm/error/', requiredE2eRouteParam(params, '/(explore)/(protocols)/evm/(evmProtocol)/(errors)/error/[hex=zeroExHex]/(evmError)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'hex'), '/observations/', requiredE2eRouteParam(params, '/(explore)/(protocols)/evm/(evmProtocol)/(errors)/error/[hex=zeroExHex]/(evmError)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/(protocols)/evm/(evmProtocol)/(errors)/error/[hex=zeroExHex]/(evmError)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(protocols)/evm/(selectors)/selector/[hex]': {
		nodeId: '/(explore)/(protocols)/evm/(selectors)/selector/[hex]',
		probeOwnerNodeId: '/(explore)/(protocols)/evm/(selectors)/selector/[hex]',
		routeId: '/(explore)/(protocols)/evm/(evmProtocol)/(selectors)/selector/[hex=zeroExHex]',
		publicPath: '/evm/selector/[hex]',
		parameterMatchers: {
			hex: [
				'zeroExHex',
			],
		},
		mappings: [
			{
				id: 'EvmSelector.Hex',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							hex: '/evm/selector/[hex]:EvmSelector.Hex.1.hex',
						},
					},
				],
			},
		],
		resolve: (params) => ['/evm/selector/', requiredE2eRouteParam(params, '/(explore)/(protocols)/evm/(evmProtocol)/(selectors)/selector/[hex=zeroExHex]', 'hex')].join(''),
	},
	'/(explore)/(protocols)/evm/(selectors)/selector/[hex]/observations/[timestampMs]/[source]': {
		nodeId: '/(explore)/(protocols)/evm/(selectors)/selector/[hex]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/(protocols)/evm/(selectors)/selector/[hex]/observations/[timestampMs]/[source]',
		routeId: '/(explore)/(protocols)/evm/(evmProtocol)/(selectors)/selector/[hex=zeroExHex]/(evmSelector)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/evm/selector/[hex]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			hex: [
				'zeroExHex',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'EvmSelector_Timestamp.SelectorTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							hex: '/evm/selector/[hex]/observations/[timestampMs]/[source]:EvmSelector_Timestamp.SelectorTimestampMsSource.1.hex',
							timestampMs: '/evm/selector/[hex]/observations/[timestampMs]/[source]:EvmSelector_Timestamp.SelectorTimestampMsSource.1.timestampMs',
							source: '/evm/selector/[hex]/observations/[timestampMs]/[source]:EvmSelector_Timestamp.SelectorTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/evm/selector/', requiredE2eRouteParam(params, '/(explore)/(protocols)/evm/(evmProtocol)/(selectors)/selector/[hex=zeroExHex]/(evmSelector)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'hex'), '/observations/', requiredE2eRouteParam(params, '/(explore)/(protocols)/evm/(evmProtocol)/(selectors)/selector/[hex=zeroExHex]/(evmSelector)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/(protocols)/evm/(evmProtocol)/(selectors)/selector/[hex=zeroExHex]/(evmSelector)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/(protocols)/evm/(topics)/topic/[hex]': {
		nodeId: '/(explore)/(protocols)/evm/(topics)/topic/[hex]',
		probeOwnerNodeId: '/(explore)/(protocols)/evm/(topics)/topic/[hex]',
		routeId: '/(explore)/(protocols)/evm/(evmProtocol)/(topics)/topic/[hex=evmTopicHash]',
		publicPath: '/evm/topic/[hex]',
		parameterMatchers: {
			hex: [
				'evmTopicHash',
			],
		},
		mappings: [
			{
				id: 'EvmTopic.Hex',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							hex: '/evm/topic/[hex]:EvmTopic.Hex.1.hex',
						},
					},
				],
			},
		],
		resolve: (params) => ['/evm/topic/', requiredE2eRouteParam(params, '/(explore)/(protocols)/evm/(evmProtocol)/(topics)/topic/[hex=evmTopicHash]', 'hex')].join(''),
	},
	'/(explore)/(protocols)/evm/(topics)/topic/[hex]/observations/[timestampMs]/[source]': {
		nodeId: '/(explore)/(protocols)/evm/(topics)/topic/[hex]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/(protocols)/evm/(topics)/topic/[hex]/observations/[timestampMs]/[source]',
		routeId: '/(explore)/(protocols)/evm/(evmProtocol)/(topics)/topic/[hex=evmTopicHash]/(evmTopic)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/evm/topic/[hex]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			hex: [
				'evmTopicHash',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'EvmTopic_Timestamp.TopicTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							hex: '/evm/topic/[hex]/observations/[timestampMs]/[source]:EvmTopic_Timestamp.TopicTimestampMsSource.1.hex',
							timestampMs: '/evm/topic/[hex]/observations/[timestampMs]/[source]:EvmTopic_Timestamp.TopicTimestampMsSource.1.timestampMs',
							source: '/evm/topic/[hex]/observations/[timestampMs]/[source]:EvmTopic_Timestamp.TopicTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/evm/topic/', requiredE2eRouteParam(params, '/(explore)/(protocols)/evm/(evmProtocol)/(topics)/topic/[hex=evmTopicHash]/(evmTopic)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'hex'), '/observations/', requiredE2eRouteParam(params, '/(explore)/(protocols)/evm/(evmProtocol)/(topics)/topic/[hex=evmTopicHash]/(evmTopic)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/(protocols)/evm/(evmProtocol)/(topics)/topic/[hex=evmTopicHash]/(evmTopic)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(explore)/account/[address]': {
		nodeId: '/(explore)/account/[address]',
		probeOwnerNodeId: '/(explore)/account/[address]',
		routeId: '/(explore)/account/[address=evmAddress]',
		publicPath: '/account/[address]',
		parameterMatchers: {
			address: [
				'evmAddress',
			],
		},
		mappings: [
			{
				id: 'EvmAccount.Address',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							address: '/account/[address]:EvmAccount.Address.1.address',
						},
					},
				],
			},
		],
		resolve: (params) => ['/account/', requiredE2eRouteParam(params, '/(explore)/account/[address=evmAddress]', 'address')].join(''),
	},
	'/(explore)/media/[url]': {
		nodeId: '/(explore)/media/[url]',
		probeOwnerNodeId: '/(explore)/media/[url]',
		routeId: '/(explore)/media/[url=absoluteUrl]',
		publicPath: '/media/[url]',
		parameterMatchers: {
			url: [
				'absoluteUrl',
			],
		},
		mappings: [
			{
				id: 'Media.Url',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							url: '/media/[url]:Media.Url.1.url',
						},
					},
				],
			},
		],
		resolve: (params) => ['/media/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(explore)/media/[url=absoluteUrl]', 'url'), 'Opaque')].join(''),
	},
	'/(explore)/network-stack/[networkStackId]': {
		nodeId: '/(explore)/network-stack/[networkStackId]',
		probeOwnerNodeId: '/(explore)/network-stack/[networkStackId]',
		routeId: '/(explore)/network-stack/[networkStackId=stringSegment]',
		publicPath: '/network-stack/[networkStackId]',
		parameterMatchers: {
			networkStackId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'NetworkStack.NetworkStackId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							networkStackId: '/network-stack/[networkStackId]:NetworkStack.NetworkStackId.1.networkStackId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/network-stack/', requiredE2eRouteParam(params, '/(explore)/network-stack/[networkStackId=stringSegment]', 'networkStackId')].join(''),
	},
	'/(explore)/url/[url]': {
		nodeId: '/(explore)/url/[url]',
		probeOwnerNodeId: '/(explore)/url/[url]',
		routeId: '/(explore)/url/[url=absoluteUrl]',
		publicPath: '/url/[url]',
		parameterMatchers: {
			url: [
				'absoluteUrl',
			],
		},
		mappings: [
			{
				id: 'Url.Url',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							url: '/url/[url]:Url.Url.1.url',
						},
					},
				],
			},
		],
		resolve: (params) => ['/url/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(explore)/url/[url=absoluteUrl]', 'url'), 'Opaque')].join(''),
	},
	'/(explore)/url/[url]/observations/[timestampMs]/[source]': {
		nodeId: '/(explore)/url/[url]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(explore)/url/[url]/observations/[timestampMs]/[source]',
		routeId: '/(explore)/url/[url=absoluteUrl]/(url)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/url/[url]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			url: [
				'absoluteUrl',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'UrlPreview_Timestamp.UrlTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							url: '/url/[url]/observations/[timestampMs]/[source]:UrlPreview_Timestamp.UrlTimestampMsSource.1.url',
							timestampMs: '/url/[url]/observations/[timestampMs]/[source]:UrlPreview_Timestamp.UrlTimestampMsSource.1.timestampMs',
							source: '/url/[url]/observations/[timestampMs]/[source]:UrlPreview_Timestamp.UrlTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/url/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(explore)/url/[url=absoluteUrl]/(url)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'url'), 'Opaque'), '/observations/', requiredE2eRouteParam(params, '/(explore)/url/[url=absoluteUrl]/(url)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(explore)/url/[url=absoluteUrl]/(url)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(proposals)/proposals/[specificationRealmSlug]': {
		nodeId: '/(proposals)/proposals/[specificationRealmSlug]',
		probeOwnerNodeId: '/(proposals)/proposals/[specificationRealmSlug]',
		routeId: '/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]',
		publicPath: '/proposals/[specificationRealmSlug]',
		parameterMatchers: {
			specificationRealmSlug: [
				'specificationRealmSlug',
			],
		},
		mappings: [
			{
				id: 'SpecificationRealm.Realm',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							specificationRealmSlug: '/proposals/[specificationRealmSlug]:SpecificationRealm.Realm.1.specificationRealmSlug',
						},
					},
				],
			},
		],
		resolve: (params) => ['/proposals/', requiredE2eRouteParam(params, '/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]', 'specificationRealmSlug')].join(''),
	},
	'/(proposals)/proposals/[specificationRealmSlug]/[proposalKindSlug]': {
		nodeId: '/(proposals)/proposals/[specificationRealmSlug]/[proposalKindSlug]',
		probeOwnerNodeId: '/(proposals)/proposals/[specificationRealmSlug]/[proposalKindSlug]',
		routeId: '/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]',
		publicPath: '/proposals/[specificationRealmSlug]/[proposalKindSlug]',
		parameterMatchers: {
			specificationRealmSlug: [
				'specificationRealmSlug',
			],
			proposalKindSlug: [
				'proposalKindSlug',
			],
		},
		mappings: [
			{
				id: 'SpecificationProposalKind.RealmCategory',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							specificationRealmSlug: '/proposals/[specificationRealmSlug]/[proposalKindSlug]:SpecificationProposalKind.RealmCategory.1.specificationRealmSlug',
							proposalKindSlug: '/proposals/[specificationRealmSlug]/[proposalKindSlug]:SpecificationProposalKind.RealmCategory.1.proposalKindSlug',
						},
					},
				],
			},
		],
		resolve: (params) => ['/proposals/', requiredE2eRouteParam(params, '/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]', 'specificationRealmSlug'), '/', requiredE2eRouteParam(params, '/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]', 'proposalKindSlug')].join(''),
	},
	'/(proposals)/proposals/[specificationRealmSlug]/[proposalKindSlug]/[proposalRef]': {
		nodeId: '/(proposals)/proposals/[specificationRealmSlug]/[proposalKindSlug]/[proposalRef]',
		probeOwnerNodeId: '/(proposals)/proposals/[specificationRealmSlug]/[proposalKindSlug]/[proposalRef]',
		routeId: '/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(specificationProposalKind)/[proposalRef=proposalRef]',
		publicPath: '/proposals/[specificationRealmSlug]/[proposalKindSlug]/[proposalRef]',
		parameterMatchers: {
			specificationRealmSlug: [
				'specificationRealmSlug',
			],
			proposalKindSlug: [
				'proposalKindSlug',
			],
			proposalRef: [
				'proposalRef',
			],
		},
		mappings: [
			{
				id: 'SpecificationProposal.RealmCategoryNumber',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							specificationRealmSlug: '/proposals/[specificationRealmSlug]/[proposalKindSlug]/[proposalRef]:SpecificationProposal.RealmCategoryNumber.1.specificationRealmSlug',
							proposalKindSlug: '/proposals/[specificationRealmSlug]/[proposalKindSlug]/[proposalRef]:SpecificationProposal.RealmCategoryNumber.1.proposalKindSlug',
							proposalRef: '/proposals/[specificationRealmSlug]/[proposalKindSlug]/[proposalRef]:SpecificationProposal.RealmCategoryNumber.1.proposalRef',
						},
					},
				],
			},
		],
		resolve: (params) => ['/proposals/', requiredE2eRouteParam(params, '/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(specificationProposalKind)/[proposalRef=proposalRef]', 'specificationRealmSlug'), '/', requiredE2eRouteParam(params, '/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(specificationProposalKind)/[proposalRef=proposalRef]', 'proposalKindSlug'), '/', requiredE2eRouteParam(params, '/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(specificationProposalKind)/[proposalRef=proposalRef]', 'proposalRef')].join(''),
	},
	'/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]': {
		nodeId: '/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]',
		probeOwnerNodeId: '/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]',
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]',
		publicPath: '/activitypub/actor/[instanceOrigin]/[localAccountId]',
		parameterMatchers: {
			instanceOrigin: [
				'absoluteUrl',
			],
			localAccountId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'ActivityPubActor.LocalAccountId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							instanceOrigin: '/activitypub/actor/[instanceOrigin]/[localAccountId]:ActivityPubActor.LocalAccountId.1.instanceOrigin',
							localAccountId: '/activitypub/actor/[instanceOrigin]/[localAccountId]:ActivityPubActor.LocalAccountId.1.localAccountId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/activitypub/actor/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]', 'instanceOrigin'), 'Opaque'), '/', requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]', 'localAccountId')].join(''),
	},
	'/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]/notes': {
		nodeId: '/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]/notes',
		probeOwnerNodeId: '/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]',
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/(activityPubActor)/notes',
		publicPath: '/activitypub/actor/[instanceOrigin]/[localAccountId]/notes',
		parameterMatchers: {
			instanceOrigin: [
				'absoluteUrl',
			],
			localAccountId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'ActivityPubActor.LocalAccountId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							instanceOrigin: '/activitypub/actor/[instanceOrigin]/[localAccountId]:ActivityPubActor.LocalAccountId.1.instanceOrigin',
							localAccountId: '/activitypub/actor/[instanceOrigin]/[localAccountId]:ActivityPubActor.LocalAccountId.1.localAccountId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/activitypub/actor/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/(activityPubActor)/notes', 'instanceOrigin'), 'Opaque'), '/', requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/(activityPubActor)/notes', 'localAccountId'), '/notes'].join(''),
	},
	'/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]/observations/[timestampMs]/[source]': {
		nodeId: '/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]/observations/[timestampMs]/[source]',
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/(activityPubActor)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/activitypub/actor/[instanceOrigin]/[localAccountId]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			instanceOrigin: [
				'absoluteUrl',
			],
			localAccountId: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'ActivityPubActor_Timestamp.ActivityPubActorTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							instanceOrigin: '/activitypub/actor/[instanceOrigin]/[localAccountId]/observations/[timestampMs]/[source]:ActivityPubActor_Timestamp.ActivityPubActorTimestampMsSource.1.instanceOrigin',
							localAccountId: '/activitypub/actor/[instanceOrigin]/[localAccountId]/observations/[timestampMs]/[source]:ActivityPubActor_Timestamp.ActivityPubActorTimestampMsSource.1.localAccountId',
							timestampMs: '/activitypub/actor/[instanceOrigin]/[localAccountId]/observations/[timestampMs]/[source]:ActivityPubActor_Timestamp.ActivityPubActorTimestampMsSource.1.timestampMs',
							source: '/activitypub/actor/[instanceOrigin]/[localAccountId]/observations/[timestampMs]/[source]:ActivityPubActor_Timestamp.ActivityPubActorTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/activitypub/actor/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/(activityPubActor)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'instanceOrigin'), 'Opaque'), '/', requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/(activityPubActor)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'localAccountId'), '/observations/', requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/(activityPubActor)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/(activityPubActor)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(social)/(activitypub)/activitypub/instance/[instanceOrigin]': {
		nodeId: '/(social)/(activitypub)/activitypub/instance/[instanceOrigin]',
		probeOwnerNodeId: '/(social)/(activitypub)/activitypub/instance/[instanceOrigin]',
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]',
		publicPath: '/activitypub/instance/[instanceOrigin]',
		parameterMatchers: {
			instanceOrigin: [
				'absoluteUrl',
			],
		},
		mappings: [
			{
				id: 'ActivityPubInstance.InstanceOrigin',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							instanceOrigin: '/activitypub/instance/[instanceOrigin]:ActivityPubInstance.InstanceOrigin.1.instanceOrigin',
						},
					},
				],
			},
		],
		resolve: (params) => ['/activitypub/instance/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]', 'instanceOrigin'), 'Opaque')].join(''),
	},
	'/(social)/(activitypub)/activitypub/instance/[instanceOrigin]/observations/[timestampMs]/[source]': {
		nodeId: '/(social)/(activitypub)/activitypub/instance/[instanceOrigin]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(social)/(activitypub)/activitypub/instance/[instanceOrigin]/observations/[timestampMs]/[source]',
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]/(activityPubInstance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/activitypub/instance/[instanceOrigin]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			instanceOrigin: [
				'absoluteUrl',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'ActivityPubInstance_Timestamp.InstanceTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							instanceOrigin: '/activitypub/instance/[instanceOrigin]/observations/[timestampMs]/[source]:ActivityPubInstance_Timestamp.InstanceTimestampMsSource.1.instanceOrigin',
							timestampMs: '/activitypub/instance/[instanceOrigin]/observations/[timestampMs]/[source]:ActivityPubInstance_Timestamp.InstanceTimestampMsSource.1.timestampMs',
							source: '/activitypub/instance/[instanceOrigin]/observations/[timestampMs]/[source]:ActivityPubInstance_Timestamp.InstanceTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/activitypub/instance/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]/(activityPubInstance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'instanceOrigin'), 'Opaque'), '/observations/', requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]/(activityPubInstance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]/(activityPubInstance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]': {
		nodeId: '/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]',
		probeOwnerNodeId: '/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]',
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]',
		publicPath: '/activitypub/note/[instanceOrigin]/[localStatusId]',
		parameterMatchers: {
			instanceOrigin: [
				'absoluteUrl',
			],
			localStatusId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'ActivityPubNote.InstanceOriginLocalStatusId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							instanceOrigin: '/activitypub/note/[instanceOrigin]/[localStatusId]:ActivityPubNote.InstanceOriginLocalStatusId.1.instanceOrigin',
							localStatusId: '/activitypub/note/[instanceOrigin]/[localStatusId]:ActivityPubNote.InstanceOriginLocalStatusId.1.localStatusId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/activitypub/note/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]', 'instanceOrigin'), 'Opaque'), '/', requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]', 'localStatusId')].join(''),
	},
	'/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]/observations/[timestampMs]/[source]': {
		nodeId: '/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]/observations/[timestampMs]/[source]',
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/(activityPubNote)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/activitypub/note/[instanceOrigin]/[localStatusId]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			instanceOrigin: [
				'absoluteUrl',
			],
			localStatusId: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'ActivityPubNote_Timestamp.ActivityPubNoteTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							instanceOrigin: '/activitypub/note/[instanceOrigin]/[localStatusId]/observations/[timestampMs]/[source]:ActivityPubNote_Timestamp.ActivityPubNoteTimestampMsSource.1.instanceOrigin',
							localStatusId: '/activitypub/note/[instanceOrigin]/[localStatusId]/observations/[timestampMs]/[source]:ActivityPubNote_Timestamp.ActivityPubNoteTimestampMsSource.1.localStatusId',
							timestampMs: '/activitypub/note/[instanceOrigin]/[localStatusId]/observations/[timestampMs]/[source]:ActivityPubNote_Timestamp.ActivityPubNoteTimestampMsSource.1.timestampMs',
							source: '/activitypub/note/[instanceOrigin]/[localStatusId]/observations/[timestampMs]/[source]:ActivityPubNote_Timestamp.ActivityPubNoteTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/activitypub/note/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/(activityPubNote)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'instanceOrigin'), 'Opaque'), '/', requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/(activityPubNote)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'localStatusId'), '/observations/', requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/(activityPubNote)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/(activityPubNote)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]/thread': {
		nodeId: '/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]/thread',
		probeOwnerNodeId: '/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]',
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/(activityPubNote)/thread',
		publicPath: '/activitypub/note/[instanceOrigin]/[localStatusId]/thread',
		parameterMatchers: {
			instanceOrigin: [
				'absoluteUrl',
			],
			localStatusId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'ActivityPubNote.InstanceOriginLocalStatusId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							instanceOrigin: '/activitypub/note/[instanceOrigin]/[localStatusId]:ActivityPubNote.InstanceOriginLocalStatusId.1.instanceOrigin',
							localStatusId: '/activitypub/note/[instanceOrigin]/[localStatusId]:ActivityPubNote.InstanceOriginLocalStatusId.1.localStatusId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/activitypub/note/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/(activityPubNote)/thread', 'instanceOrigin'), 'Opaque'), '/', requiredE2eRouteParam(params, '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/(activityPubNote)/thread', 'localStatusId'), '/thread'].join(''),
	},
	'/(social)/(atproto)/atproto/actor/[did]': {
		nodeId: '/(social)/(atproto)/atproto/actor/[did]',
		probeOwnerNodeId: '/(social)/(atproto)/atproto/actor/[did]',
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]',
		publicPath: '/atproto/actor/[did]',
		parameterMatchers: {
			did: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'AtprotoActor.Did',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							did: '/atproto/actor/[did]:AtprotoActor.Did.1.did',
						},
					},
				],
			},
		],
		resolve: (params) => ['/atproto/actor/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]', 'did'), 'Opaque')].join(''),
	},
	'/(social)/(atproto)/atproto/actor/[did]/observations': {
		nodeId: '/(social)/(atproto)/atproto/actor/[did]/observations',
		probeOwnerNodeId: '/(social)/(atproto)/atproto/actor/[did]',
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/observations',
		publicPath: '/atproto/actor/[did]/observations',
		parameterMatchers: {
			did: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'AtprotoActor.Did',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							did: '/atproto/actor/[did]:AtprotoActor.Did.1.did',
						},
					},
				],
			},
		],
		resolve: (params) => ['/atproto/actor/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/observations', 'did'), 'Opaque'), '/observations'].join(''),
	},
	'/(social)/(atproto)/atproto/actor/[did]/observations/[timestampMs]/[source]': {
		nodeId: '/(social)/(atproto)/atproto/actor/[did]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(social)/(atproto)/atproto/actor/[did]/observations/[timestampMs]/[source]',
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/atproto/actor/[did]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			did: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'AtprotoActor_Timestamp.AtprotoActorTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							did: '/atproto/actor/[did]/observations/[timestampMs]/[source]:AtprotoActor_Timestamp.AtprotoActorTimestampMsSource.1.did',
							timestampMs: '/atproto/actor/[did]/observations/[timestampMs]/[source]:AtprotoActor_Timestamp.AtprotoActorTimestampMsSource.1.timestampMs',
							source: '/atproto/actor/[did]/observations/[timestampMs]/[source]:AtprotoActor_Timestamp.AtprotoActorTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/atproto/actor/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'did'), 'Opaque'), '/observations/', requiredE2eRouteParam(params, '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(social)/(atproto)/atproto/actor/[did]/posts': {
		nodeId: '/(social)/(atproto)/atproto/actor/[did]/posts',
		probeOwnerNodeId: '/(social)/(atproto)/atproto/actor/[did]',
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/posts',
		publicPath: '/atproto/actor/[did]/posts',
		parameterMatchers: {
			did: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'AtprotoActor.Did',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							did: '/atproto/actor/[did]:AtprotoActor.Did.1.did',
						},
					},
				],
			},
		],
		resolve: (params) => ['/atproto/actor/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/posts', 'did'), 'Opaque'), '/posts'].join(''),
	},
	'/(social)/(atproto)/atproto/actor/handle/[handle]': {
		nodeId: '/(social)/(atproto)/atproto/actor/handle/[handle]',
		probeOwnerNodeId: '/(social)/(atproto)/atproto/actor/handle/[handle]',
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/handle/[handle=stringSegment]',
		publicPath: '/atproto/actor/handle/[handle]',
		parameterMatchers: {
			handle: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'AtprotoActor.Handle',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							handle: '/atproto/actor/handle/[handle]:AtprotoActor.Handle.1.handle',
						},
					},
				],
			},
		],
		resolve: (params) => ['/atproto/actor/handle/', requiredE2eRouteParam(params, '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/handle/[handle=stringSegment]', 'handle')].join(''),
	},
	'/(social)/(atproto)/atproto/post/[...uri]': {
		nodeId: '/(social)/(atproto)/atproto/post/[...uri]',
		probeOwnerNodeId: '/(social)/(atproto)/atproto/post/[...uri]',
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]',
		publicPath: '/atproto/post/[...uri]',
		parameterMatchers: {
			uri: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'AtprotoPost.Uri',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							uri: '/atproto/post/[...uri]:AtprotoPost.Uri.1.uri',
						},
					},
				],
			},
		],
		resolve: (params) => ['/atproto/post/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]', 'uri'), 'Opaque')].join(''),
	},
	'/(social)/(atproto)/atproto/post/[...uri]/observations': {
		nodeId: '/(social)/(atproto)/atproto/post/[...uri]/observations',
		probeOwnerNodeId: '/(social)/(atproto)/atproto/post/[...uri]',
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]/(atprotoPost)/observations',
		publicPath: '/atproto/post/[...uri]/observations',
		parameterMatchers: {
			uri: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'AtprotoPost.Uri',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							uri: '/atproto/post/[...uri]:AtprotoPost.Uri.1.uri',
						},
					},
				],
			},
		],
		resolve: (params) => ['/atproto/post/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]/(atprotoPost)/observations', 'uri'), 'Opaque'), '/observations'].join(''),
	},
	'/(social)/(atproto)/atproto/post/[...uri]/observations/[timestampMs]': {
		nodeId: '/(social)/(atproto)/atproto/post/[...uri]/observations/[timestampMs]',
		probeOwnerNodeId: '/(social)/(atproto)/atproto/post/[...uri]/observations/[timestampMs]',
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]/(atprotoPost)/observations/[timestampMs=nonNegativeInteger]',
		publicPath: '/atproto/post/[...uri]/observations/[timestampMs]',
		parameterMatchers: {
			uri: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'AtprotoPost_Timestamp.AtprotoPostTimestampMs',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							uri: '/atproto/post/[...uri]/observations/[timestampMs]:AtprotoPost_Timestamp.AtprotoPostTimestampMs.1.uri',
							timestampMs: '/atproto/post/[...uri]/observations/[timestampMs]:AtprotoPost_Timestamp.AtprotoPostTimestampMs.1.timestampMs',
						},
					},
				],
			},
		],
		resolve: (params) => ['/atproto/post/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]/(atprotoPost)/observations/[timestampMs=nonNegativeInteger]', 'uri'), 'Opaque'), '/observations/', requiredE2eRouteParam(params, '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]/(atprotoPost)/observations/[timestampMs=nonNegativeInteger]', 'timestampMs')].join(''),
	},
	'/(social)/(atproto)/atproto/post/[...uri]/thread': {
		nodeId: '/(social)/(atproto)/atproto/post/[...uri]/thread',
		probeOwnerNodeId: '/(social)/(atproto)/atproto/post/[...uri]',
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]/(atprotoPost)/thread',
		publicPath: '/atproto/post/[...uri]/thread',
		parameterMatchers: {
			uri: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'AtprotoPost.Uri',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							uri: '/atproto/post/[...uri]:AtprotoPost.Uri.1.uri',
						},
					},
				],
			},
		],
		resolve: (params) => ['/atproto/post/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]/(atprotoPost)/thread', 'uri'), 'Opaque'), '/thread'].join(''),
	},
	'/(social)/(farcaster)/farcaster/account/[connectionId]': {
		nodeId: '/(social)/(farcaster)/farcaster/account/[connectionId]',
		probeOwnerNodeId: '/(social)/(farcaster)/farcaster/account/[connectionId]',
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/account/[connectionId=stringSegment]',
		publicPath: '/farcaster/account/[connectionId]',
		parameterMatchers: {
			connectionId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'BlockheadFarcasterAccountConnection.ConnectionId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							connectionId: '/farcaster/account/[connectionId]:BlockheadFarcasterAccountConnection.ConnectionId.1.connectionId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/farcaster/account/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/account/[connectionId=stringSegment]', 'connectionId')].join(''),
	},
	'/(social)/(farcaster)/farcaster/c/[fname]/[hash]': {
		nodeId: '/(social)/(farcaster)/farcaster/c/[fname]/[hash]',
		probeOwnerNodeId: '/(social)/(farcaster)/farcaster/c/[fname]/[hash]',
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/c/[fname=stringSegment]/[hash=zeroExHex]',
		publicPath: '/farcaster/c/[fname]/[hash]',
		parameterMatchers: {
			fname: [
				'stringSegment',
			],
			hash: [
				'zeroExHex',
			],
		},
		mappings: [
			{
				id: 'FarcasterCast.UsernameHashPrefix',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							fname: '/farcaster/c/[fname]/[hash]:FarcasterCast.UsernameHashPrefix.1.fname',
							hash: '/farcaster/c/[fname]/[hash]:FarcasterCast.UsernameHashPrefix.1.hash',
						},
					},
				],
			},
		],
		resolve: (params) => ['/farcaster/c/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/c/[fname=stringSegment]/[hash=zeroExHex]', 'fname'), '/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/c/[fname=stringSegment]/[hash=zeroExHex]', 'hash')].join(''),
	},
	'/(social)/(farcaster)/farcaster/cast/[fid]/[hash]': {
		nodeId: '/(social)/(farcaster)/farcaster/cast/[fid]/[hash]',
		probeOwnerNodeId: '/(social)/(farcaster)/farcaster/cast/[fid]/[hash]',
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]',
		publicPath: '/farcaster/cast/[fid]/[hash]',
		parameterMatchers: {
			fid: [
				'farcasterFid',
			],
			hash: [
				'zeroExHex',
			],
		},
		mappings: [
			{
				id: 'FarcasterCast.FidHash',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							fid: '/farcaster/cast/[fid]/[hash]:FarcasterCast.FidHash.1.fid',
							hash: '/farcaster/cast/[fid]/[hash]:FarcasterCast.FidHash.1.hash',
						},
					},
				],
			},
		],
		resolve: (params) => ['/farcaster/cast/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]', 'fid'), '/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]', 'hash')].join(''),
	},
	'/(social)/(farcaster)/farcaster/cast/[fid]/[hash]/embed/[indexInCast]': {
		nodeId: '/(social)/(farcaster)/farcaster/cast/[fid]/[hash]/embed/[indexInCast]',
		probeOwnerNodeId: '/(social)/(farcaster)/farcaster/cast/[fid]/[hash]/embed/[indexInCast]',
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]/(farcasterCast)/embed/[indexInCast=nonNegativeInteger]',
		publicPath: '/farcaster/cast/[fid]/[hash]/embed/[indexInCast]',
		parameterMatchers: {
			fid: [
				'farcasterFid',
			],
			hash: [
				'zeroExHex',
			],
			indexInCast: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'FarcasterCastEmbed.CastIndexInCast',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							fid: '/farcaster/cast/[fid]/[hash]/embed/[indexInCast]:FarcasterCastEmbed.CastIndexInCast.1.fid',
							hash: '/farcaster/cast/[fid]/[hash]/embed/[indexInCast]:FarcasterCastEmbed.CastIndexInCast.1.hash',
							indexInCast: '/farcaster/cast/[fid]/[hash]/embed/[indexInCast]:FarcasterCastEmbed.CastIndexInCast.1.indexInCast',
						},
					},
				],
			},
		],
		resolve: (params) => ['/farcaster/cast/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]/(farcasterCast)/embed/[indexInCast=nonNegativeInteger]', 'fid'), '/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]/(farcasterCast)/embed/[indexInCast=nonNegativeInteger]', 'hash'), '/embed/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]/(farcasterCast)/embed/[indexInCast=nonNegativeInteger]', 'indexInCast')].join(''),
	},
	'/(social)/(farcaster)/farcaster/cast/[fid]/[hash]/observations/[timestampMs]': {
		nodeId: '/(social)/(farcaster)/farcaster/cast/[fid]/[hash]/observations/[timestampMs]',
		probeOwnerNodeId: '/(social)/(farcaster)/farcaster/cast/[fid]/[hash]/observations/[timestampMs]',
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]/(farcasterCast)/observations/[timestampMs=nonNegativeInteger]',
		publicPath: '/farcaster/cast/[fid]/[hash]/observations/[timestampMs]',
		parameterMatchers: {
			fid: [
				'farcasterFid',
			],
			hash: [
				'zeroExHex',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'FarcasterCast_Timestamp.FarcasterCastTimestampMs',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							fid: '/farcaster/cast/[fid]/[hash]/observations/[timestampMs]:FarcasterCast_Timestamp.FarcasterCastTimestampMs.1.fid',
							hash: '/farcaster/cast/[fid]/[hash]/observations/[timestampMs]:FarcasterCast_Timestamp.FarcasterCastTimestampMs.1.hash',
							timestampMs: '/farcaster/cast/[fid]/[hash]/observations/[timestampMs]:FarcasterCast_Timestamp.FarcasterCastTimestampMs.1.timestampMs',
						},
					},
				],
			},
		],
		resolve: (params) => ['/farcaster/cast/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]/(farcasterCast)/observations/[timestampMs=nonNegativeInteger]', 'fid'), '/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]/(farcasterCast)/observations/[timestampMs=nonNegativeInteger]', 'hash'), '/observations/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]/(farcasterCast)/observations/[timestampMs=nonNegativeInteger]', 'timestampMs')].join(''),
	},
	'/(social)/(farcaster)/farcaster/channel/[channelId]': {
		nodeId: '/(social)/(farcaster)/farcaster/channel/[channelId]',
		probeOwnerNodeId: '/(social)/(farcaster)/farcaster/channel/[channelId]',
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]',
		publicPath: '/farcaster/channel/[channelId]',
		parameterMatchers: {
			channelId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'FarcasterChannel.Id',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							channelId: '/farcaster/channel/[channelId]:FarcasterChannel.Id.1.channelId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/farcaster/channel/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]', 'channelId')].join(''),
	},
	'/(social)/(farcaster)/farcaster/channel/[channelId]/casts': {
		nodeId: '/(social)/(farcaster)/farcaster/channel/[channelId]/casts',
		probeOwnerNodeId: '/(social)/(farcaster)/farcaster/channel/[channelId]',
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]/(farcasterChannel)/casts',
		publicPath: '/farcaster/channel/[channelId]/casts',
		parameterMatchers: {
			channelId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'FarcasterChannel.Id',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							channelId: '/farcaster/channel/[channelId]:FarcasterChannel.Id.1.channelId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/farcaster/channel/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]/(farcasterChannel)/casts', 'channelId'), '/casts'].join(''),
	},
	'/(social)/(farcaster)/farcaster/channel/[channelId]/observations/[timestampMs]': {
		nodeId: '/(social)/(farcaster)/farcaster/channel/[channelId]/observations/[timestampMs]',
		probeOwnerNodeId: '/(social)/(farcaster)/farcaster/channel/[channelId]/observations/[timestampMs]',
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]/(farcasterChannel)/observations/[timestampMs=nonNegativeInteger]',
		publicPath: '/farcaster/channel/[channelId]/observations/[timestampMs]',
		parameterMatchers: {
			channelId: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'FarcasterChannel_Timestamp.FarcasterChannelTimestampMs',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							channelId: '/farcaster/channel/[channelId]/observations/[timestampMs]:FarcasterChannel_Timestamp.FarcasterChannelTimestampMs.1.channelId',
							timestampMs: '/farcaster/channel/[channelId]/observations/[timestampMs]:FarcasterChannel_Timestamp.FarcasterChannelTimestampMs.1.timestampMs',
						},
					},
				],
			},
		],
		resolve: (params) => ['/farcaster/channel/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]/(farcasterChannel)/observations/[timestampMs=nonNegativeInteger]', 'channelId'), '/observations/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]/(farcasterChannel)/observations/[timestampMs=nonNegativeInteger]', 'timestampMs')].join(''),
	},
	'/(social)/(farcaster)/farcaster/feed/channel/[channelId]': {
		nodeId: '/(social)/(farcaster)/farcaster/feed/channel/[channelId]',
		probeOwnerNodeId: '/(social)/(farcaster)/farcaster/feed/channel/[channelId]',
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/channel/[channelId=stringSegment]',
		publicPath: '/farcaster/feed/channel/[channelId]',
		parameterMatchers: {
			channelId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'FarcasterFeed.ByChannel',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							channelId: '/farcaster/feed/channel/[channelId]:FarcasterFeed.ByChannel.1.channelId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/farcaster/feed/channel/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/channel/[channelId=stringSegment]', 'channelId')].join(''),
	},
	'/(social)/(farcaster)/farcaster/feed/following/[userId]': {
		nodeId: '/(social)/(farcaster)/farcaster/feed/following/[userId]',
		probeOwnerNodeId: '/(social)/(farcaster)/farcaster/feed/following/[userId]',
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/following/[userId=farcasterFid]',
		publicPath: '/farcaster/feed/following/[userId]',
		parameterMatchers: {
			userId: [
				'farcasterFid',
			],
		},
		mappings: [
			{
				id: 'FarcasterFeed.Following',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							userId: '/farcaster/feed/following/[userId]:FarcasterFeed.Following.1.userId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/farcaster/feed/following/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/following/[userId=farcasterFid]', 'userId')].join(''),
	},
	'/(social)/(farcaster)/farcaster/feed/user/[userId]': {
		nodeId: '/(social)/(farcaster)/farcaster/feed/user/[userId]',
		probeOwnerNodeId: '/(social)/(farcaster)/farcaster/feed/user/[userId]',
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/user/[userId=farcasterFid]',
		publicPath: '/farcaster/feed/user/[userId]',
		parameterMatchers: {
			userId: [
				'farcasterFid',
			],
		},
		mappings: [
			{
				id: 'FarcasterFeed.ByUser',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							userId: '/farcaster/feed/user/[userId]:FarcasterFeed.ByUser.1.userId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/farcaster/feed/user/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/user/[userId=farcasterFid]', 'userId')].join(''),
	},
	'/(social)/(farcaster)/farcaster/user/[userId]': {
		nodeId: '/(social)/(farcaster)/farcaster/user/[userId]',
		probeOwnerNodeId: '/(social)/(farcaster)/farcaster/user/[userId]',
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]',
		publicPath: '/farcaster/user/[userId]',
		parameterMatchers: {
			userId: [
				'farcasterFid',
			],
		},
		mappings: [
			{
				id: 'FarcasterUser.Fid',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							userId: '/farcaster/user/[userId]:FarcasterUser.Fid.1.userId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/farcaster/user/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]', 'userId')].join(''),
	},
	'/(social)/(farcaster)/farcaster/user/[userId]/casts': {
		nodeId: '/(social)/(farcaster)/farcaster/user/[userId]/casts',
		probeOwnerNodeId: '/(social)/(farcaster)/farcaster/user/[userId]',
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]/(farcasterUser)/casts',
		publicPath: '/farcaster/user/[userId]/casts',
		parameterMatchers: {
			userId: [
				'farcasterFid',
			],
		},
		mappings: [
			{
				id: 'FarcasterUser.Fid',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							userId: '/farcaster/user/[userId]:FarcasterUser.Fid.1.userId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/farcaster/user/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]/(farcasterUser)/casts', 'userId'), '/casts'].join(''),
	},
	'/(social)/(farcaster)/farcaster/user/[userId]/observations/[timestampMs]': {
		nodeId: '/(social)/(farcaster)/farcaster/user/[userId]/observations/[timestampMs]',
		probeOwnerNodeId: '/(social)/(farcaster)/farcaster/user/[userId]/observations/[timestampMs]',
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]/(farcasterUser)/observations/[timestampMs=nonNegativeInteger]',
		publicPath: '/farcaster/user/[userId]/observations/[timestampMs]',
		parameterMatchers: {
			userId: [
				'farcasterFid',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'FarcasterUser_Timestamp.FarcasterUserTimestampMs',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							userId: '/farcaster/user/[userId]/observations/[timestampMs]:FarcasterUser_Timestamp.FarcasterUserTimestampMs.1.userId',
							timestampMs: '/farcaster/user/[userId]/observations/[timestampMs]:FarcasterUser_Timestamp.FarcasterUserTimestampMs.1.timestampMs',
						},
					},
				],
			},
		],
		resolve: (params) => ['/farcaster/user/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]/(farcasterUser)/observations/[timestampMs=nonNegativeInteger]', 'userId'), '/observations/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]/(farcasterUser)/observations/[timestampMs=nonNegativeInteger]', 'timestampMs')].join(''),
	},
	'/(social)/(farcaster)/farcaster/user/[userId]/verified-address/[protocol]/[address]': {
		nodeId: '/(social)/(farcaster)/farcaster/user/[userId]/verified-address/[protocol]/[address]',
		probeOwnerNodeId: '/(social)/(farcaster)/farcaster/user/[userId]/verified-address/[protocol]/[address]',
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]/(farcasterUser)/verified-address/[protocol=stringSegment]/[address=stringSegment]',
		publicPath: '/farcaster/user/[userId]/verified-address/[protocol]/[address]',
		parameterMatchers: {
			userId: [
				'farcasterFid',
			],
			protocol: [
				'stringSegment',
			],
			address: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'FarcasterVerifiedAddress.FidProtocolAddress',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							userId: '/farcaster/user/[userId]/verified-address/[protocol]/[address]:FarcasterVerifiedAddress.FidProtocolAddress.1.userId',
							protocol: '/farcaster/user/[userId]/verified-address/[protocol]/[address]:FarcasterVerifiedAddress.FidProtocolAddress.1.protocol',
							address: '/farcaster/user/[userId]/verified-address/[protocol]/[address]:FarcasterVerifiedAddress.FidProtocolAddress.1.address',
						},
					},
				],
			},
		],
		resolve: (params) => ['/farcaster/user/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]/(farcasterUser)/verified-address/[protocol=stringSegment]/[address=stringSegment]', 'userId'), '/verified-address/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]/(farcasterUser)/verified-address/[protocol=stringSegment]/[address=stringSegment]', 'protocol'), '/', requiredE2eRouteParam(params, '/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]/(farcasterUser)/verified-address/[protocol=stringSegment]/[address=stringSegment]', 'address')].join(''),
	},
	'/(social)/(lens)/lens/account/[address]': {
		nodeId: '/(social)/(lens)/lens/account/[address]',
		probeOwnerNodeId: '/(social)/(lens)/lens/account/[address]',
		routeId: '/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]',
		publicPath: '/lens/account/[address]',
		parameterMatchers: {
			address: [
				'evmAddress',
			],
		},
		mappings: [
			{
				id: 'LensAccount.Address',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							address: '/lens/account/[address]:LensAccount.Address.1.address',
						},
					},
				],
			},
		],
		resolve: (params) => ['/lens/account/', requiredE2eRouteParam(params, '/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]', 'address')].join(''),
	},
	'/(social)/(lens)/lens/account/[address]/observations/[timestampMs]': {
		nodeId: '/(social)/(lens)/lens/account/[address]/observations/[timestampMs]',
		probeOwnerNodeId: '/(social)/(lens)/lens/account/[address]/observations/[timestampMs]',
		routeId: '/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]/(lensAccount)/observations/[timestampMs=nonNegativeInteger]',
		publicPath: '/lens/account/[address]/observations/[timestampMs]',
		parameterMatchers: {
			address: [
				'evmAddress',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'LensAccount_Timestamp.LensAccountTimestampMs',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							address: '/lens/account/[address]/observations/[timestampMs]:LensAccount_Timestamp.LensAccountTimestampMs.1.address',
							timestampMs: '/lens/account/[address]/observations/[timestampMs]:LensAccount_Timestamp.LensAccountTimestampMs.1.timestampMs',
						},
					},
				],
			},
		],
		resolve: (params) => ['/lens/account/', requiredE2eRouteParam(params, '/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]/(lensAccount)/observations/[timestampMs=nonNegativeInteger]', 'address'), '/observations/', requiredE2eRouteParam(params, '/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]/(lensAccount)/observations/[timestampMs=nonNegativeInteger]', 'timestampMs')].join(''),
	},
	'/(social)/(lens)/lens/account/[address]/posts': {
		nodeId: '/(social)/(lens)/lens/account/[address]/posts',
		probeOwnerNodeId: '/(social)/(lens)/lens/account/[address]',
		routeId: '/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]/(lensAccount)/posts',
		publicPath: '/lens/account/[address]/posts',
		parameterMatchers: {
			address: [
				'evmAddress',
			],
		},
		mappings: [
			{
				id: 'LensAccount.Address',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							address: '/lens/account/[address]:LensAccount.Address.1.address',
						},
					},
				],
			},
		],
		resolve: (params) => ['/lens/account/', requiredE2eRouteParam(params, '/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]/(lensAccount)/posts', 'address'), '/posts'].join(''),
	},
	'/(social)/(lens)/lens/post/[postId]': {
		nodeId: '/(social)/(lens)/lens/post/[postId]',
		probeOwnerNodeId: '/(social)/(lens)/lens/post/[postId]',
		routeId: '/(social)/(lens)/lens/(lensNetwork)/post/[postId=stringSegment]',
		publicPath: '/lens/post/[postId]',
		parameterMatchers: {
			postId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'LensPost.Id',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							postId: '/lens/post/[postId]:LensPost.Id.1.postId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/lens/post/', requiredE2eRouteParam(params, '/(social)/(lens)/lens/(lensNetwork)/post/[postId=stringSegment]', 'postId')].join(''),
	},
	'/(social)/(lens)/lens/post/[postId]/comments': {
		nodeId: '/(social)/(lens)/lens/post/[postId]/comments',
		probeOwnerNodeId: '/(social)/(lens)/lens/post/[postId]',
		routeId: '/(social)/(lens)/lens/(lensNetwork)/post/[postId=stringSegment]/(lensPost)/comments',
		publicPath: '/lens/post/[postId]/comments',
		parameterMatchers: {
			postId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'LensPost.Id',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							postId: '/lens/post/[postId]:LensPost.Id.1.postId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/lens/post/', requiredE2eRouteParam(params, '/(social)/(lens)/lens/(lensNetwork)/post/[postId=stringSegment]/(lensPost)/comments', 'postId'), '/comments'].join(''),
	},
	'/(social)/(lens)/lens/post/[postId]/observations/[timestampMs]': {
		nodeId: '/(social)/(lens)/lens/post/[postId]/observations/[timestampMs]',
		probeOwnerNodeId: '/(social)/(lens)/lens/post/[postId]/observations/[timestampMs]',
		routeId: '/(social)/(lens)/lens/(lensNetwork)/post/[postId=stringSegment]/(lensPost)/observations/[timestampMs=nonNegativeInteger]',
		publicPath: '/lens/post/[postId]/observations/[timestampMs]',
		parameterMatchers: {
			postId: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'LensPost_Timestamp.LensPostTimestampMs',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							postId: '/lens/post/[postId]/observations/[timestampMs]:LensPost_Timestamp.LensPostTimestampMs.1.postId',
							timestampMs: '/lens/post/[postId]/observations/[timestampMs]:LensPost_Timestamp.LensPostTimestampMs.1.timestampMs',
						},
					},
				],
			},
		],
		resolve: (params) => ['/lens/post/', requiredE2eRouteParam(params, '/(social)/(lens)/lens/(lensNetwork)/post/[postId=stringSegment]/(lensPost)/observations/[timestampMs=nonNegativeInteger]', 'postId'), '/observations/', requiredE2eRouteParam(params, '/(social)/(lens)/lens/(lensNetwork)/post/[postId=stringSegment]/(lensPost)/observations/[timestampMs=nonNegativeInteger]', 'timestampMs')].join(''),
	},
	'/(social)/(nostr)/nostr/article-version/[eventId]': {
		nodeId: '/(social)/(nostr)/nostr/article-version/[eventId]',
		probeOwnerNodeId: '/(social)/(nostr)/nostr/article-version/[eventId]',
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/article-version/[eventId=stringSegment]',
		publicPath: '/nostr/article-version/[eventId]',
		parameterMatchers: {
			eventId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'NostrArticleEvent.CanonicalEventId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							eventId: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
						},
					},
				],
			},
		],
		resolve: (params) => ['/nostr/article-version/', requiredE2eRouteParam(params, '/(social)/(nostr)/nostr/(globalNostrNetwork)/article-version/[eventId=stringSegment]', 'eventId')].join(''),
	},
	'/(social)/(nostr)/nostr/article/[pubkey]/[identifier]': {
		nodeId: '/(social)/(nostr)/nostr/article/[pubkey]/[identifier]',
		probeOwnerNodeId: '/(social)/(nostr)/nostr/article/[pubkey]/[identifier]',
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/article/[pubkey=stringSegment]/[identifier=stringSegment]',
		publicPath: '/nostr/article/[pubkey]/[identifier]',
		parameterMatchers: {
			pubkey: [
				'stringSegment',
			],
			identifier: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'NostrArticle.CanonicalCoordinate',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							pubkey: '/nostr/article/[pubkey]/[identifier]:NostrArticle.CanonicalCoordinate.1.pubkey',
							identifier: '/nostr/article/[pubkey]/[identifier]:NostrArticle.CanonicalCoordinate.1.identifier',
						},
					},
				],
			},
		],
		resolve: (params) => ['/nostr/article/', requiredE2eRouteParam(params, '/(social)/(nostr)/nostr/(globalNostrNetwork)/article/[pubkey=stringSegment]/[identifier=stringSegment]', 'pubkey'), '/', requiredE2eRouteParam(params, '/(social)/(nostr)/nostr/(globalNostrNetwork)/article/[pubkey=stringSegment]/[identifier=stringSegment]', 'identifier')].join(''),
	},
	'/(social)/(nostr)/nostr/note/[eventId]': {
		nodeId: '/(social)/(nostr)/nostr/note/[eventId]',
		probeOwnerNodeId: '/(social)/(nostr)/nostr/note/[eventId]',
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/note/[eventId=stringSegment]',
		publicPath: '/nostr/note/[eventId]',
		parameterMatchers: {
			eventId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'NostrNote.CanonicalEventId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							eventId: '/nostr/note/[eventId]:NostrNote.CanonicalEventId.1.eventId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/nostr/note/', requiredE2eRouteParam(params, '/(social)/(nostr)/nostr/(globalNostrNetwork)/note/[eventId=stringSegment]', 'eventId')].join(''),
	},
	'/(social)/(nostr)/nostr/note/[eventId]/reactions': {
		nodeId: '/(social)/(nostr)/nostr/note/[eventId]/reactions',
		probeOwnerNodeId: '/(social)/(nostr)/nostr/note/[eventId]',
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/note/[eventId=stringSegment]/(nostrNote)/reactions',
		publicPath: '/nostr/note/[eventId]/reactions',
		parameterMatchers: {
			eventId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'NostrNote.CanonicalEventId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							eventId: '/nostr/note/[eventId]:NostrNote.CanonicalEventId.1.eventId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/nostr/note/', requiredE2eRouteParam(params, '/(social)/(nostr)/nostr/(globalNostrNetwork)/note/[eventId=stringSegment]/(nostrNote)/reactions', 'eventId'), '/reactions'].join(''),
	},
	'/(social)/(nostr)/nostr/note/[eventId]/replies': {
		nodeId: '/(social)/(nostr)/nostr/note/[eventId]/replies',
		probeOwnerNodeId: '/(social)/(nostr)/nostr/note/[eventId]',
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/note/[eventId=stringSegment]/(nostrNote)/replies',
		publicPath: '/nostr/note/[eventId]/replies',
		parameterMatchers: {
			eventId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'NostrNote.CanonicalEventId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							eventId: '/nostr/note/[eventId]:NostrNote.CanonicalEventId.1.eventId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/nostr/note/', requiredE2eRouteParam(params, '/(social)/(nostr)/nostr/(globalNostrNetwork)/note/[eventId=stringSegment]/(nostrNote)/replies', 'eventId'), '/replies'].join(''),
	},
	'/(social)/(nostr)/nostr/profile-metadata-version/[eventId]': {
		nodeId: '/(social)/(nostr)/nostr/profile-metadata-version/[eventId]',
		probeOwnerNodeId: '/(social)/(nostr)/nostr/profile-metadata-version/[eventId]',
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile-metadata-version/[eventId=stringSegment]',
		publicPath: '/nostr/profile-metadata-version/[eventId]',
		parameterMatchers: {
			eventId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'NostrProfileMetadataEvent.CanonicalEventId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							eventId: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
						},
					},
				],
			},
		],
		resolve: (params) => ['/nostr/profile-metadata-version/', requiredE2eRouteParam(params, '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile-metadata-version/[eventId=stringSegment]', 'eventId')].join(''),
	},
	'/(social)/(nostr)/nostr/profile/[pubkey]': {
		nodeId: '/(social)/(nostr)/nostr/profile/[pubkey]',
		probeOwnerNodeId: '/(social)/(nostr)/nostr/profile/[pubkey]',
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]',
		publicPath: '/nostr/profile/[pubkey]',
		parameterMatchers: {
			pubkey: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'NostrProfile.CanonicalPubkey',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							pubkey: '/nostr/profile/[pubkey]:NostrProfile.CanonicalPubkey.1.pubkey',
						},
					},
				],
			},
		],
		resolve: (params) => ['/nostr/profile/', requiredE2eRouteParam(params, '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]', 'pubkey')].join(''),
	},
	'/(social)/(nostr)/nostr/profile/[pubkey]/articles': {
		nodeId: '/(social)/(nostr)/nostr/profile/[pubkey]/articles',
		probeOwnerNodeId: '/(social)/(nostr)/nostr/profile/[pubkey]',
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]/(nostrProfile)/articles',
		publicPath: '/nostr/profile/[pubkey]/articles',
		parameterMatchers: {
			pubkey: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'NostrProfile.CanonicalPubkey',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							pubkey: '/nostr/profile/[pubkey]:NostrProfile.CanonicalPubkey.1.pubkey',
						},
					},
				],
			},
		],
		resolve: (params) => ['/nostr/profile/', requiredE2eRouteParam(params, '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]/(nostrProfile)/articles', 'pubkey'), '/articles'].join(''),
	},
	'/(social)/(nostr)/nostr/profile/[pubkey]/notes': {
		nodeId: '/(social)/(nostr)/nostr/profile/[pubkey]/notes',
		probeOwnerNodeId: '/(social)/(nostr)/nostr/profile/[pubkey]',
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]/(nostrProfile)/notes',
		publicPath: '/nostr/profile/[pubkey]/notes',
		parameterMatchers: {
			pubkey: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'NostrProfile.CanonicalPubkey',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							pubkey: '/nostr/profile/[pubkey]:NostrProfile.CanonicalPubkey.1.pubkey',
						},
					},
				],
			},
		],
		resolve: (params) => ['/nostr/profile/', requiredE2eRouteParam(params, '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]/(nostrProfile)/notes', 'pubkey'), '/notes'].join(''),
	},
	'/(social)/(nostr)/nostr/profile/[pubkey]/reposts': {
		nodeId: '/(social)/(nostr)/nostr/profile/[pubkey]/reposts',
		probeOwnerNodeId: '/(social)/(nostr)/nostr/profile/[pubkey]',
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]/(nostrProfile)/reposts',
		publicPath: '/nostr/profile/[pubkey]/reposts',
		parameterMatchers: {
			pubkey: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'NostrProfile.CanonicalPubkey',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							pubkey: '/nostr/profile/[pubkey]:NostrProfile.CanonicalPubkey.1.pubkey',
						},
					},
				],
			},
		],
		resolve: (params) => ['/nostr/profile/', requiredE2eRouteParam(params, '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]/(nostrProfile)/reposts', 'pubkey'), '/reposts'].join(''),
	},
	'/(social)/(nostr)/nostr/reaction/[eventId]': {
		nodeId: '/(social)/(nostr)/nostr/reaction/[eventId]',
		probeOwnerNodeId: '/(social)/(nostr)/nostr/reaction/[eventId]',
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/reaction/[eventId=stringSegment]',
		publicPath: '/nostr/reaction/[eventId]',
		parameterMatchers: {
			eventId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'NostrReaction.CanonicalEventId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							eventId: '/nostr/reaction/[eventId]:NostrReaction.CanonicalEventId.1.eventId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/nostr/reaction/', requiredE2eRouteParam(params, '/(social)/(nostr)/nostr/(globalNostrNetwork)/reaction/[eventId=stringSegment]', 'eventId')].join(''),
	},
	'/(social)/(nostr)/nostr/relay/[relayKey]': {
		nodeId: '/(social)/(nostr)/nostr/relay/[relayKey]',
		probeOwnerNodeId: '/(social)/(nostr)/nostr/relay/[relayKey]',
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/relay/[relayKey=stringSegment]',
		publicPath: '/nostr/relay/[relayKey]',
		parameterMatchers: {
			relayKey: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'NostrRelay.RelayUrl',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							relayKey: '/nostr/relay/[relayKey]:NostrRelay.RelayUrl.1.relayKey',
						},
					},
				],
			},
		],
		resolve: (params) => ['/nostr/relay/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(nostr)/nostr/(globalNostrNetwork)/relay/[relayKey=stringSegment]', 'relayKey'), 'Opaque')].join(''),
	},
	'/(social)/(nostr)/nostr/relay/[relayKey]/observations/[timestampMs]/[source]': {
		nodeId: '/(social)/(nostr)/nostr/relay/[relayKey]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(social)/(nostr)/nostr/relay/[relayKey]/observations/[timestampMs]/[source]',
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/relay/[relayKey=stringSegment]/(nostrRelay)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/nostr/relay/[relayKey]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			relayKey: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'NostrRelay_Timestamp.RelayTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							relayKey: '/nostr/relay/[relayKey]/observations/[timestampMs]/[source]:NostrRelay_Timestamp.RelayTimestampMsSource.1.relayKey',
							timestampMs: '/nostr/relay/[relayKey]/observations/[timestampMs]/[source]:NostrRelay_Timestamp.RelayTimestampMsSource.1.timestampMs',
							source: '/nostr/relay/[relayKey]/observations/[timestampMs]/[source]:NostrRelay_Timestamp.RelayTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/nostr/relay/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(nostr)/nostr/(globalNostrNetwork)/relay/[relayKey=stringSegment]/(nostrRelay)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'relayKey'), 'Opaque'), '/observations/', requiredE2eRouteParam(params, '/(social)/(nostr)/nostr/(globalNostrNetwork)/relay/[relayKey=stringSegment]/(nostrRelay)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(social)/(nostr)/nostr/(globalNostrNetwork)/relay/[relayKey=stringSegment]/(nostrRelay)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(social)/(nostr)/nostr/repost/[eventId]': {
		nodeId: '/(social)/(nostr)/nostr/repost/[eventId]',
		probeOwnerNodeId: '/(social)/(nostr)/nostr/repost/[eventId]',
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/repost/[eventId=stringSegment]',
		publicPath: '/nostr/repost/[eventId]',
		parameterMatchers: {
			eventId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'NostrRepost.CanonicalEventId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							eventId: '/nostr/repost/[eventId]:NostrRepost.CanonicalEventId.1.eventId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/nostr/repost/', requiredE2eRouteParam(params, '/(social)/(nostr)/nostr/(globalNostrNetwork)/repost/[eventId=stringSegment]', 'eventId')].join(''),
	},
	'/(social)/(nostr)/nostr/search/[query]': {
		nodeId: '/(social)/(nostr)/nostr/search/[query]',
		probeOwnerNodeId: '/(social)/(nostr)/nostr/search/[query]',
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/search/[query=stringSegment]',
		publicPath: '/nostr/search/[query]',
		parameterMatchers: {
			query: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'NostrSearchQuery.Query',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							query: 'alice',
						},
					},
				],
			},
		],
		resolve: (params) => ['/nostr/search/', requiredE2eRouteParam(params, '/(social)/(nostr)/nostr/(globalNostrNetwork)/search/[query=stringSegment]', 'query')].join(''),
	},
	'/(social)/(reddit)/reddit/comment/[fullname]': {
		nodeId: '/(social)/(reddit)/reddit/comment/[fullname]',
		probeOwnerNodeId: '/(social)/(reddit)/reddit/comment/[fullname]',
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]',
		publicPath: '/reddit/comment/[fullname]',
		parameterMatchers: {
			fullname: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'RedditComment.Fullname',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							fullname: '/reddit/comment/[fullname]:RedditComment.Fullname.1.fullname',
						},
					},
				],
			},
		],
		resolve: (params) => ['/reddit/comment/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]', 'fullname'), 'Opaque')].join(''),
	},
	'/(social)/(reddit)/reddit/comment/[fullname]/observations': {
		nodeId: '/(social)/(reddit)/reddit/comment/[fullname]/observations',
		probeOwnerNodeId: '/(social)/(reddit)/reddit/comment/[fullname]',
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/observations',
		publicPath: '/reddit/comment/[fullname]/observations',
		parameterMatchers: {
			fullname: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'RedditComment.Fullname',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							fullname: '/reddit/comment/[fullname]:RedditComment.Fullname.1.fullname',
						},
					},
				],
			},
		],
		resolve: (params) => ['/reddit/comment/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/observations', 'fullname'), 'Opaque'), '/observations'].join(''),
	},
	'/(social)/(reddit)/reddit/comment/[fullname]/observations/[timestampMs]/[source]': {
		nodeId: '/(social)/(reddit)/reddit/comment/[fullname]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(social)/(reddit)/reddit/comment/[fullname]/observations/[timestampMs]/[source]',
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/reddit/comment/[fullname]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			fullname: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'RedditComment_Timestamp.CommentTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							fullname: '/reddit/comment/[fullname]/observations/[timestampMs]/[source]:RedditComment_Timestamp.CommentTimestampMsSource.1.fullname',
							timestampMs: '/reddit/comment/[fullname]/observations/[timestampMs]/[source]:RedditComment_Timestamp.CommentTimestampMsSource.1.timestampMs',
							source: '/reddit/comment/[fullname]/observations/[timestampMs]/[source]:RedditComment_Timestamp.CommentTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/reddit/comment/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'fullname'), 'Opaque'), '/observations/', requiredE2eRouteParam(params, '/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(social)/(reddit)/reddit/comment/[fullname]/replies': {
		nodeId: '/(social)/(reddit)/reddit/comment/[fullname]/replies',
		probeOwnerNodeId: '/(social)/(reddit)/reddit/comment/[fullname]',
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/replies',
		publicPath: '/reddit/comment/[fullname]/replies',
		parameterMatchers: {
			fullname: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'RedditComment.Fullname',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							fullname: '/reddit/comment/[fullname]:RedditComment.Fullname.1.fullname',
						},
					},
				],
			},
		],
		resolve: (params) => ['/reddit/comment/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/replies', 'fullname'), 'Opaque'), '/replies'].join(''),
	},
	'/(social)/(reddit)/reddit/link/[fullname]': {
		nodeId: '/(social)/(reddit)/reddit/link/[fullname]',
		probeOwnerNodeId: '/(social)/(reddit)/reddit/link/[fullname]',
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]',
		publicPath: '/reddit/link/[fullname]',
		parameterMatchers: {
			fullname: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'RedditLink.Fullname',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							fullname: '/reddit/link/[fullname]:RedditLink.Fullname.1.fullname',
						},
					},
				],
			},
		],
		resolve: (params) => ['/reddit/link/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]', 'fullname'), 'Opaque')].join(''),
	},
	'/(social)/(reddit)/reddit/link/[fullname]/comments': {
		nodeId: '/(social)/(reddit)/reddit/link/[fullname]/comments',
		probeOwnerNodeId: '/(social)/(reddit)/reddit/link/[fullname]',
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/comments',
		publicPath: '/reddit/link/[fullname]/comments',
		parameterMatchers: {
			fullname: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'RedditLink.Fullname',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							fullname: '/reddit/link/[fullname]:RedditLink.Fullname.1.fullname',
						},
					},
				],
			},
		],
		resolve: (params) => ['/reddit/link/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/comments', 'fullname'), 'Opaque'), '/comments'].join(''),
	},
	'/(social)/(reddit)/reddit/link/[fullname]/observations': {
		nodeId: '/(social)/(reddit)/reddit/link/[fullname]/observations',
		probeOwnerNodeId: '/(social)/(reddit)/reddit/link/[fullname]',
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/observations',
		publicPath: '/reddit/link/[fullname]/observations',
		parameterMatchers: {
			fullname: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'RedditLink.Fullname',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							fullname: '/reddit/link/[fullname]:RedditLink.Fullname.1.fullname',
						},
					},
				],
			},
		],
		resolve: (params) => ['/reddit/link/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/observations', 'fullname'), 'Opaque'), '/observations'].join(''),
	},
	'/(social)/(reddit)/reddit/link/[fullname]/observations/[timestampMs]/[source]': {
		nodeId: '/(social)/(reddit)/reddit/link/[fullname]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(social)/(reddit)/reddit/link/[fullname]/observations/[timestampMs]/[source]',
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/reddit/link/[fullname]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			fullname: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'RedditLink_Timestamp.LinkTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							fullname: '/reddit/link/[fullname]/observations/[timestampMs]/[source]:RedditLink_Timestamp.LinkTimestampMsSource.1.fullname',
							timestampMs: '/reddit/link/[fullname]/observations/[timestampMs]/[source]:RedditLink_Timestamp.LinkTimestampMsSource.1.timestampMs',
							source: '/reddit/link/[fullname]/observations/[timestampMs]/[source]:RedditLink_Timestamp.LinkTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/reddit/link/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'fullname'), 'Opaque'), '/observations/', requiredE2eRouteParam(params, '/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(social)/(reddit)/reddit/r/[name]': {
		nodeId: '/(social)/(reddit)/reddit/r/[name]',
		probeOwnerNodeId: '/(social)/(reddit)/reddit/r/[name]',
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]',
		publicPath: '/reddit/r/[name]',
		parameterMatchers: {
			name: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'RedditSubreddit.Name',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							name: '/reddit/r/[name]:RedditSubreddit.Name.1.name',
						},
					},
				],
			},
		],
		resolve: (params) => ['/reddit/r/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]', 'name'), 'Opaque')].join(''),
	},
	'/(social)/(reddit)/reddit/r/[name]/links': {
		nodeId: '/(social)/(reddit)/reddit/r/[name]/links',
		probeOwnerNodeId: '/(social)/(reddit)/reddit/r/[name]',
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/links',
		publicPath: '/reddit/r/[name]/links',
		parameterMatchers: {
			name: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'RedditSubreddit.Name',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							name: '/reddit/r/[name]:RedditSubreddit.Name.1.name',
						},
					},
				],
			},
		],
		resolve: (params) => ['/reddit/r/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/links', 'name'), 'Opaque'), '/links'].join(''),
	},
	'/(social)/(reddit)/reddit/r/[name]/observations': {
		nodeId: '/(social)/(reddit)/reddit/r/[name]/observations',
		probeOwnerNodeId: '/(social)/(reddit)/reddit/r/[name]',
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/observations',
		publicPath: '/reddit/r/[name]/observations',
		parameterMatchers: {
			name: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'RedditSubreddit.Name',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							name: '/reddit/r/[name]:RedditSubreddit.Name.1.name',
						},
					},
				],
			},
		],
		resolve: (params) => ['/reddit/r/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/observations', 'name'), 'Opaque'), '/observations'].join(''),
	},
	'/(social)/(reddit)/reddit/r/[name]/observations/[timestampMs]/[source]': {
		nodeId: '/(social)/(reddit)/reddit/r/[name]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(social)/(reddit)/reddit/r/[name]/observations/[timestampMs]/[source]',
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/reddit/r/[name]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			name: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'RedditSubreddit_Timestamp.SubredditTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							name: '/reddit/r/[name]/observations/[timestampMs]/[source]:RedditSubreddit_Timestamp.SubredditTimestampMsSource.1.name',
							timestampMs: '/reddit/r/[name]/observations/[timestampMs]/[source]:RedditSubreddit_Timestamp.SubredditTimestampMsSource.1.timestampMs',
							source: '/reddit/r/[name]/observations/[timestampMs]/[source]:RedditSubreddit_Timestamp.SubredditTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/reddit/r/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'name'), 'Opaque'), '/observations/', requiredE2eRouteParam(params, '/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(social)/(rss)/rss/feed/[feedUrl]': {
		nodeId: '/(social)/(rss)/rss/feed/[feedUrl]',
		probeOwnerNodeId: '/(social)/(rss)/rss/feed/[feedUrl]',
		routeId: '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]',
		publicPath: '/rss/feed/[feedUrl]',
		parameterMatchers: {
			feedUrl: [
				'absoluteUrl',
			],
		},
		mappings: [
			{
				id: 'RssFeed.FeedUrl',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							feedUrl: '/rss/feed/[feedUrl]:RssFeed.FeedUrl.1.feedUrl',
						},
					},
				],
			},
		],
		resolve: (params) => ['/rss/feed/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]', 'feedUrl'), 'Opaque')].join(''),
	},
	'/(social)/(rss)/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]': {
		nodeId: '/(social)/(rss)/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]',
		probeOwnerNodeId: '/(social)/(rss)/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]',
		routeId: '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]',
		publicPath: '/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]',
		parameterMatchers: {
			feedUrl: [
				'absoluteUrl',
			],
			itemIdentityKind: [
				'rssItemIdentityKind',
			],
			itemIdentity: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'RssItem.FeedIdentity',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							feedUrl: '/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]:RssItem.FeedIdentity.1.feedUrl',
							itemIdentityKind: '/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]:RssItem.FeedIdentity.1.itemIdentityKind',
							itemIdentity: '/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]:RssItem.FeedIdentity.1.itemIdentity',
						},
					},
				],
			},
		],
		resolve: (params) => ['/rss/feed/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]', 'feedUrl'), 'Opaque'), '/item/', requiredE2eRouteParam(params, '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]', 'itemIdentityKind'), '/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]', 'itemIdentity'), 'Opaque')].join(''),
	},
	'/(social)/(rss)/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]/observations/[timestampMs]/[source]': {
		nodeId: '/(social)/(rss)/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(social)/(rss)/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]/observations/[timestampMs]/[source]',
		routeId: '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]/(rssItem)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			feedUrl: [
				'absoluteUrl',
			],
			itemIdentityKind: [
				'rssItemIdentityKind',
			],
			itemIdentity: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'RssItem_Timestamp.ItemTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							feedUrl: '/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]/observations/[timestampMs]/[source]:RssItem_Timestamp.ItemTimestampMsSource.1.feedUrl',
							itemIdentityKind: '/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]/observations/[timestampMs]/[source]:RssItem_Timestamp.ItemTimestampMsSource.1.itemIdentityKind',
							itemIdentity: '/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]/observations/[timestampMs]/[source]:RssItem_Timestamp.ItemTimestampMsSource.1.itemIdentity',
							timestampMs: '/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]/observations/[timestampMs]/[source]:RssItem_Timestamp.ItemTimestampMsSource.1.timestampMs',
							source: '/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]/observations/[timestampMs]/[source]:RssItem_Timestamp.ItemTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/rss/feed/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]/(rssItem)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'feedUrl'), 'Opaque'), '/item/', requiredE2eRouteParam(params, '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]/(rssItem)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'itemIdentityKind'), '/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]/(rssItem)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'itemIdentity'), 'Opaque'), '/observations/', requiredE2eRouteParam(params, '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]/(rssItem)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]/(rssItem)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(social)/(rss)/rss/feed/[feedUrl]/items': {
		nodeId: '/(social)/(rss)/rss/feed/[feedUrl]/items',
		probeOwnerNodeId: '/(social)/(rss)/rss/feed/[feedUrl]',
		routeId: '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/items',
		publicPath: '/rss/feed/[feedUrl]/items',
		parameterMatchers: {
			feedUrl: [
				'absoluteUrl',
			],
		},
		mappings: [
			{
				id: 'RssFeed.FeedUrl',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							feedUrl: '/rss/feed/[feedUrl]:RssFeed.FeedUrl.1.feedUrl',
						},
					},
				],
			},
		],
		resolve: (params) => ['/rss/feed/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/items', 'feedUrl'), 'Opaque'), '/items'].join(''),
	},
	'/(social)/(rss)/rss/feed/[feedUrl]/observations/[timestampMs]/[source]': {
		nodeId: '/(social)/(rss)/rss/feed/[feedUrl]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(social)/(rss)/rss/feed/[feedUrl]/observations/[timestampMs]/[source]',
		routeId: '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/rss/feed/[feedUrl]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			feedUrl: [
				'absoluteUrl',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'RssFeed_Timestamp.FeedTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							feedUrl: '/rss/feed/[feedUrl]/observations/[timestampMs]/[source]:RssFeed_Timestamp.FeedTimestampMsSource.1.feedUrl',
							timestampMs: '/rss/feed/[feedUrl]/observations/[timestampMs]/[source]:RssFeed_Timestamp.FeedTimestampMsSource.1.timestampMs',
							source: '/rss/feed/[feedUrl]/observations/[timestampMs]/[source]:RssFeed_Timestamp.FeedTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/rss/feed/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'feedUrl'), 'Opaque'), '/observations/', requiredE2eRouteParam(params, '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(social)/(x)/x/post/[postId]': {
		nodeId: '/(social)/(x)/x/post/[postId]',
		probeOwnerNodeId: '/(social)/(x)/x/post/[postId]',
		routeId: '/(social)/(x)/x/(xNetwork)/post/[postId=stringSegment]',
		publicPath: '/x/post/[postId]',
		parameterMatchers: {
			postId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'XPost.Id',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							postId: '/x/post/[postId]:XPost.Id.1.postId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/x/post/', requiredE2eRouteParam(params, '/(social)/(x)/x/(xNetwork)/post/[postId=stringSegment]', 'postId')].join(''),
	},
	'/(social)/(x)/x/post/[postId]/observations/[timestampMs]/[source]': {
		nodeId: '/(social)/(x)/x/post/[postId]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(social)/(x)/x/post/[postId]/observations/[timestampMs]/[source]',
		routeId: '/(social)/(x)/x/(xNetwork)/post/[postId=stringSegment]/(xPost)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/x/post/[postId]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			postId: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'XPost_Timestamp.XPostTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							postId: '/x/post/[postId]/observations/[timestampMs]/[source]:XPost_Timestamp.XPostTimestampMsSource.1.postId',
							timestampMs: '/x/post/[postId]/observations/[timestampMs]/[source]:XPost_Timestamp.XPostTimestampMsSource.1.timestampMs',
							source: '/x/post/[postId]/observations/[timestampMs]/[source]:XPost_Timestamp.XPostTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/x/post/', requiredE2eRouteParam(params, '/(social)/(x)/x/(xNetwork)/post/[postId=stringSegment]/(xPost)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'postId'), '/observations/', requiredE2eRouteParam(params, '/(social)/(x)/x/(xNetwork)/post/[postId=stringSegment]/(xPost)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(social)/(x)/x/(xNetwork)/post/[postId=stringSegment]/(xPost)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(social)/(x)/x/user/[userId]': {
		nodeId: '/(social)/(x)/x/user/[userId]',
		probeOwnerNodeId: '/(social)/(x)/x/user/[userId]',
		routeId: '/(social)/(x)/x/(xNetwork)/user/[userId=stringSegment]',
		publicPath: '/x/user/[userId]',
		parameterMatchers: {
			userId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'XUser.Id',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							userId: '/x/user/[userId]:XUser.Id.1.userId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/x/user/', requiredE2eRouteParam(params, '/(social)/(x)/x/(xNetwork)/user/[userId=stringSegment]', 'userId')].join(''),
	},
	'/(social)/(x)/x/user/[userId]/observations/[timestampMs]/[source]': {
		nodeId: '/(social)/(x)/x/user/[userId]/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(social)/(x)/x/user/[userId]/observations/[timestampMs]/[source]',
		routeId: '/(social)/(x)/x/(xNetwork)/user/[userId=stringSegment]/(xUser)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/x/user/[userId]/observations/[timestampMs]/[source]',
		parameterMatchers: {
			userId: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'XUser_Timestamp.XUserTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							userId: '/x/user/[userId]/observations/[timestampMs]/[source]:XUser_Timestamp.XUserTimestampMsSource.1.userId',
							timestampMs: '/x/user/[userId]/observations/[timestampMs]/[source]:XUser_Timestamp.XUserTimestampMsSource.1.timestampMs',
							source: '/x/user/[userId]/observations/[timestampMs]/[source]:XUser_Timestamp.XUserTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/x/user/', requiredE2eRouteParam(params, '/(social)/(x)/x/(xNetwork)/user/[userId=stringSegment]/(xUser)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'userId'), '/observations/', requiredE2eRouteParam(params, '/(social)/(x)/x/(xNetwork)/user/[userId=stringSegment]/(xUser)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(social)/(x)/x/(xNetwork)/user/[userId=stringSegment]/(xUser)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/(social)/(xmtp)/xmtp/conversation/[conversationId]': {
		nodeId: '/(social)/(xmtp)/xmtp/conversation/[conversationId]',
		probeOwnerNodeId: '/(social)/(xmtp)/xmtp/conversation/[conversationId]',
		routeId: '/(social)/(xmtp)/xmtp/(xmtpNetwork)/conversation/[conversationId=stringSegment]',
		publicPath: '/xmtp/conversation/[conversationId]',
		parameterMatchers: {
			conversationId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'XmtpConversation.Id',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							conversationId: '/xmtp/conversation/[conversationId]:XmtpConversation.Id.1.conversationId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/xmtp/conversation/', requiredE2eRouteParam(params, '/(social)/(xmtp)/xmtp/(xmtpNetwork)/conversation/[conversationId=stringSegment]', 'conversationId')].join(''),
	},
	'/(social)/(youtube)/youtube/channel/[channelId]': {
		nodeId: '/(social)/(youtube)/youtube/channel/[channelId]',
		probeOwnerNodeId: '/(social)/(youtube)/youtube/channel/[channelId]',
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]',
		publicPath: '/youtube/channel/[channelId]',
		parameterMatchers: {
			channelId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'YoutubeChannel.ChannelId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							channelId: '/youtube/channel/[channelId]:YoutubeChannel.ChannelId.1.channelId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/youtube/channel/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]', 'channelId'), 'Opaque')].join(''),
	},
	'/(social)/(youtube)/youtube/channel/[channelId]/observations/[timestampMs]-[source]': {
		nodeId: '/(social)/(youtube)/youtube/channel/[channelId]/observations/[timestampMs]-[source]',
		probeOwnerNodeId: '/(social)/(youtube)/youtube/channel/[channelId]/observations/[timestampMs]-[source]',
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
		publicPath: '/youtube/channel/[channelId]/observations/[timestampMs]-[source]',
		parameterMatchers: {
			channelId: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'YoutubeChannel_Timestamp.YoutubeChannelTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							channelId: '/youtube/channel/[channelId]/observations/[timestampMs]-[source]:YoutubeChannel_Timestamp.YoutubeChannelTimestampMsSource.1.channelId',
							timestampMs: '/youtube/channel/[channelId]/observations/[timestampMs]-[source]:YoutubeChannel_Timestamp.YoutubeChannelTimestampMsSource.1.timestampMs',
							source: 'Youtube_Rest',
						},
					},
				],
			},
		],
		resolve: (params) => ['/youtube/channel/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', 'channelId'), 'Opaque'), '/observations/', requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', 'timestampMs'), '-', requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', 'source')].join(''),
	},
	'/(social)/(youtube)/youtube/channel/[channelId]/playlists': {
		nodeId: '/(social)/(youtube)/youtube/channel/[channelId]/playlists',
		probeOwnerNodeId: '/(social)/(youtube)/youtube/channel/[channelId]',
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/playlists',
		publicPath: '/youtube/channel/[channelId]/playlists',
		parameterMatchers: {
			channelId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'YoutubeChannel.ChannelId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							channelId: '/youtube/channel/[channelId]:YoutubeChannel.ChannelId.1.channelId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/youtube/channel/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/playlists', 'channelId'), 'Opaque'), '/playlists'].join(''),
	},
	'/(social)/(youtube)/youtube/channel/[channelId]/videos': {
		nodeId: '/(social)/(youtube)/youtube/channel/[channelId]/videos',
		probeOwnerNodeId: '/(social)/(youtube)/youtube/channel/[channelId]',
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/videos',
		publicPath: '/youtube/channel/[channelId]/videos',
		parameterMatchers: {
			channelId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'YoutubeChannel.ChannelId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							channelId: '/youtube/channel/[channelId]:YoutubeChannel.ChannelId.1.channelId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/youtube/channel/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/videos', 'channelId'), 'Opaque'), '/videos'].join(''),
	},
	'/(social)/(youtube)/youtube/comment/[videoId]/[commentId]': {
		nodeId: '/(social)/(youtube)/youtube/comment/[videoId]/[commentId]',
		probeOwnerNodeId: '/(social)/(youtube)/youtube/comment/[videoId]/[commentId]',
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/comment/[videoId=stringSegment]/[commentId=stringSegment]',
		publicPath: '/youtube/comment/[videoId]/[commentId]',
		parameterMatchers: {
			videoId: [
				'stringSegment',
			],
			commentId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'YoutubeComment.VideoIdCommentId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							videoId: '/youtube/comment/[videoId]/[commentId]:YoutubeComment.VideoIdCommentId.1.videoId',
							commentId: '/youtube/comment/[videoId]/[commentId]:YoutubeComment.VideoIdCommentId.1.commentId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/youtube/comment/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/comment/[videoId=stringSegment]/[commentId=stringSegment]', 'videoId'), 'Opaque'), '/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/comment/[videoId=stringSegment]/[commentId=stringSegment]', 'commentId'), 'Opaque')].join(''),
	},
	'/(social)/(youtube)/youtube/comment/[videoId]/[commentId]/observations/[timestampMs]-[source]': {
		nodeId: '/(social)/(youtube)/youtube/comment/[videoId]/[commentId]/observations/[timestampMs]-[source]',
		probeOwnerNodeId: '/(social)/(youtube)/youtube/comment/[videoId]/[commentId]/observations/[timestampMs]-[source]',
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/comment/[videoId=stringSegment]/[commentId=stringSegment]/(youtubeComment)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
		publicPath: '/youtube/comment/[videoId]/[commentId]/observations/[timestampMs]-[source]',
		parameterMatchers: {
			videoId: [
				'stringSegment',
			],
			commentId: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'YoutubeComment_Timestamp.YoutubeCommentTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							videoId: '/youtube/comment/[videoId]/[commentId]/observations/[timestampMs]-[source]:YoutubeComment_Timestamp.YoutubeCommentTimestampMsSource.1.videoId',
							commentId: '/youtube/comment/[videoId]/[commentId]/observations/[timestampMs]-[source]:YoutubeComment_Timestamp.YoutubeCommentTimestampMsSource.1.commentId',
							timestampMs: '/youtube/comment/[videoId]/[commentId]/observations/[timestampMs]-[source]:YoutubeComment_Timestamp.YoutubeCommentTimestampMsSource.1.timestampMs',
							source: 'Youtube_Rest',
						},
					},
				],
			},
		],
		resolve: (params) => ['/youtube/comment/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/comment/[videoId=stringSegment]/[commentId=stringSegment]/(youtubeComment)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', 'videoId'), 'Opaque'), '/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/comment/[videoId=stringSegment]/[commentId=stringSegment]/(youtubeComment)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', 'commentId'), 'Opaque'), '/observations/', requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/comment/[videoId=stringSegment]/[commentId=stringSegment]/(youtubeComment)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', 'timestampMs'), '-', requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/comment/[videoId=stringSegment]/[commentId=stringSegment]/(youtubeComment)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', 'source')].join(''),
	},
	'/(social)/(youtube)/youtube/playlist/[playlistId]': {
		nodeId: '/(social)/(youtube)/youtube/playlist/[playlistId]',
		probeOwnerNodeId: '/(social)/(youtube)/youtube/playlist/[playlistId]',
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]',
		publicPath: '/youtube/playlist/[playlistId]',
		parameterMatchers: {
			playlistId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'YoutubePlaylist.PlaylistId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							playlistId: '/youtube/playlist/[playlistId]:YoutubePlaylist.PlaylistId.1.playlistId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/youtube/playlist/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]', 'playlistId'), 'Opaque')].join(''),
	},
	'/(social)/(youtube)/youtube/playlist/[playlistId]/observations/[timestampMs]-[source]': {
		nodeId: '/(social)/(youtube)/youtube/playlist/[playlistId]/observations/[timestampMs]-[source]',
		probeOwnerNodeId: '/(social)/(youtube)/youtube/playlist/[playlistId]/observations/[timestampMs]-[source]',
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]/(youtubePlaylist)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
		publicPath: '/youtube/playlist/[playlistId]/observations/[timestampMs]-[source]',
		parameterMatchers: {
			playlistId: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'YoutubePlaylist_Timestamp.YoutubePlaylistTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							playlistId: '/youtube/playlist/[playlistId]/observations/[timestampMs]-[source]:YoutubePlaylist_Timestamp.YoutubePlaylistTimestampMsSource.1.playlistId',
							timestampMs: '/youtube/playlist/[playlistId]/observations/[timestampMs]-[source]:YoutubePlaylist_Timestamp.YoutubePlaylistTimestampMsSource.1.timestampMs',
							source: 'Youtube_Rest',
						},
					},
				],
			},
		],
		resolve: (params) => ['/youtube/playlist/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]/(youtubePlaylist)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', 'playlistId'), 'Opaque'), '/observations/', requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]/(youtubePlaylist)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', 'timestampMs'), '-', requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]/(youtubePlaylist)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', 'source')].join(''),
	},
	'/(social)/(youtube)/youtube/playlist/[playlistId]/videos': {
		nodeId: '/(social)/(youtube)/youtube/playlist/[playlistId]/videos',
		probeOwnerNodeId: '/(social)/(youtube)/youtube/playlist/[playlistId]',
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]/(youtubePlaylist)/videos',
		publicPath: '/youtube/playlist/[playlistId]/videos',
		parameterMatchers: {
			playlistId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'YoutubePlaylist.PlaylistId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							playlistId: '/youtube/playlist/[playlistId]:YoutubePlaylist.PlaylistId.1.playlistId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/youtube/playlist/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]/(youtubePlaylist)/videos', 'playlistId'), 'Opaque'), '/videos'].join(''),
	},
	'/(social)/(youtube)/youtube/video/[videoId]': {
		nodeId: '/(social)/(youtube)/youtube/video/[videoId]',
		probeOwnerNodeId: '/(social)/(youtube)/youtube/video/[videoId]',
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]',
		publicPath: '/youtube/video/[videoId]',
		parameterMatchers: {
			videoId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'YoutubeVideo.VideoId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							videoId: '/youtube/video/[videoId]:YoutubeVideo.VideoId.1.videoId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/youtube/video/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]', 'videoId'), 'Opaque')].join(''),
	},
	'/(social)/(youtube)/youtube/video/[videoId]/comments': {
		nodeId: '/(social)/(youtube)/youtube/video/[videoId]/comments',
		probeOwnerNodeId: '/(social)/(youtube)/youtube/video/[videoId]',
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]/(youtubeVideo)/comments',
		publicPath: '/youtube/video/[videoId]/comments',
		parameterMatchers: {
			videoId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'YoutubeVideo.VideoId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							videoId: '/youtube/video/[videoId]:YoutubeVideo.VideoId.1.videoId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/youtube/video/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]/(youtubeVideo)/comments', 'videoId'), 'Opaque'), '/comments'].join(''),
	},
	'/(social)/(youtube)/youtube/video/[videoId]/observations/[timestampMs]-[source]': {
		nodeId: '/(social)/(youtube)/youtube/video/[videoId]/observations/[timestampMs]-[source]',
		probeOwnerNodeId: '/(social)/(youtube)/youtube/video/[videoId]/observations/[timestampMs]-[source]',
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]/(youtubeVideo)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
		publicPath: '/youtube/video/[videoId]/observations/[timestampMs]-[source]',
		parameterMatchers: {
			videoId: [
				'stringSegment',
			],
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'YoutubeVideo_Timestamp.YoutubeVideoTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							videoId: '/youtube/video/[videoId]/observations/[timestampMs]-[source]:YoutubeVideo_Timestamp.YoutubeVideoTimestampMsSource.1.videoId',
							timestampMs: '/youtube/video/[videoId]/observations/[timestampMs]-[source]:YoutubeVideo_Timestamp.YoutubeVideoTimestampMsSource.1.timestampMs',
							source: 'Youtube_Rest',
						},
					},
				],
			},
		],
		resolve: (params) => ['/youtube/video/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]/(youtubeVideo)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', 'videoId'), 'Opaque'), '/observations/', requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]/(youtubeVideo)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', 'timestampMs'), '-', requiredE2eRouteParam(params, '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]/(youtubeVideo)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]', 'source')].join(''),
	},
	'/(swarm)/swarm/[reference]': {
		nodeId: '/(swarm)/swarm/[reference]',
		probeOwnerNodeId: '/(swarm)/swarm/[reference]',
		routeId: '/(swarm)/swarm/(swarmProtocol)/[reference=stringSegment]',
		publicPath: '/swarm/[reference]',
		parameterMatchers: {
			reference: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'SwarmResource.ResourceAddress',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'base',
						params: {
							reference: '/swarm/[reference]:SwarmResource.ResourceAddress.1.reference',
						},
					},
				],
			},
		],
		resolve: (params) => ['/swarm/', requiredE2eRouteParam(params, '/(swarm)/swarm/(swarmProtocol)/[reference=stringSegment]', 'reference')].join(''),
	},
	'/(swarm)/swarm/[reference]/path/[...contentPath]': {
		nodeId: '/(swarm)/swarm/[reference]/path/[...contentPath]',
		probeOwnerNodeId: '/(swarm)/swarm/[reference]',
		routeId: '/(swarm)/swarm/(swarmProtocol)/[reference=stringSegment]/path/[...contentPath=stringSegment]',
		publicPath: '/swarm/[reference]/path/[...contentPath]',
		parameterMatchers: {
			reference: [
				'stringSegment',
			],
			contentPath: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'SwarmResource.ResourceAddress',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'path',
						params: {
							reference: '/swarm/[reference]/path/[...contentPath]:SwarmResource.ResourceAddress.path.1.reference',
							contentPath: '/swarm/[reference]/path/[...contentPath]:SwarmResource.ResourceAddress.path.1.contentPath',
						},
					},
				],
			},
		],
		resolve: (params) => ['/swarm/', requiredE2eRouteParam(params, '/(swarm)/swarm/(swarmProtocol)/[reference=stringSegment]/path/[...contentPath=stringSegment]', 'reference'), '/path/', requiredE2eRouteParam(params, '/(swarm)/swarm/(swarmProtocol)/[reference=stringSegment]/path/[...contentPath=stringSegment]', 'contentPath')].join(''),
	},
	'/(swarm)/swarm/access/observations/[timestampMs]/[source]': {
		nodeId: '/(swarm)/swarm/access/observations/[timestampMs]/[source]',
		probeOwnerNodeId: '/(swarm)/swarm/access/observations/[timestampMs]/[source]',
		routeId: '/(swarm)/swarm/(swarmProtocol)/access/(globalSwarmAccess)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		publicPath: '/swarm/access/observations/[timestampMs]/[source]',
		parameterMatchers: {
			timestampMs: [
				'nonNegativeInteger',
			],
			source: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: '_GlobalSwarmAccess_Timestamp.HubTimestampMsSource',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							timestampMs: '/swarm/access/observations/[timestampMs]/[source]:_GlobalSwarmAccess_Timestamp.HubTimestampMsSource.1.timestampMs',
							source: '/swarm/access/observations/[timestampMs]/[source]:_GlobalSwarmAccess_Timestamp.HubTimestampMsSource.1.source',
						},
					},
				],
			},
		],
		resolve: (params) => ['/swarm/access/observations/', requiredE2eRouteParam(params, '/(swarm)/swarm/(swarmProtocol)/access/(globalSwarmAccess)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'timestampMs'), '/', requiredE2eRouteParam(params, '/(swarm)/swarm/(swarmProtocol)/access/(globalSwarmAccess)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', 'source')].join(''),
	},
	'/~/accounts/allowance/[chainId]/[owner]/[coin]/[spender]': {
		nodeId: '/~/accounts/allowance/[chainId]/[owner]/[coin]/[spender]',
		probeOwnerNodeId: '/~/accounts/allowance/[chainId]/[owner]/[coin]/[spender]',
		routeId: '/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]',
		publicPath: '/~/accounts/allowance/[chainId]/[owner]/[coin]/[spender]',
		parameterMatchers: {
			chainId: [
				'eip155ChainId',
			],
			owner: [
				'evmAddress',
			],
			coin: [
				'evmAddress',
			],
			spender: [
				'evmAddress',
			],
		},
		mappings: [
			{
				id: 'EvmActorCoinAllowance.EvmAccountEvmContractSpenderInteropAddress',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							chainId: '/~/accounts/allowance/[chainId]/[owner]/[coin]/[spender]:EvmActorCoinAllowance.EvmAccountEvmContractSpenderInteropAddress.1.chainId',
							owner: '/~/accounts/allowance/[chainId]/[owner]/[coin]/[spender]:EvmActorCoinAllowance.EvmAccountEvmContractSpenderInteropAddress.1.owner',
							coin: '/~/accounts/allowance/[chainId]/[owner]/[coin]/[spender]:EvmActorCoinAllowance.EvmAccountEvmContractSpenderInteropAddress.1.coin',
							spender: '/~/accounts/allowance/[chainId]/[owner]/[coin]/[spender]:EvmActorCoinAllowance.EvmAccountEvmContractSpenderInteropAddress.1.spender',
						},
					},
				],
			},
		],
		resolve: (params) => ['/~/accounts/allowance/', requiredE2eRouteParam(params, '/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]', 'chainId'), '/', requiredE2eRouteParam(params, '/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]', 'owner'), '/', requiredE2eRouteParam(params, '/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]', 'coin'), '/', requiredE2eRouteParam(params, '/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]', 'spender')].join(''),
	},
	'/~/accounts/balance/[chainId]/[owner]/[coin]': {
		nodeId: '/~/accounts/balance/[chainId]/[owner]/[coin]',
		probeOwnerNodeId: '/~/accounts/balance/[chainId]/[owner]/[coin]',
		routeId: '/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]',
		publicPath: '/~/accounts/balance/[chainId]/[owner]/[coin]',
		parameterMatchers: {
			chainId: [
				'eip155ChainId',
			],
			owner: [
				'evmAddress',
			],
			coin: [
				'evmAddress',
			],
		},
		mappings: [
			{
				id: 'EvmNetworkActorCoinBalance.EvmAccountErc20CoinInstance',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							chainId: '/~/accounts/balance/[chainId]/[owner]/[coin]:EvmNetworkActorCoinBalance.EvmAccountErc20CoinInstance.1.chainId',
							owner: '/~/accounts/balance/[chainId]/[owner]/[coin]:EvmNetworkActorCoinBalance.EvmAccountErc20CoinInstance.1.owner',
							coin: '/~/accounts/balance/[chainId]/[owner]/[coin]:EvmNetworkActorCoinBalance.EvmAccountErc20CoinInstance.1.coin',
						},
					},
				],
			},
		],
		resolve: (params) => ['/~/accounts/balance/', requiredE2eRouteParam(params, '/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]', 'chainId'), '/', requiredE2eRouteParam(params, '/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]', 'owner'), '/', requiredE2eRouteParam(params, '/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]', 'coin')].join(''),
	},
	'/~/accounts/connections/[connectionKey]': {
		nodeId: '/~/accounts/connections/[connectionKey]',
		probeOwnerNodeId: '/~/accounts/connections/[connectionKey]',
		routeId: '/~/accounts/connections/[connectionKey=stringSegment]',
		publicPath: '/~/accounts/connections/[connectionKey]',
		parameterMatchers: {
			connectionKey: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'BlockheadWalletConnection.ConnectionKey',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							connectionKey: '/~/accounts/connections/[connectionKey]:BlockheadWalletConnection.ConnectionKey.1.connectionKey',
						},
					},
				],
			},
		],
		resolve: (params) => ['/~/accounts/connections/', requiredE2eRouteParam(params, '/~/accounts/connections/[connectionKey=stringSegment]', 'connectionKey')].join(''),
	},
	'/~/accounts/transaction/[chainId]/[address]/[sourceTxHash]/[createdAt]': {
		nodeId: '/~/accounts/transaction/[chainId]/[address]/[sourceTxHash]/[createdAt]',
		probeOwnerNodeId: '/~/accounts/transaction/[chainId]/[address]/[sourceTxHash]/[createdAt]',
		routeId: '/~/accounts/transaction/[chainId=eip155ChainId]/[address=evmAddress]/[sourceTxHash=stringSegment]/[createdAt=nonNegativeInteger]',
		publicPath: '/~/accounts/transaction/[chainId]/[address]/[sourceTxHash]/[createdAt]',
		parameterMatchers: {
			chainId: [
				'eip155ChainId',
			],
			address: [
				'evmAddress',
			],
			sourceTxHash: [
				'stringSegment',
			],
			createdAt: [
				'nonNegativeInteger',
			],
		},
		mappings: [
			{
				id: 'BlockheadBridgeTransaction.AccountSourceTxCreatedAt',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							chainId: '/~/accounts/transaction/[chainId]/[address]/[sourceTxHash]/[createdAt]:BlockheadBridgeTransaction.AccountSourceTxCreatedAt.1.chainId',
							address: '/~/accounts/transaction/[chainId]/[address]/[sourceTxHash]/[createdAt]:BlockheadBridgeTransaction.AccountSourceTxCreatedAt.1.address',
							sourceTxHash: '/~/accounts/transaction/[chainId]/[address]/[sourceTxHash]/[createdAt]:BlockheadBridgeTransaction.AccountSourceTxCreatedAt.1.sourceTxHash',
							createdAt: '/~/accounts/transaction/[chainId]/[address]/[sourceTxHash]/[createdAt]:BlockheadBridgeTransaction.AccountSourceTxCreatedAt.1.createdAt',
						},
					},
				],
			},
		],
		resolve: (params) => ['/~/accounts/transaction/', requiredE2eRouteParam(params, '/~/accounts/transaction/[chainId=eip155ChainId]/[address=evmAddress]/[sourceTxHash=stringSegment]/[createdAt=nonNegativeInteger]', 'chainId'), '/', requiredE2eRouteParam(params, '/~/accounts/transaction/[chainId=eip155ChainId]/[address=evmAddress]/[sourceTxHash=stringSegment]/[createdAt=nonNegativeInteger]', 'address'), '/', encodeE2eRouteParam(requiredE2eRouteParam(params, '/~/accounts/transaction/[chainId=eip155ChainId]/[address=evmAddress]/[sourceTxHash=stringSegment]/[createdAt=nonNegativeInteger]', 'sourceTxHash'), 'Opaque'), '/', requiredE2eRouteParam(params, '/~/accounts/transaction/[chainId=eip155ChainId]/[address=evmAddress]/[sourceTxHash=stringSegment]/[createdAt=nonNegativeInteger]', 'createdAt')].join(''),
	},
	'/~/agents/conversation/[conversationId]': {
		nodeId: '/~/agents/conversation/[conversationId]',
		probeOwnerNodeId: '/~/agents/conversation/[conversationId]',
		routeId: '/~/agents/conversation/[conversationId=stringSegment]',
		publicPath: '/~/agents/conversation/[conversationId]',
		parameterMatchers: {
			conversationId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'BlockheadAgentConversation.Id',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							conversationId: '/~/agents/conversation/[conversationId]:BlockheadAgentConversation.Id.1.conversationId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/~/agents/conversation/', requiredE2eRouteParam(params, '/~/agents/conversation/[conversationId=stringSegment]', 'conversationId')].join(''),
	},
	'/~/agents/conversation/[conversationId]/turn/[turnId]': {
		nodeId: '/~/agents/conversation/[conversationId]/turn/[turnId]',
		probeOwnerNodeId: '/~/agents/conversation/[conversationId]/turn/[turnId]',
		routeId: '/~/agents/conversation/[conversationId=stringSegment]/(blockheadAgentConversation)/turn/[turnId=stringSegment]',
		publicPath: '/~/agents/conversation/[conversationId]/turn/[turnId]',
		parameterMatchers: {
			conversationId: [
				'stringSegment',
			],
			turnId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'BlockheadAgentConversationTurn.ConversationTurnId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							conversationId: '/~/agents/conversation/[conversationId]/turn/[turnId]:BlockheadAgentConversationTurn.ConversationTurnId.1.conversationId',
							turnId: '/~/agents/conversation/[conversationId]/turn/[turnId]:BlockheadAgentConversationTurn.ConversationTurnId.1.turnId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/~/agents/conversation/', requiredE2eRouteParam(params, '/~/agents/conversation/[conversationId=stringSegment]/(blockheadAgentConversation)/turn/[turnId=stringSegment]', 'conversationId'), '/turn/', requiredE2eRouteParam(params, '/~/agents/conversation/[conversationId=stringSegment]/(blockheadAgentConversation)/turn/[turnId=stringSegment]', 'turnId')].join(''),
	},
	'/~/dashboard/[dashboardId]': {
		nodeId: '/~/dashboard/[dashboardId]',
		probeOwnerNodeId: '/~/dashboard/[dashboardId]',
		routeId: '/~/dashboard/[dashboardId=stringSegment]',
		publicPath: '/~/dashboard/[dashboardId]',
		parameterMatchers: {
			dashboardId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'BlockheadPanelTree.Id',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							dashboardId: '/~/dashboard/[dashboardId]:BlockheadPanelTree.Id.1.dashboardId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/~/dashboard/', requiredE2eRouteParam(params, '/~/dashboard/[dashboardId=stringSegment]', 'dashboardId')].join(''),
	},
	'/~/manage/source/[sourceId]': {
		nodeId: '/~/manage/source/[sourceId]',
		probeOwnerNodeId: '/~/manage/source/[sourceId]',
		routeId: '/~/manage/source/[sourceId=stringSegment]',
		publicPath: '/~/manage/source/[sourceId]',
		parameterMatchers: {
			sourceId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'BlockheadSource.Id',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							sourceId: '/~/manage/source/[sourceId]:BlockheadSource.Id.1.sourceId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/~/manage/source/', requiredE2eRouteParam(params, '/~/manage/source/[sourceId=stringSegment]', 'sourceId')].join(''),
	},
	'/~/multiplayer/contact/[contactId]': {
		nodeId: '/~/multiplayer/contact/[contactId]',
		probeOwnerNodeId: '/~/multiplayer/contact/[contactId]',
		routeId: '/~/multiplayer/contact/[contactId=stringSegment]',
		publicPath: '/~/multiplayer/contact/[contactId]',
		parameterMatchers: {
			contactId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'BlockheadRoomPeer.Id',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							contactId: '/~/multiplayer/contact/[contactId]:BlockheadRoomPeer.Id.1.contactId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/~/multiplayer/contact/', requiredE2eRouteParam(params, '/~/multiplayer/contact/[contactId=stringSegment]', 'contactId')].join(''),
	},
	'/~/multiplayer/room/[roomId]': {
		nodeId: '/~/multiplayer/room/[roomId]',
		probeOwnerNodeId: '/~/multiplayer/room/[roomId]',
		routeId: '/~/multiplayer/room/[roomId=stringSegment]',
		publicPath: '/~/multiplayer/room/[roomId]',
		parameterMatchers: {
			roomId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'BlockheadRoom.Id',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							roomId: '/~/multiplayer/room/[roomId]:BlockheadRoom.Id.1.roomId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/~/multiplayer/room/', requiredE2eRouteParam(params, '/~/multiplayer/room/[roomId=stringSegment]', 'roomId')].join(''),
	},
	'/~/session/[sessionId]': {
		nodeId: '/~/session/[sessionId]',
		probeOwnerNodeId: '/~/session/[sessionId]',
		routeId: '/~/session/[sessionId=stringSegment]',
		publicPath: '/~/session/[sessionId]',
		parameterMatchers: {
			sessionId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'BlockheadSession.Id',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							sessionId: '/~/session/[sessionId]:BlockheadSession.Id.1.sessionId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/~/session/', requiredE2eRouteParam(params, '/~/session/[sessionId=stringSegment]', 'sessionId')].join(''),
	},
	'/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]': {
		nodeId: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]',
		probeOwnerNodeId: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]',
		routeId: '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]',
		publicPath: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]',
		parameterMatchers: {
			fromChainId: [
				'nonNegativeInteger',
			],
			toChainId: [
				'nonNegativeInteger',
			],
			fromToken: [
				'stringSegment',
			],
			toToken: [
				'stringSegment',
			],
			fromAmount: [
				'nonNegativeBigInt',
			],
			fromAddress: [
				'evmAddress',
			],
			slippage: [
				'nonNegativeNumber',
			],
			toAddress: [
				'evmAddress',
			],
		},
		mappings: [
			{
				id: 'BridgeRoute.Quote',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							fromChainId: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]:BridgeRoute.Quote.1.fromChainId',
							toChainId: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]:BridgeRoute.Quote.1.toChainId',
							fromToken: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]:BridgeRoute.Quote.1.fromToken',
							toToken: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]:BridgeRoute.Quote.1.toToken',
							fromAmount: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]:BridgeRoute.Quote.1.fromAmount',
							fromAddress: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]:BridgeRoute.Quote.1.fromAddress',
							slippage: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]:BridgeRoute.Quote.1.slippage',
							toAddress: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]:BridgeRoute.Quote.1.toAddress',
						},
					},
				],
			},
		],
		resolve: (params) => ['/bridge/route/', requiredE2eRouteParam(params, '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]', 'fromChainId'), '/', requiredE2eRouteParam(params, '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]', 'toChainId'), '/', requiredE2eRouteParam(params, '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]', 'fromToken'), '/', requiredE2eRouteParam(params, '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]', 'toToken'), '/', requiredE2eRouteParam(params, '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]', 'fromAmount'), '/', requiredE2eRouteParam(params, '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]', 'fromAddress'), '/', requiredE2eRouteParam(params, '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]', 'slippage'), '/', requiredE2eRouteParam(params, '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]', 'toAddress')].join(''),
	},
	'/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex]': {
		nodeId: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex]',
		probeOwnerNodeId: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex]',
		routeId: '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]/(bridgeRoute)/step/[stepIndex=bridgeRouteStepIndex]',
		publicPath: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex]',
		parameterMatchers: {
			fromChainId: [
				'nonNegativeInteger',
			],
			toChainId: [
				'nonNegativeInteger',
			],
			fromToken: [
				'stringSegment',
			],
			toToken: [
				'stringSegment',
			],
			fromAmount: [
				'nonNegativeBigInt',
			],
			fromAddress: [
				'evmAddress',
			],
			slippage: [
				'nonNegativeNumber',
			],
			toAddress: [
				'evmAddress',
			],
			stepIndex: [
				'bridgeRouteStepIndex',
			],
		},
		mappings: [
			{
				id: 'BridgeRouteStep.RouteIndexInRoute',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							fromChainId: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex]:BridgeRouteStep.RouteIndexInRoute.1.fromChainId',
							toChainId: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex]:BridgeRouteStep.RouteIndexInRoute.1.toChainId',
							fromToken: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex]:BridgeRouteStep.RouteIndexInRoute.1.fromToken',
							toToken: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex]:BridgeRouteStep.RouteIndexInRoute.1.toToken',
							fromAmount: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex]:BridgeRouteStep.RouteIndexInRoute.1.fromAmount',
							fromAddress: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex]:BridgeRouteStep.RouteIndexInRoute.1.fromAddress',
							slippage: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex]:BridgeRouteStep.RouteIndexInRoute.1.slippage',
							toAddress: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex]:BridgeRouteStep.RouteIndexInRoute.1.toAddress',
							stepIndex: '/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex]:BridgeRouteStep.RouteIndexInRoute.1.stepIndex',
						},
					},
				],
			},
		],
		resolve: (params) => ['/bridge/route/', requiredE2eRouteParam(params, '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]/(bridgeRoute)/step/[stepIndex=bridgeRouteStepIndex]', 'fromChainId'), '/', requiredE2eRouteParam(params, '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]/(bridgeRoute)/step/[stepIndex=bridgeRouteStepIndex]', 'toChainId'), '/', requiredE2eRouteParam(params, '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]/(bridgeRoute)/step/[stepIndex=bridgeRouteStepIndex]', 'fromToken'), '/', requiredE2eRouteParam(params, '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]/(bridgeRoute)/step/[stepIndex=bridgeRouteStepIndex]', 'toToken'), '/', requiredE2eRouteParam(params, '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]/(bridgeRoute)/step/[stepIndex=bridgeRouteStepIndex]', 'fromAmount'), '/', requiredE2eRouteParam(params, '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]/(bridgeRoute)/step/[stepIndex=bridgeRouteStepIndex]', 'fromAddress'), '/', requiredE2eRouteParam(params, '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]/(bridgeRoute)/step/[stepIndex=bridgeRouteStepIndex]', 'slippage'), '/', requiredE2eRouteParam(params, '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]/(bridgeRoute)/step/[stepIndex=bridgeRouteStepIndex]', 'toAddress'), '/step/', requiredE2eRouteParam(params, '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]/(bridgeRoute)/step/[stepIndex=bridgeRouteStepIndex]', 'stepIndex')].join(''),
	},
	'/channel/[channelId]': {
		nodeId: '/channel/[channelId]',
		probeOwnerNodeId: '/channel/[channelId]',
		routeId: '/channel/[channelId=stringSegment]',
		publicPath: '/channel/[channelId]',
		parameterMatchers: {
			channelId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'BlockheadStateChannel.Id',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							channelId: '/channel/[channelId]:BlockheadStateChannel.Id.1.channelId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/channel/', requiredE2eRouteParam(params, '/channel/[channelId=stringSegment]', 'channelId')].join(''),
	},
	'/services/agent/[chainId]/[contractAddress]/[tokenId]': {
		nodeId: '/services/agent/[chainId]/[contractAddress]/[tokenId]',
		probeOwnerNodeId: '/services/agent/[chainId]/[contractAddress]/[tokenId]',
		routeId: '/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId=stringSegment]',
		publicPath: '/services/agent/[chainId]/[contractAddress]/[tokenId]',
		parameterMatchers: {
			chainId: [
				'eip155ChainId',
			],
			contractAddress: [
				'evmAddress',
			],
			tokenId: [
				'stringSegment',
			],
		},
		mappings: [
			{
				id: 'EvmNft.EvmContractTokenId',
				routeKind: 'detail',
				probeCases: [
					{
						id: 'default',
						params: {
							chainId: '/services/agent/[chainId]/[contractAddress]/[tokenId]:EvmNft.EvmContractTokenId.1.chainId',
							contractAddress: '/services/agent/[chainId]/[contractAddress]/[tokenId]:EvmNft.EvmContractTokenId.1.contractAddress',
							tokenId: '/services/agent/[chainId]/[contractAddress]/[tokenId]:EvmNft.EvmContractTokenId.1.tokenId',
						},
					},
				],
			},
		],
		resolve: (params) => ['/services/agent/', requiredE2eRouteParam(params, '/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId=stringSegment]', 'chainId'), '/', requiredE2eRouteParam(params, '/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId=stringSegment]', 'contractAddress'), '/', requiredE2eRouteParam(params, '/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId=stringSegment]', 'tokenId')].join(''),
	},
} as const satisfies Record<string, E2eRouteFixtureMetadata>

type E2eRouteProbeAtomFromParams<_Params> = _Params extends Readonly<Record<string, string>> ? _Params[keyof _Params] : never

export type E2eRouteProbeAtom = E2eRouteProbeAtomFromParams<(typeof e2eRouteFixtureMetadataByNodeId)[keyof typeof e2eRouteFixtureMetadataByNodeId]['mappings'][number]['probeCases'][number]['params']>

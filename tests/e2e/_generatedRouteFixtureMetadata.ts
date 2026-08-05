// Generated from APP.ts.

import { match as matchAbsoluteUrl } from '$/params/absoluteUrl.ts'
import { match as matchBridgeRouteStepIndex } from '$/params/bridgeRouteStepIndex.ts'
import { match as matchEip155ChainId } from '$/params/eip155ChainId.ts'
import { match as matchEvmAddress } from '$/params/evmAddress.ts'
import { match as matchEvmTopicHash } from '$/params/evmTopicHash.ts'
import { match as matchEvmTxHash } from '$/params/evmTxHash.ts'
import { match as matchEvmTxHashOrSolanaSignatureOrUtxoTxId } from '$/params/evmTxHashOrSolanaSignatureOrUtxoTxId.ts'
import { match as matchFarcasterFid } from '$/params/farcasterFid.ts'
import { match as matchIpfsNamespace } from '$/params/ipfsNamespace.ts'
import { match as matchIso4217 } from '$/params/iso4217.ts'
import { match as matchMarketVenueId } from '$/params/marketVenueId.ts'
import { match as matchNativeCurrencySlugOrEvmAddress } from '$/params/nativeCurrencySlugOrEvmAddress.ts'
import { match as matchNetworkCaip2 } from '$/params/networkCaip2.ts'
import { match as matchNetworkCaip2OrNetworkSlug } from '$/params/networkCaip2OrNetworkSlug.ts'
import { match as matchNonNegativeBigInt } from '$/params/nonNegativeBigInt.ts'
import { match as matchNonNegativeInteger } from '$/params/nonNegativeInteger.ts'
import { match as matchNonNegativeIntegerOrSolanaPubkey } from '$/params/nonNegativeIntegerOrSolanaPubkey.ts'
import { match as matchNonNegativeNumber } from '$/params/nonNegativeNumber.ts'
import { match as matchProposalKindSlug } from '$/params/proposalKindSlug.ts'
import { match as matchProposalRef } from '$/params/proposalRef.ts'
import { match as matchRssItemIdentityKind } from '$/params/rssItemIdentityKind.ts'
import { match as matchSpecificationRealmSlug } from '$/params/specificationRealmSlug.ts'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import {
	match as matchStringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey,
} from '$/params/stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey.ts'
import { match as matchUserOperationHash } from '$/params/userOperationHash.ts'
import { match as matchZeroExHex } from '$/params/zeroExHex.ts'

export const matchE2eRouteParam = (matcher: string, value: string) => {
	switch (matcher) {
		case 'iso4217': return matchIso4217(value)
		case 'nonNegativeInteger': return matchNonNegativeInteger(value)
		case 'stringSegment': return matchStringSegment(value)
		case 'marketVenueId': return matchMarketVenueId(value)
		case 'eip155ChainId': return matchEip155ChainId(value)
		case 'nativeCurrencySlugOrEvmAddress': return matchNativeCurrencySlugOrEvmAddress(value)
		case 'nonNegativeBigInt': return matchNonNegativeBigInt(value)
		case 'evmAddress': return matchEvmAddress(value)
		case 'ipfsNamespace': return matchIpfsNamespace(value)
		case 'networkCaip2OrNetworkSlug': return matchNetworkCaip2OrNetworkSlug(value)
		case 'stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey': return matchStringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey(value)
		case 'evmTxHash': return matchEvmTxHash(value)
		case 'evmTxHashOrSolanaSignatureOrUtxoTxId': return matchEvmTxHashOrSolanaSignatureOrUtxoTxId(value)
		case 'networkCaip2': return matchNetworkCaip2(value)
		case 'absoluteUrl': return matchAbsoluteUrl(value)
		case 'zeroExHex': return matchZeroExHex(value)
		case 'userOperationHash': return matchUserOperationHash(value)
		case 'nonNegativeIntegerOrSolanaPubkey': return matchNonNegativeIntegerOrSolanaPubkey(value)
		case 'evmTopicHash': return matchEvmTopicHash(value)
		case 'specificationRealmSlug': return matchSpecificationRealmSlug(value)
		case 'proposalKindSlug': return matchProposalKindSlug(value)
		case 'proposalRef': return matchProposalRef(value)
		case 'farcasterFid': return matchFarcasterFid(value)
		case 'rssItemIdentityKind': return matchRssItemIdentityKind(value)
		case 'nonNegativeNumber': return matchNonNegativeNumber(value)
		case 'bridgeRouteStepIndex': return matchBridgeRouteStepIndex(value)
		default: throw new Error(`Missing generated route matcher ${matcher}`)
	}
}

export type E2eRouteFixtureMapping = {
	id: string
	projectionEntity?: string
	probeCaseId?: string
	probeAtomPrefixes: readonly string[]
	probeCases: readonly (readonly (readonly [prefixIndex: number, caseNumber: string, fields: readonly string[]])[])[]
	projectionPath?: readonly [string, ...string[]]
	boundaryLiveOptional?: true
}

export type E2eRouteFixtureMetadata = {
	routeId: string
	parameterEncodingByName?: Readonly<Record<string, 'Opaque' | 'Path'>>
	mappings: readonly E2eRouteFixtureMapping[]
	boundaryLiveOptional?: true
}

export const e2eRouteFixtureMetadataByNodeId = {
	'/(assets)/(currencies)/currency/[iso4217]': {
		routeId: '/(assets)/(currencies)/currency/[iso4217=iso4217]',
		mappings: [
			{
				id: 'Currency.Iso4217',
				probeAtomPrefixes: ['/currency/[iso4217]:Currency.Iso4217'],
				probeCases: [[[0, '1', ['iso4217']]]],
			},
		],
	},
	'/(assets)/(currencies)/currency/[iso4217]/observations/[timestampMs]': {
		routeId: '/(assets)/(currencies)/currency/[iso4217=iso4217]/(currency)/observations/[timestampMs=nonNegativeInteger]',
		mappings: [
			{
				id: 'Currency_Timestamp.CurrencyTimestampMs',
				probeAtomPrefixes: ['/currency/[iso4217]/observations/[timestampMs]:Currency_Timestamp.CurrencyTimestampMs'],
				probeCases: [[[0, '1', ['timestampMs', 'iso4217']]]],
			},
		],
	},
	'/(assets)/(marketAssets)/market-asset/[kind]/[assetKey]': {
		routeId: '/(assets)/(marketAssets)/market-asset/[kind=stringSegment]/[assetKey=stringSegment]',
		mappings: [
			{
				id: 'MarketAsset.KindAssetKey',
				probeAtomPrefixes: ['/market-asset/[kind]/[assetKey]:MarketAsset.KindAssetKey'],
				probeCases: [[[0, '1', ['kind', 'assetKey']]]],
			},
		],
	},
	'/(assets)/(marketVenues)/market-venue/[marketVenueId]': {
		routeId: '/(assets)/(marketVenues)/market-venue/[marketVenueId=marketVenueId]',
		mappings: [
			{
				id: 'MarketVenue.MarketVenueId',
				probeAtomPrefixes: ['/market-venue/[marketVenueId]:MarketVenue.MarketVenueId'],
				probeCases: [[[0, '1', ['marketVenueId']]]],
			},
		],
	},
	'/(assets)/bridge-capability/[fromChainId]/[fromCoinInstanceSlug]/[toChainId]/[toCoinInstanceSlug]/[toolKey]': {
		routeId: '/(assets)/bridge-capability/[fromChainId=eip155ChainId]/[fromCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toChainId=eip155ChainId]/[toCoinInstanceSlug=nativeCurrencySlugOrEvmAddress]/[toolKey=stringSegment]',
		mappings: [
			{
				id: 'CoinBridgeCapability.EvmCoinInstanceEvmCoinInstanceToolKey',
				probeAtomPrefixes: ['/bridge-capability/[fromChainId]/[fromCoinInstanceSlug]/[toChainId]/[toCoinInstanceSlug]/[toolKey]:CoinBridgeCapability.EvmCoinInstanceEvmCoinInstanceToolKey'],
				probeCases: [[[0, '1', ['toolKey', 'fromChainId', 'fromCoinInstanceSlug', 'toChainId', 'toCoinInstanceSlug']]]],
			},
		],
	},
	'/(assets)/coin-instance/[chainId]/[coinInstanceSlug]': {
		routeId: '/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]',
		mappings: [
			{
				id: 'EvmCoinInstance.NetworkType',
				projectionEntity: 'EvmCoinInstance',
				probeAtomPrefixes: ['/coin-instance/[chainId]/[coinInstanceSlug]:EvmCoinInstance.NetworkType'],
				probeCases: [[[0, '1', ['chainId', 'coinInstanceSlug']]]],
				projectionPath: [
					'NativeCurrency',
				],
			},
			{
				id: 'EvmCoinInstance.NetworkTypeContract',
				projectionEntity: 'EvmCoinInstance',
				probeAtomPrefixes: ['/coin-instance/[chainId]/[coinInstanceSlug]:EvmCoinInstance.NetworkTypeContract'],
				probeCases: [[[0, '1', ['coinInstanceSlug', 'chainId']]]],
				projectionPath: [
					'Erc20Token',
				],
			},
		],
	},
	'/(assets)/coin/[coinId]': {
		routeId: '/(assets)/coin/[coinId=stringSegment]',
		mappings: [
			{
				id: 'Coin.CoinId',
				probeAtomPrefixes: ['/coin/[coinId]:Coin.CoinId'],
				probeCases: [[[0, '1', ['coinId']]]],
			},
		],
	},
	'/(assets)/coin/[coinId]/observations/[timestampMs]/[source]': {
		routeId: '/(assets)/coin/[coinId=stringSegment]/(coin)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'Coin_Timestamp.CoinTimestampMsSource',
				probeAtomPrefixes: ['/coin/[coinId]/observations/[timestampMs]/[source]:Coin_Timestamp.CoinTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'coinId']]]],
			},
		],
	},
	'/(assets)/pool/[chainId]/[poolId]': {
		routeId: '/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]',
		mappings: [
			{
				id: 'LiquidityPool.EvmNetworkId',
				probeAtomPrefixes: ['/pool/[chainId]/[poolId]:LiquidityPool.EvmNetworkId'],
				probeCases: [[[0, '1', ['poolId', 'chainId']]]],
			},
		],
	},
	'/(assets)/pool/[chainId]/[poolId]/block/[blockNumber]': {
		routeId: '/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/block/[blockNumber=nonNegativeBigInt]',
		mappings: [
			{
				id: 'LiquidityPool_Block.LiquidityPoolBlockNumber',
				probeAtomPrefixes: ['/pool/[chainId]/[poolId]/block/[blockNumber]:LiquidityPool_Block.LiquidityPoolBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'chainId', 'poolId']]]],
			},
		],
	},
	'/(assets)/pool/[chainId]/[poolId]/observations/[timestampMs]/[feedKey]': {
		routeId: '/(assets)/pool/[chainId=eip155ChainId]/[poolId=stringSegment]/(liquidityPool)/observations/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]',
		parameterEncodingByName: {
			feedKey: 'Opaque',
		},
		mappings: [
			{
				id: 'LiquidityPool_Timestamp.LiquidityPoolTimestampMsFeedKey',
				probeAtomPrefixes: ['/pool/[chainId]/[poolId]/observations/[timestampMs]/[feedKey]:LiquidityPool_Timestamp.LiquidityPoolTimestampMsFeedKey'],
				probeCases: [[[0, '1', ['timestampMs', 'feedKey', 'chainId', 'poolId']]]],
			},
		],
	},
	'/(assets)/uniswap-v3/pool/[chainId]/[poolAddress]': {
		routeId: '/(assets)/uniswap-v3/pool/[chainId=eip155ChainId]/[poolAddress=evmAddress]',
		mappings: [
			{
				id: 'UniswapV3Pool.NetworkPoolAddress',
				probeAtomPrefixes: ['/uniswap-v3/pool/[chainId]/[poolAddress]:UniswapV3Pool.NetworkPoolAddress'],
				probeCases: [[[0, '1', ['poolAddress', 'chainId']]]],
			},
		],
	},
	'/(assets)/uniswap-v3/pool/[chainId]/[poolAddress]/block/[blockNumber]': {
		routeId: '/(assets)/uniswap-v3/pool/[chainId=eip155ChainId]/[poolAddress=evmAddress]/(uniswapV3Pool)/block/[blockNumber=nonNegativeBigInt]',
		mappings: [
			{
				id: 'UniswapV3Pool_Block.PoolBlockNumber',
				probeAtomPrefixes: ['/uniswap-v3/pool/[chainId]/[poolAddress]/block/[blockNumber]:UniswapV3Pool_Block.PoolBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'chainId', 'poolAddress']]]],
			},
		],
	},
	'/(assets)/uniswap-v3/position/[positionManager]/[tokenId]': {
		routeId: '/(assets)/uniswap-v3/position/[positionManager=evmAddress]/[tokenId=nonNegativeBigInt]',
		mappings: [
			{
				id: 'UniswapV3Position.PositionManagerTokenId',
				probeAtomPrefixes: ['/uniswap-v3/position/[positionManager]/[tokenId]:UniswapV3Position.PositionManagerTokenId'],
				probeCases: [[[0, '1', ['positionManager', 'tokenId']]]],
			},
		],
	},
	'/(assets)/uniswap-v3/position/[positionManager]/[tokenId]/block/[blockNumber]': {
		routeId: '/(assets)/uniswap-v3/position/[positionManager=evmAddress]/[tokenId=nonNegativeBigInt]/(uniswapV3Position)/block/[blockNumber=nonNegativeBigInt]',
		mappings: [
			{
				id: 'UniswapV3Position_Block.PositionBlockNumber',
				probeAtomPrefixes: ['/uniswap-v3/position/[positionManager]/[tokenId]/block/[blockNumber]:UniswapV3Position_Block.PositionBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'positionManager', 'tokenId']]]],
			},
		],
	},
	'/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]': {
		routeId: '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]',
		mappings: [
			{
				id: 'Market.BaseQuoteMarketVenueKind',
				probeAtomPrefixes: ['/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]:Market.BaseQuoteMarketVenueKind'],
				probeCases: [[[0, '1', ['marketKind', 'base', 'quote', 'marketVenue', 'baseKind', 'quoteKind']]]],
			},
		],
	},
	'/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]': {
		routeId: '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/candles/[timeIntervalUnit=stringSegment]/[timeIntervalValue=nonNegativeInteger]/[timestampMs=nonNegativeInteger]',
		mappings: [
			{
				id: 'Market_TimeInterval_Timestamp.MarketTimeIntervalTimestampMs',
				probeAtomPrefixes: ['/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/candles/[timeIntervalUnit]/[timeIntervalValue]/[timestampMs]:Market_TimeInterval_Timestamp.MarketTimeIntervalTimestampMs'],
				probeCases: [[[0, '1', ['timestampMs', 'timeIntervalUnit', 'timeIntervalValue', 'marketKind', 'base', 'quote', 'marketVenue', 'baseKind', 'quoteKind']]]],
			},
		],
	},
	'/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs]/[feedKey]': {
		routeId: '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/derivatives/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]',
		parameterEncodingByName: {
			feedKey: 'Opaque',
		},
		mappings: [
			{
				id: 'Market_Derivative_Timestamp.MarketTimestampMsFeedKey',
				probeAtomPrefixes: ['/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/derivatives/[timestampMs]/[feedKey]:Market_Derivative_Timestamp.MarketTimestampMsFeedKey'],
				probeCases: [[[0, '1', ['timestampMs', 'feedKey', 'marketKind', 'base', 'quote', 'marketVenue', 'baseKind', 'quoteKind']]]],
			},
		],
	},
	'/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price': {
		routeId: '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price',
		mappings: [
			{
				id: 'MarketPrice.Market',
				probeAtomPrefixes: ['/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price:MarketPrice.Market'],
				probeCases: [[[0, '1', ['marketKind', 'base', 'quote', 'marketVenue', 'baseKind', 'quoteKind']]]],
			},
		],
	},
	'/(assets)/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs]/[feedKey]': {
		routeId: '/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]/(market)/price/(marketPrice)/quotes/[timestampMs=nonNegativeInteger]/[feedKey=stringSegment]',
		parameterEncodingByName: {
			feedKey: 'Opaque',
		},
		mappings: [
			{
				id: 'Market_Timestamp.MarketTimestampMsFeedKey',
				probeAtomPrefixes: ['/venue/[marketVenue]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]/price/quotes/[timestampMs]/[feedKey]:Market_Timestamp.MarketTimestampMsFeedKey'],
				probeCases: [[[0, '1', ['timestampMs', 'feedKey', 'marketKind', 'base', 'quote', 'marketVenue', 'baseKind', 'quoteKind']]]],
			},
		],
	},
	'/(explore)/(ens)/ens/name/[ensName]': {
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]',
		parameterEncodingByName: {
			ensName: 'Opaque',
		},
		mappings: [
			{
				id: 'EnsName.NormalizedName',
				probeAtomPrefixes: ['/ens/name/[ensName]:EnsName.NormalizedName'],
				probeCases: [[[0, '1', ['ensName']]]],
			},
		],
	},
	'/(explore)/(ens)/ens/name/[ensName]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			ensName: 'Opaque',
		},
		mappings: [
			{
				id: 'EnsName_Timestamp.NameTimestampMsSource',
				probeAtomPrefixes: ['/ens/name/[ensName]/observations/[timestampMs]/[source]:EnsName_Timestamp.NameTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'ensName']]]],
			},
		],
	},
	'/(explore)/(ens)/ens/name/[ensName]/record/[recordId]': {
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/record/[recordId=stringSegment]',
		parameterEncodingByName: {
			ensName: 'Opaque',
			recordId: 'Opaque',
		},
		mappings: [
			{
				id: 'EnsRecord.NameRecordKey',
				probeAtomPrefixes: ['/ens/name/[ensName]/record/[recordId]:EnsRecord.NameRecordKey'],
				probeCases: [[[0, '1', ['recordId', 'ensName']]]],
			},
		],
	},
	'/(explore)/(ens)/ens/name/[ensName]/record/[recordId]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/record/[recordId=stringSegment]/(ensRecord)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			ensName: 'Opaque',
			recordId: 'Opaque',
		},
		mappings: [
			{
				id: 'EnsRecord_Timestamp.RecordTimestampMsSource',
				probeAtomPrefixes: ['/ens/name/[ensName]/record/[recordId]/observations/[timestampMs]/[source]:EnsRecord_Timestamp.RecordTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'ensName', 'recordId']]]],
			},
		],
	},
	'/(explore)/(ens)/ens/name/[ensName]/records': {
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/records',
		parameterEncodingByName: {
			ensName: 'Opaque',
		},
		mappings: [
			{
				id: 'EnsName.NormalizedName',
				probeAtomPrefixes: ['/ens/name/[ensName]:EnsName.NormalizedName'],
				probeCases: [[[0, '1', ['ensName']]]],
			},
		],
	},
	'/(explore)/(ens)/ens/name/[ensName]/resolver': {
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/resolver',
		parameterEncodingByName: {
			ensName: 'Opaque',
		},
		mappings: [
			{
				id: 'EnsName.NormalizedName',
				probeAtomPrefixes: ['/ens/name/[ensName]:EnsName.NormalizedName'],
				probeCases: [[[0, '1', ['ensName']]]],
			},
		],
	},
	'/(explore)/(ens)/ens/name/[ensName]/resolves-to': {
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/resolves-to',
		parameterEncodingByName: {
			ensName: 'Opaque',
		},
		mappings: [
			{
				id: 'EnsName.NormalizedName',
				probeAtomPrefixes: ['/ens/name/[ensName]:EnsName.NormalizedName'],
				probeCases: [[[0, '1', ['ensName']]]],
			},
		],
	},
	'/(explore)/(ens)/ens/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(ens)/ens/(globalEnsNetwork)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: '_GlobalEnsNetwork_Timestamp.HubTimestampMsSource',
				probeAtomPrefixes: ['/ens/observations/[timestampMs]/[source]:_GlobalEnsNetwork_Timestamp.HubTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source']]]],
			},
		],
	},
	'/(explore)/(ipfs)/[namespace]/[target]': {
		routeId: '/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]',
		mappings: [
			{
				id: 'IpfsResource.ResourceAddress',
				probeAtomPrefixes: ['/[namespace]/[target]:IpfsResource.ResourceAddress'],
				probeCases: [[[0, '1', ['namespace', 'target']]]],
			},
		],
	},
	'/(explore)/(ipfs)/[namespace]/[target]/path/[...contentPath]': {
		routeId: '/(explore)/(ipfs)/[namespace=ipfsNamespace]/[target=stringSegment]/path/[...contentPath=stringSegment]',
		mappings: [
			{
				id: 'IpfsResource.ResourceAddress',
				probeCaseId: 'path',
				probeAtomPrefixes: ['/[namespace]/[target]:IpfsResource.ResourceAddress', '/[namespace]/[target]/path/[...contentPath]:IpfsResource.ResourceAddress.path'],
				probeCases: [[[0, '1', ['namespace', 'target']], [1, '1', ['contentPath']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]',
		mappings: [
			{
				id: 'AptosAccount.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:AptosAccount.NetworkAddress'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Aptos',
				],
			},
			{
				id: 'PolkadotAccount.NetworkAccountId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:PolkadotAccount.NetworkAccountId'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
			{
				id: 'CosmosAccount.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:CosmosAccount.NetworkAddress'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
			{
				id: 'HederaAccount.NetworkAccountId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:HederaAccount.NetworkAccountId'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Hedera',
				],
			},
			{
				id: 'CardanoAddress.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:CardanoAddress.NetworkAddress'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'EvmNetworkAccount.EvmNetworkEvmAccount',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:EvmNetworkAccount.EvmNetworkEvmAccount'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaAccount.NetworkPubkey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:SolanaAccount.NetworkPubkey'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'StarknetContract.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:StarknetContract.NetworkAddress'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Starknet',
				],
			},
			{
				id: 'TronAccount.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:TronAccount.NetworkAddress'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Tron',
				],
			},
			{
				id: 'TonAccount.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:TonAccount.NetworkAddress'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Ton',
				],
			},
			{
				id: 'XrplAccount.NetworkAccount',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]:XrplAccount.NetworkAccount'],
				probeCases: [[[0, '1', ['accountId', 'network']]]],
				projectionPath: [
					'Xrpl',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(accounts)/account/[accountId]/observation/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'PolkadotAccount_Timestamp.AccountTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/account/[accountId]/observation/[timestampMs]/[source]:PolkadotAccount_Timestamp.AccountTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'accountId', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blobs)/blob/[transactionId]/[indexInTransaction]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blobs)/blob/[transactionId=evmTxHash]/[indexInTransaction=nonNegativeInteger]',
		mappings: [
			{
				id: 'EvmBlob.TransactionIndexInTransaction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/blob/[transactionId]/[indexInTransaction]:EvmBlob.TransactionIndexInTransaction'],
				probeCases: [[[0, '1', ['transactionId', 'indexInTransaction', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
		mappings: [
			{
				id: 'EvmBlock.EvmNetworkBlockNumber',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:EvmBlock.EvmNetworkBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaBlock.Slot',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:SolanaBlock.Slot'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'UtxoBlock.NetworkHeight',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:UtxoBlock.NetworkHeight'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
			{
				id: 'PolkadotBlock.NetworkBlockNumber',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:PolkadotBlock.NetworkBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]',
		mappings: [
			{
				id: 'PolkadotBlock.NetworkBlockNumberHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/[hash]:PolkadotBlock.NetworkBlockNumberHash'],
				probeCases: [[[0, '1', ['blockNumber', 'hash', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
			{
				id: 'UtxoBlock.NetworkHeightHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/[hash]:UtxoBlock.NetworkHeightHash'],
				probeCases: [[[0, '1', ['blockNumber', 'hash', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]/event/[eventIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]/(selection)/event/[eventIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'PolkadotEvent.BlockIndexInBlock',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/[hash]/event/[eventIndex]:PolkadotEvent.BlockIndexInBlock'],
				probeCases: [[[0, '1', ['eventIndex', 'blockNumber', 'hash', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/[hash]/extrinsic/[extrinsicIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]/(selection)/extrinsic/[extrinsicIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'PolkadotExtrinsic.BlockIndexInBlock',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]/[hash]/extrinsic/[extrinsicIndex]:PolkadotExtrinsic.BlockIndexInBlock'],
				probeCases: [[[0, '1', ['extrinsicIndex', 'blockNumber', 'hash', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]/transactions': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/transactions',
		mappings: [
			{
				id: 'EvmBlock.EvmNetworkBlockNumber',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:EvmBlock.EvmNetworkBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaBlock.Slot',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:SolanaBlock.Slot'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'UtxoBlock.NetworkHeight',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:UtxoBlock.NetworkHeight'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
			{
				id: 'PolkadotBlock.NetworkBlockNumber',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/block/[blockNumber]:PolkadotBlock.NetworkBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(contracts)/contract/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddress]',
		mappings: [
			{
				id: 'EvmContract.EvmNetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/[address]:EvmContract.EvmNetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(contracts)/contract/[address]/verification': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddress]/(evmContract)/verification',
		mappings: [
			{
				id: 'EvmContractVerification.EvmContract',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/contract/[address]/verification:EvmContractVerification.EvmContract'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]',
		mappings: [
			{
				id: 'EvmTransaction.EvmNetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:EvmTransaction.EvmNetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaTransaction.NetworkSignature',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:SolanaTransaction.NetworkSignature'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'CardanoTransaction.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:CardanoTransaction.NetworkHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'UtxoTransaction.NetworkTxId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:UtxoTransaction.NetworkTxId'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/input/[inputIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/input/[inputIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'CardanoTxInput.TransactionInputIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/input/[inputIndex]:CardanoTxInput.TransactionInputIndex'],
				probeCases: [[[0, '1', ['inputIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'UtxoInput.TransactionIndexInTransaction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/input/[inputIndex]:UtxoInput.TransactionIndexInTransaction'],
				probeCases: [[[0, '1', ['inputIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/inputs': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/inputs',
		mappings: [
			{
				id: 'EvmTransaction.EvmNetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:EvmTransaction.EvmNetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaTransaction.NetworkSignature',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:SolanaTransaction.NetworkSignature'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'CardanoTransaction.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:CardanoTransaction.NetworkHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'UtxoTransaction.NetworkTxId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:UtxoTransaction.NetworkTxId'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]',
		mappings: [
			{
				id: 'SolanaInstruction.SolanaTransactionIndexInTransaction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]:SolanaInstruction.SolanaTransactionIndexInTransaction'],
				probeCases: [[[0, '1', ['instructionKind', 'indexInTransaction', 'transactionId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]/inner/[indexInInstruction]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/(solanaInstruction)/inner/[indexInInstruction=nonNegativeInteger]',
		mappings: [
			{
				id: 'SolanaInstruction.SolanaTransactionIndexInInstruction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/instruction/[instructionKind]/[indexInTransaction]/inner/[indexInInstruction]:SolanaInstruction.SolanaTransactionIndexInInstruction'],
				probeCases: [[[0, '1', ['instructionKind', 'indexInTransaction', 'indexInInstruction', 'transactionId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/internal-transfer/[indexInTransaction]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/internal-transfer/[indexInTransaction=nonNegativeInteger]',
		mappings: [
			{
				id: 'EvmInternalTransfer.TransactionIndexInTransaction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/internal-transfer/[indexInTransaction]:EvmInternalTransfer.TransactionIndexInTransaction'],
				probeCases: [[[0, '1', ['indexInTransaction', 'transactionId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/log/[indexInTransaction]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/log/[indexInTransaction=nonNegativeInteger]',
		mappings: [
			{
				id: 'EvmLog.TransactionIndexInTransaction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/log/[indexInTransaction]:EvmLog.TransactionIndexInTransaction'],
				probeCases: [[[0, '1', ['indexInTransaction', 'transactionId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/log/[indexInTransaction]/token-transfer/[transferIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/log/[indexInTransaction=nonNegativeInteger]/(evmLog)/token-transfer/[transferIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'EvmTokenTransfer.LogIndexInLog',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/log/[indexInTransaction]/token-transfer/[transferIndex]:EvmTokenTransfer.LogIndexInLog'],
				probeCases: [[[0, '1', ['transferIndex', 'indexInTransaction', 'transactionId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/output/[outputIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/output/[outputIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'CardanoTxOutput.TransactionOutputIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/output/[outputIndex]:CardanoTxOutput.TransactionOutputIndex'],
				probeCases: [[[0, '1', ['outputIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'UtxoOutput.TransactionIndexInTransaction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/output/[outputIndex]:UtxoOutput.TransactionIndexInTransaction'],
				probeCases: [[[0, '1', ['outputIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/outputs': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/outputs',
		mappings: [
			{
				id: 'EvmTransaction.EvmNetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:EvmTransaction.EvmNetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaTransaction.NetworkSignature',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:SolanaTransaction.NetworkSignature'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'CardanoTransaction.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:CardanoTransaction.NetworkHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'UtxoTransaction.NetworkTxId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:UtxoTransaction.NetworkTxId'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/shielded-action/[pool]/[actionKind]/[actionIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'ZcashShieldedAction.TransactionPoolActionKindIndexInTransaction',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]/shielded-action/[pool]/[actionKind]/[actionIndex]:ZcashShieldedAction.TransactionPoolActionKindIndexInTransaction'],
				probeCases: [[[0, '1', ['pool', 'actionKind', 'actionIndex', 'transactionId', 'network']]]],
				projectionPath: [
					'Zcash',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]/shielded-actions': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/shielded-actions',
		mappings: [
			{
				id: 'EvmTransaction.EvmNetworkTxHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:EvmTransaction.EvmNetworkTxHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaTransaction.NetworkSignature',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:SolanaTransaction.NetworkSignature'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
			{
				id: 'CardanoTransaction.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:CardanoTransaction.NetworkHash'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
			{
				id: 'UtxoTransaction.NetworkTxId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/tx/[transactionId]:UtxoTransaction.NetworkTxId'],
				probeCases: [[[0, '1', ['transactionId', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(upgrades)/consensus/[upgradeSlug]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/consensus/[upgradeSlug=stringSegment]',
		mappings: [
			{
				id: 'EthereumConsensusUpgrade.EvmNetworkSlug',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/consensus/[upgradeSlug]:EthereumConsensusUpgrade.EvmNetworkSlug'],
				probeCases: [[[0, '1', ['upgradeSlug', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(upgrades)/execution/[upgradeSlug]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/execution/[upgradeSlug=stringSegment]',
		mappings: [
			{
				id: 'EthereumExecutionUpgrade.EvmNetworkSlug',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/execution/[upgradeSlug]:EthereumExecutionUpgrade.EvmNetworkSlug'],
				probeCases: [[[0, '1', ['upgradeSlug', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/(upgrades)/upgrade/[upgradeSlug]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(upgrades)/upgrade/[upgradeSlug=stringSegment]',
		mappings: [
			{
				id: 'EthereumNetworkUpgrade.EvmNetworkSlug',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/upgrade/[upgradeSlug]:EthereumNetworkUpgrade.EvmNetworkSlug'],
				probeCases: [[[0, '1', ['upgradeSlug', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/aave-market/[poolAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/aave-market/[poolAddress=evmAddress]',
		mappings: [
			{
				id: 'AaveMarket.NetworkPoolAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/aave-market/[poolAddress]:AaveMarket.NetworkPoolAddress'],
				probeCases: [[[0, '1', ['poolAddress', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/accounts': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/accounts',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/activity/day/[dayStartTimestampMs]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/activity/day/[dayStartTimestampMs=nonNegativeInteger]',
		mappings: [
			{
				id: 'Network_Activity_Day.NetworkDayStartTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/activity/day/[dayStartTimestampMs]:Network_Activity_Day.NetworkDayStartTimestampMsSource'],
				probeCases: [[[0, '1', ['dayStartTimestampMs', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/actor/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/actor/[address=stringSegment]',
		mappings: [
			{
				id: 'FilecoinActor.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/actor/[address]:FilecoinActor.NetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Filecoin',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/actor/[address]/observations/[height]/[tipsetKey]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/actor/[address=stringSegment]/(filecoinActor)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]',
		mappings: [
			{
				id: 'FilecoinActor_Timestamp.ActorHeightTipsetKeySource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/actor/[address]/observations/[height]/[tipsetKey]/[source]:FilecoinActor_Timestamp.ActorHeightTipsetKeySource'],
				probeCases: [[[0, '1', ['height', 'tipsetKey', 'source', 'address', 'network']]]],
				projectionPath: [
					'Filecoin',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/address/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]',
		mappings: [
			{
				id: 'UtxoAddress.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/address/[address]:UtxoAddress.NetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/address/[address]/observations': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]/(utxoAddress)/observations',
		mappings: [
			{
				id: 'UtxoAddress.NetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/address/[address]:UtxoAddress.NetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/address/[address]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/address/[address=stringSegment]/(utxoAddress)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'UtxoAddress_Timestamp.AddressTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/address/[address]/observations/[timestampMs]/[source]:UtxoAddress_Timestamp.AddressTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'address', 'network']]]],
				projectionPath: [
					'Utxo',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/amendment/[amendmentId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/amendment/[amendmentId=stringSegment]',
		mappings: [
			{
				id: 'XrplAmendment.NetworkAmendmentId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/amendment/[amendmentId]:XrplAmendment.NetworkAmendmentId'],
				probeCases: [[[0, '1', ['amendmentId', 'network']]]],
				projectionPath: [
					'Xrpl',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/amm/[ammAccount]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/amm/[ammAccount=stringSegment]',
		mappings: [
			{
				id: 'XrplAmm.NetworkAmmAccount',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/amm/[ammAccount]:XrplAmm.NetworkAmmAccount'],
				probeCases: [[[0, '1', ['ammAccount', 'network']]]],
				projectionPath: [
					'Xrpl',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/asset/[kind]/[assetKey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]',
		mappings: [
			{
				id: 'AssetInstance.NetworkKindAssetKey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/asset/[kind]/[assetKey]:AssetInstance.NetworkKindAssetKey'],
				probeCases: [[[0, '1', ['kind', 'assetKey', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/attestations': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/attestations',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/blobs': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/blobs',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/block-explorers': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/block-explorers',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/blocks': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/blocks',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/bridges': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/bridges',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/bridges/[toCaip2]/[url]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/bridges/[toCaip2=networkCaip2]/[url=absoluteUrl]',
		parameterEncodingByName: {
			url: 'Opaque',
		},
		mappings: [
			{
				id: 'EvmNetworkBridge.FromToUrl',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/bridges/[toCaip2]/[url]:EvmNetworkBridge.FromToUrl'],
				probeCases: [[[0, '1', ['toCaip2', 'url', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/channels': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/channels',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/channels/[channelId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/channels/[channelId=stringSegment]',
		mappings: [
			{
				id: 'LightningChannel.NetworkChannelId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/channels/[channelId]:LightningChannel.NetworkChannelId'],
				probeCases: [[[0, '1', ['channelId', 'network']]]],
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/committees': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/committees',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/contracts': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/contracts',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/deal/[dealId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/deal/[dealId=nonNegativeBigInt]',
		mappings: [
			{
				id: 'FilecoinDeal.NetworkDealId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/deal/[dealId]:FilecoinDeal.NetworkDealId'],
				probeCases: [[[0, '1', ['dealId', 'network']]]],
				projectionPath: [
					'Filecoin',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/drep/[drepCredential]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/drep/[drepCredential=stringSegment]',
		mappings: [
			{
				id: 'CardanoDRep.NetworkDrepCredential',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/drep/[drepCredential]:CardanoDRep.NetworkDrepCredential'],
				probeCases: [[[0, '1', ['drepCredential', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/epoch/[epoch]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/epoch/[epoch=nonNegativeInteger]',
		mappings: [
			{
				id: 'BeaconEpoch.EvmNetworkEpoch',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/epoch/[epoch]:BeaconEpoch.EvmNetworkEpoch'],
				probeCases: [[[0, '1', ['epoch', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/epochs': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/epochs',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-20-transfers': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-20-transfers',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/account-factories': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factories',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/account-factory/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]',
		mappings: [
			{
				id: 'Erc4337AccountFactory.EvmNetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/erc-4337/account-factory/[address]:Erc4337AccountFactory.EvmNetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/account-factory/[address]/observations': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]/(erc4337AccountFactory)/observations',
		mappings: [
			{
				id: 'Erc4337AccountFactory.EvmNetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/erc-4337/account-factory/[address]:Erc4337AccountFactory.EvmNetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/account-factory/[address]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/account-factory/[address=evmAddress]/(erc4337AccountFactory)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'Erc4337AccountFactory_Timestamp.FactoryTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/erc-4337/account-factory/[address]/observations/[timestampMs]/[source]:Erc4337AccountFactory_Timestamp.FactoryTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/bundler/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]',
		mappings: [
			{
				id: 'Erc4337Bundler.EvmNetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/erc-4337/bundler/[address]:Erc4337Bundler.EvmNetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/bundler/[address]/observations': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]/(erc4337Bundler)/observations',
		mappings: [
			{
				id: 'Erc4337Bundler.EvmNetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/erc-4337/bundler/[address]:Erc4337Bundler.EvmNetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/bundler/[address]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]/(erc4337Bundler)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'Erc4337Bundler_Timestamp.BundlerTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/erc-4337/bundler/[address]/observations/[timestampMs]/[source]:Erc4337Bundler_Timestamp.BundlerTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/bundlers': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundlers',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/paymaster/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymaster/[address=evmAddress]',
		mappings: [
			{
				id: 'Erc4337Paymaster.EvmNetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/erc-4337/paymaster/[address]:Erc4337Paymaster.EvmNetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/paymaster/[address]/observations': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymaster/[address=evmAddress]/(erc4337Paymaster)/observations',
		mappings: [
			{
				id: 'Erc4337Paymaster.EvmNetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/erc-4337/paymaster/[address]:Erc4337Paymaster.EvmNetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/paymaster/[address]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymaster/[address=evmAddress]/(erc4337Paymaster)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'Erc4337Paymaster_Timestamp.PaymasterTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/erc-4337/paymaster/[address]/observations/[timestampMs]/[source]:Erc4337Paymaster_Timestamp.PaymasterTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/paymasters': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymasters',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/smart-account/[address]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-account/[address=evmAddress]',
		mappings: [
			{
				id: 'Erc4337SmartAccount.EvmNetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/erc-4337/smart-account/[address]:Erc4337SmartAccount.EvmNetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/smart-account/[address]/observations': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-account/[address=evmAddress]/(erc4337SmartAccount)/observations',
		mappings: [
			{
				id: 'Erc4337SmartAccount.EvmNetworkAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/erc-4337/smart-account/[address]:Erc4337SmartAccount.EvmNetworkAddress'],
				probeCases: [[[0, '1', ['address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/smart-account/[address]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-account/[address=evmAddress]/(erc4337SmartAccount)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'Erc4337SmartAccount_Timestamp.AccountTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/erc-4337/smart-account/[address]/observations/[timestampMs]/[source]:Erc4337SmartAccount_Timestamp.AccountTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'address', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/smart-accounts': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-accounts',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/erc-4337/user-operations': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/user-operations',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/faucets': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/faucets',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/fee-market': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/fee-market',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/fee-market/block/[blockNumber]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/fee-market/block/[blockNumber=nonNegativeBigInt]',
		mappings: [
			{
				id: 'EvmNetwork_GasFee_Block.EvmNetworkBlockNumber',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/fee-market/block/[blockNumber]:EvmNetwork_GasFee_Block.EvmNetworkBlockNumber'],
				probeCases: [[[0, '1', ['blockNumber', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/finality': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/finality',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/finality/[timestampMs]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/finality/[timestampMs=nonNegativeInteger]',
		mappings: [
			{
				id: 'EthereumBeaconFinality_Timestamp.EvmNetworkTimestampMs',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/finality/[timestampMs]:EthereumBeaconFinality_Timestamp.EvmNetworkTimestampMs'],
				probeCases: [[[0, '1', ['timestampMs', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/gas-estimates': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/gas-estimates',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/gas-estimates/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/gas-estimates/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'EvmNetwork_GasEstimate_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/gas-estimates/[timestampMs]/[source]:EvmNetwork_GasEstimate_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/governance': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/governance/committee/epoch/[epoch]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/committee/epoch/[epoch=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'CardanoCommittee_Epoch.NetworkEpochSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/governance/committee/epoch/[epoch]/[source]:CardanoCommittee_Epoch.NetworkEpochSource'],
				probeCases: [[[0, '1', ['epoch', 'source', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/governance/proposal/[proposalTxHash]/[proposalIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/proposal/[proposalTxHash=stringSegment]/[proposalIndex=nonNegativeInteger]',
		mappings: [
			{
				id: 'CardanoGovernanceProposal.NetworkProposalTxHashProposalIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/governance/proposal/[proposalTxHash]/[proposalIndex]:CardanoGovernanceProposal.NetworkProposalTxHashProposalIndex'],
				probeCases: [[[0, '1', ['proposalTxHash', 'proposalIndex', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/invoices': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/invoices',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/invoices/[paymentHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/invoices/[paymentHash=stringSegment]',
		mappings: [
			{
				id: 'BlockheadLightningInvoice.NetworkPaymentHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/invoices/[paymentHash]:BlockheadLightningInvoice.NetworkPaymentHash'],
				probeCases: [[[0, '1', ['paymentHash', 'network']]]],
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/ledger/[ledgerIndex]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ledger/[ledgerIndex=nonNegativeBigInt]',
		mappings: [
			{
				id: 'XrplLedger.NetworkLedgerIndex',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/ledger/[ledgerIndex]:XrplLedger.NetworkLedgerIndex'],
				probeCases: [[[0, '1', ['ledgerIndex', 'network']]]],
				projectionPath: [
					'Xrpl',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mempool': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mempool',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mempool/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mempool/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'EvmNetwork_Txpool_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/mempool/[timestampMs]/[source]:EvmNetwork_Txpool_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/builder/[builderPubkey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builder/[builderPubkey=stringSegment]',
		mappings: [
			{
				id: 'MevBuilder.EvmNetworkBuilderPubkey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/mev/builder/[builderPubkey]:MevBuilder.EvmNetworkBuilderPubkey'],
				probeCases: [[[0, '1', ['builderPubkey', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/builder/[builderPubkey]/timestamp/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builder/[builderPubkey=stringSegment]/(mevBuilder)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'MevBuilder_Timestamp.BuilderTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/mev/builder/[builderPubkey]/timestamp/[timestampMs]/[source]:MevBuilder_Timestamp.BuilderTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'builderPubkey', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/builders': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/builders',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/payload/[relayHost]/[slot]/[blockHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/payload/[relayHost=stringSegment]/[slot=nonNegativeInteger]/[blockHash=zeroExHex]',
		mappings: [
			{
				id: 'MevRelay_ProposerPayloadDelivered.EvmNetworkRelayHostSlotBlockHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/mev/payload/[relayHost]/[slot]/[blockHash]:MevRelay_ProposerPayloadDelivered.EvmNetworkRelayHostSlotBlockHash'],
				probeCases: [[[0, '1', ['relayHost', 'slot', 'blockHash', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/payloads': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/payloads',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/relay/[host]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relay/[host=stringSegment]',
		mappings: [
			{
				id: 'MevRelay.EvmNetworkHost',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/mev/relay/[host]:MevRelay.EvmNetworkHost'],
				probeCases: [[[0, '1', ['host', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/relay/[host]/timestamp/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relay/[host=stringSegment]/(mevRelay)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'MevRelay_Timestamp.RelayTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/mev/relay/[host]/timestamp/[timestampMs]/[source]:MevRelay_Timestamp.RelayTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'host', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/mev/relays': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/mev/relays',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/miner/[minerAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]',
		mappings: [
			{
				id: 'FilecoinMiner.NetworkMinerAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/miner/[minerAddress]:FilecoinMiner.NetworkMinerAddress'],
				probeCases: [[[0, '1', ['minerAddress', 'network']]]],
				projectionPath: [
					'Filecoin',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/miner/[minerAddress]/observations/[height]/[tipsetKey]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/miner/[minerAddress=stringSegment]/(filecoinMiner)/observations/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]/[source=stringSegment]',
		mappings: [
			{
				id: 'FilecoinMiner_Timestamp.MinerHeightTipsetKeySource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/miner/[minerAddress]/observations/[height]/[tipsetKey]/[source]:FilecoinMiner_Timestamp.MinerHeightTipsetKeySource'],
				probeCases: [[[0, '1', ['height', 'tipsetKey', 'source', 'minerAddress', 'network']]]],
				projectionPath: [
					'Filecoin',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/morpho-market/[marketId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/morpho-market/[marketId=evmTxHash]',
		mappings: [
			{
				id: 'MorphoMarket.NetworkMarketId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/morpho-market/[marketId]:MorphoMarket.NetworkMarketId'],
				probeCases: [[[0, '1', ['marketId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/native-assets': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/native-assets',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/nft-transfers': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nft-transfers',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/nodes': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nodes',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/nodes/[pubkey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/nodes/[pubkey=stringSegment]',
		mappings: [
			{
				id: 'LightningNode.NetworkPublicKey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/nodes/[pubkey]:LightningNode.NetworkPublicKey'],
				probeCases: [[[0, '1', ['pubkey', 'network']]]],
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/observation/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'Network_Timestamp.NetworkTimestampMsSource',
				probeAtomPrefixes: ['/network/[network]/observation/[timestampMs]/[source]:Network_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/observations': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'EvmNetwork_Timestamp.NetworkTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/observations/[timestampMs]/[source]:EvmNetwork_Timestamp.NetworkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/osmosis-pool/[poolId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/osmosis-pool/[poolId=stringSegment]',
		mappings: [
			{
				id: 'OsmosisPool.NetworkPoolId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/osmosis-pool/[poolId]:OsmosisPool.NetworkPoolId'],
				probeCases: [[[0, '1', ['poolId', 'network']]]],
				projectionPath: [
					'Cosmos',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/pallet/[palletName]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/pallet/[palletName=stringSegment]',
		mappings: [
			{
				id: 'PolkadotPallet.NetworkPalletName',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/pallet/[palletName]:PolkadotPallet.NetworkPalletName'],
				probeCases: [[[0, '1', ['palletName', 'network']]]],
				projectionPath: [
					'Polkadot',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/payments': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/payments',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/payments/[paymentHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/payments/[paymentHash=stringSegment]',
		mappings: [
			{
				id: 'BlockheadLightningPayment.NetworkPaymentHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/payments/[paymentHash]:BlockheadLightningPayment.NetworkPaymentHash'],
				probeCases: [[[0, '1', ['paymentHash', 'network']]]],
				projectionPath: [
					'Lightning',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/perp-market/[coin]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/perp-market/[coin=stringSegment]',
		mappings: [
			{
				id: 'HyperliquidPerpMarket.NetworkCoin',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/perp-market/[coin]:HyperliquidPerpMarket.NetworkCoin'],
				probeCases: [[[0, '1', ['coin', 'network']]]],
				projectionPath: [
					'Hyperliquid',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/precompiles': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/precompiles',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/program/[programId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/program/[programId=stringSegment]',
		mappings: [
			{
				id: 'SolanaProgram.NetworkProgramId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/program/[programId]:SolanaProgram.NetworkProgramId'],
				probeCases: [[[0, '1', ['programId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/programs': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/programs',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/rollup/[projectId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rollup/[projectId=stringSegment]',
		mappings: [
			{
				id: 'EvmRollup.EvmNetworkProjectId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/rollup/[projectId]:EvmRollup.EvmNetworkProjectId'],
				probeCases: [[[0, '1', ['projectId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/rollup/[projectId]/timestamp/[timestampMs]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rollup/[projectId=stringSegment]/(evmRollup)/timestamp/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'EvmRollup_Timestamp.RollupTimestampMsSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/rollup/[projectId]/timestamp/[timestampMs]/[source]:EvmRollup_Timestamp.RollupTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'projectId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/rpc-urls': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rpc-urls',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/shielded-pool/[pool]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/shielded-pool/[pool=stringSegment]',
		mappings: [
			{
				id: 'ZcashShieldedPool.NetworkPool',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/shielded-pool/[pool]:ZcashShieldedPool.NetworkPool'],
				probeCases: [[[0, '1', ['pool', 'network']]], [[0, '2', ['pool', 'network']]]],
				projectionPath: [
					'Zcash',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/slashings': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slashings',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/slot/[slot]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]',
		mappings: [
			{
				id: 'BeaconSlot.EvmNetworkSlot',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/slot/[slot]:BeaconSlot.EvmNetworkSlot'],
				probeCases: [[[0, '1', ['slot', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/slot/[slot]/attestation/[index]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/attestation/[index=nonNegativeInteger]',
		mappings: [
			{
				id: 'BeaconAttestation.EvmNetworkSlotIndexInSlot',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/slot/[slot]/attestation/[index]:BeaconAttestation.EvmNetworkSlotIndexInSlot'],
				probeCases: [[[0, '1', ['slot', 'index', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/slot/[slot]/committee/[index]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/committee/[index=nonNegativeInteger]',
		mappings: [
			{
				id: 'BeaconCommittee.EvmNetworkSlotIndexInSlot',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/slot/[slot]/committee/[index]:BeaconCommittee.EvmNetworkSlotIndexInSlot'],
				probeCases: [[[0, '1', ['slot', 'index', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/slot/[slot]/slashing/[kind]/[index]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/slashing/[kind=stringSegment]/[index=nonNegativeInteger]',
		mappings: [
			{
				id: 'BeaconSlashing.EvmNetworkSlotKindIndexInSlot',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/slot/[slot]/slashing/[kind]/[index]:BeaconSlashing.EvmNetworkSlotKindIndexInSlot'],
				probeCases: [[[0, '1', ['slot', 'kind', 'index', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/slot/[slot]/withdrawal/[index]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/withdrawal/[index=nonNegativeInteger]',
		mappings: [
			{
				id: 'BeaconWithdrawal.EvmNetworkSlotIndexInSlot',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/slot/[slot]/withdrawal/[index]:BeaconWithdrawal.EvmNetworkSlotIndexInSlot'],
				probeCases: [[[0, '1', ['slot', 'index', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/slots': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slots',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/stake-pool/[poolId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/stake-pool/[poolId=stringSegment]',
		mappings: [
			{
				id: 'CardanoStakePool.NetworkPoolId',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/stake-pool/[poolId]:CardanoStakePool.NetworkPoolId'],
				probeCases: [[[0, '1', ['poolId', 'network']]]],
				projectionPath: [
					'Cardano',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/sync-committee/[period]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sync-committee/[period=nonNegativeInteger]',
		mappings: [
			{
				id: 'BeaconSyncCommittee.EvmNetworkPeriod',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/sync-committee/[period]:BeaconSyncCommittee.EvmNetworkPeriod'],
				probeCases: [[[0, '1', ['period', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/sync-committees': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sync-committees',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/token-account/[tokenAccountPubkey]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-account/[tokenAccountPubkey=stringSegment]',
		mappings: [
			{
				id: 'SolanaTokenAccount.NetworkTokenAccountPubkey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/token-account/[tokenAccountPubkey]:SolanaTokenAccount.NetworkTokenAccountPubkey'],
				probeCases: [[[0, '1', ['tokenAccountPubkey', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/token-accounts': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-accounts',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/token-mint/[mintAddress]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-mint/[mintAddress=stringSegment]',
		mappings: [
			{
				id: 'SolanaTokenMint.NetworkMintAddress',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/token-mint/[mintAddress]:SolanaTokenMint.NetworkMintAddress'],
				probeCases: [[[0, '1', ['mintAddress', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/token-mints': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token-mints',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/transaction/[hash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/transaction/[hash=stringSegment]',
		mappings: [
			{
				id: 'XrplTransaction.NetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/transaction/[hash]:XrplTransaction.NetworkHash'],
				probeCases: [[[0, '1', ['hash', 'network']]]],
				projectionPath: [
					'Xrpl',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/transactions': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/transactions',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/trustline/[account]/[currency]/[issuer]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]',
		mappings: [
			{
				id: 'XrplTrustline.NetworkAccountCurrencyIssuer',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/trustline/[account]/[currency]/[issuer]:XrplTrustline.NetworkAccountCurrencyIssuer'],
				probeCases: [[[0, '1', ['account', 'currency', 'issuer', 'network']]]],
				projectionPath: [
					'Xrpl',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/upgrades': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/upgrades',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/user-operation/[userOperationHash]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/user-operation/[userOperationHash=userOperationHash]',
		mappings: [
			{
				id: 'EvmUserOperation.EvmNetworkHash',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/user-operation/[userOperationHash]:EvmUserOperation.EvmNetworkHash'],
				probeCases: [[[0, '1', ['userOperationHash', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/validator/[validatorId]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]',
		mappings: [
			{
				id: 'BeaconValidator.NetworkIndexInNetwork',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/validator/[validatorId]:BeaconValidator.NetworkIndexInNetwork'],
				probeCases: [[[0, '1', ['validatorId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
			{
				id: 'SolanaValidator.NetworkVotePubkey',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/validator/[validatorId]:SolanaValidator.NetworkVotePubkey'],
				probeCases: [[[0, '1', ['validatorId', 'network']]]],
				projectionPath: [
					'Solana',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/validator/[validatorId]/observations/[slot]/[source]': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validator/[validatorId=nonNegativeIntegerOrSolanaPubkey]/(selection)/observations/[slot=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'BeaconValidator_Timestamp.ValidatorSlotSource',
				projectionEntity: 'Network',
				probeAtomPrefixes: ['/network/[network]/validator/[validatorId]/observations/[slot]/[source]:BeaconValidator_Timestamp.ValidatorSlotSource'],
				probeCases: [[[0, '1', ['slot', 'source', 'validatorId', 'network']]]],
				projectionPath: [
					'Evm',
				],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/validators': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/validators',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(networks)/network/[network]/withdrawals': {
		routeId: '/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/withdrawals',
		mappings: [
			{
				id: 'Network.Caip2',
				probeAtomPrefixes: ['/network/[network]:Network.Caip2'],
				probeCases: [[[0, '1', ['network']]]],
			},
			{
				id: 'Network.Slug',
				probeAtomPrefixes: ['/network/[network]:Network.Slug'],
				probeCases: [[[0, '1', ['network']]], [[0, '2', ['network']]], [[0, '3', ['network']]], [[0, '4', ['network']]], [[0, '5', ['network']]], [[0, '6', ['network']]], [[0, '7', ['network']]], [[0, '8', ['network']]], [[0, '9', ['network']]], [[0, '10', ['network']]], [[0, '11', ['network']]], [[0, '12', ['network']]], [[0, '13', ['network']]], [[0, '14', ['network']]], [[0, '15', ['network']]]],
			},
		],
	},
	'/(explore)/(protocols)/evm/(calldata)/calldata/[hex]': {
		routeId: '/(explore)/(protocols)/evm/(evmProtocol)/(calldata)/calldata/[hex=zeroExHex]',
		mappings: [
			{
				id: 'EvmCalldata.Hex',
				probeAtomPrefixes: ['/evm/calldata/[hex]:EvmCalldata.Hex'],
				probeCases: [[[0, '1', ['hex']]]],
			},
		],
	},
	'/(explore)/(protocols)/evm/(errors)/error/[hex]': {
		routeId: '/(explore)/(protocols)/evm/(evmProtocol)/(errors)/error/[hex=zeroExHex]',
		mappings: [
			{
				id: 'EvmError.Hex',
				probeAtomPrefixes: ['/evm/error/[hex]:EvmError.Hex'],
				probeCases: [[[0, '1', ['hex']]]],
			},
		],
	},
	'/(explore)/(protocols)/evm/(errors)/error/[hex]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(protocols)/evm/(evmProtocol)/(errors)/error/[hex=zeroExHex]/(evmError)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'EvmError_Timestamp.ErrorTimestampMsSource',
				probeAtomPrefixes: ['/evm/error/[hex]/observations/[timestampMs]/[source]:EvmError_Timestamp.ErrorTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'hex']]]],
			},
		],
	},
	'/(explore)/(protocols)/evm/(selectors)/selector/[hex]': {
		routeId: '/(explore)/(protocols)/evm/(evmProtocol)/(selectors)/selector/[hex=zeroExHex]',
		mappings: [
			{
				id: 'EvmSelector.Hex',
				probeAtomPrefixes: ['/evm/selector/[hex]:EvmSelector.Hex'],
				probeCases: [[[0, '1', ['hex']]]],
			},
		],
	},
	'/(explore)/(protocols)/evm/(selectors)/selector/[hex]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(protocols)/evm/(evmProtocol)/(selectors)/selector/[hex=zeroExHex]/(evmSelector)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'EvmSelector_Timestamp.SelectorTimestampMsSource',
				probeAtomPrefixes: ['/evm/selector/[hex]/observations/[timestampMs]/[source]:EvmSelector_Timestamp.SelectorTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'hex']]]],
			},
		],
	},
	'/(explore)/(protocols)/evm/(topics)/topic/[hex]': {
		routeId: '/(explore)/(protocols)/evm/(evmProtocol)/(topics)/topic/[hex=evmTopicHash]',
		mappings: [
			{
				id: 'EvmTopic.Hex',
				probeAtomPrefixes: ['/evm/topic/[hex]:EvmTopic.Hex'],
				probeCases: [[[0, '1', ['hex']]]],
			},
		],
	},
	'/(explore)/(protocols)/evm/(topics)/topic/[hex]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/(protocols)/evm/(evmProtocol)/(topics)/topic/[hex=evmTopicHash]/(evmTopic)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'EvmTopic_Timestamp.TopicTimestampMsSource',
				probeAtomPrefixes: ['/evm/topic/[hex]/observations/[timestampMs]/[source]:EvmTopic_Timestamp.TopicTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'hex']]]],
			},
		],
	},
	'/(explore)/account/[address]': {
		routeId: '/(explore)/account/[address=evmAddress]',
		mappings: [
			{
				id: 'EvmAccount.Address',
				probeAtomPrefixes: ['/account/[address]:EvmAccount.Address'],
				probeCases: [[[0, '1', ['address']]]],
			},
		],
	},
	'/(explore)/media/[url]': {
		routeId: '/(explore)/media/[url=absoluteUrl]',
		parameterEncodingByName: {
			url: 'Opaque',
		},
		mappings: [
			{
				id: 'Media.Url',
				probeAtomPrefixes: ['/media/[url]:Media.Url'],
				probeCases: [[[0, '1', ['url']]]],
			},
		],
	},
	'/(explore)/network-stack/[networkStackId]': {
		routeId: '/(explore)/network-stack/[networkStackId=stringSegment]',
		mappings: [
			{
				id: 'NetworkStack.NetworkStackId',
				probeAtomPrefixes: ['/network-stack/[networkStackId]:NetworkStack.NetworkStackId'],
				probeCases: [[[0, '1', ['networkStackId']]]],
			},
		],
	},
	'/(explore)/url/[url]': {
		routeId: '/(explore)/url/[url=absoluteUrl]',
		parameterEncodingByName: {
			url: 'Opaque',
		},
		mappings: [
			{
				id: 'Url.Url',
				probeAtomPrefixes: ['/url/[url]:Url.Url'],
				probeCases: [[[0, '1', ['url']]]],
			},
		],
	},
	'/(explore)/url/[url]/observations/[timestampMs]/[source]': {
		routeId: '/(explore)/url/[url=absoluteUrl]/(url)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			url: 'Opaque',
		},
		mappings: [
			{
				id: 'UrlPreview_Timestamp.UrlTimestampMsSource',
				probeAtomPrefixes: ['/url/[url]/observations/[timestampMs]/[source]:UrlPreview_Timestamp.UrlTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'url']]]],
			},
		],
	},
	'/(proposals)/proposals/[specificationRealmSlug]': {
		routeId: '/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]',
		mappings: [
			{
				id: 'SpecificationRealm.Realm',
				probeAtomPrefixes: ['/proposals/[specificationRealmSlug]:SpecificationRealm.Realm'],
				probeCases: [[[0, '1', ['specificationRealmSlug']]]],
			},
		],
	},
	'/(proposals)/proposals/[specificationRealmSlug]/[proposalKindSlug]': {
		routeId: '/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]',
		mappings: [
			{
				id: 'SpecificationProposalKind.RealmCategory',
				probeAtomPrefixes: ['/proposals/[specificationRealmSlug]/[proposalKindSlug]:SpecificationProposalKind.RealmCategory'],
				probeCases: [[[0, '1', ['specificationRealmSlug', 'proposalKindSlug']]]],
			},
		],
	},
	'/(proposals)/proposals/[specificationRealmSlug]/[proposalKindSlug]/[proposalRef]': {
		routeId: '/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]/(specificationProposalKind)/[proposalRef=proposalRef]',
		mappings: [
			{
				id: 'SpecificationProposal.RealmCategoryNumber',
				probeAtomPrefixes: ['/proposals/[specificationRealmSlug]/[proposalKindSlug]/[proposalRef]:SpecificationProposal.RealmCategoryNumber'],
				probeCases: [[[0, '1', ['specificationRealmSlug', 'proposalKindSlug', 'proposalRef']]]],
			},
		],
	},
	'/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]': {
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]',
		parameterEncodingByName: {
			instanceOrigin: 'Opaque',
		},
		mappings: [
			{
				id: 'ActivityPubActor.LocalAccountId',
				probeAtomPrefixes: ['/activitypub/actor/[instanceOrigin]/[localAccountId]:ActivityPubActor.LocalAccountId'],
				probeCases: [[[0, '1', ['instanceOrigin', 'localAccountId']]]],
			},
		],
	},
	'/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]/notes': {
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/(activityPubActor)/notes',
		parameterEncodingByName: {
			instanceOrigin: 'Opaque',
		},
		mappings: [
			{
				id: 'ActivityPubActor.LocalAccountId',
				probeAtomPrefixes: ['/activitypub/actor/[instanceOrigin]/[localAccountId]:ActivityPubActor.LocalAccountId'],
				probeCases: [[[0, '1', ['instanceOrigin', 'localAccountId']]]],
			},
		],
	},
	'/(social)/(activitypub)/activitypub/actor/[instanceOrigin]/[localAccountId]/observations/[timestampMs]/[source]': {
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]/(activityPubActor)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			instanceOrigin: 'Opaque',
		},
		mappings: [
			{
				id: 'ActivityPubActor_Timestamp.ActivityPubActorTimestampMsSource',
				probeAtomPrefixes: ['/activitypub/actor/[instanceOrigin]/[localAccountId]/observations/[timestampMs]/[source]:ActivityPubActor_Timestamp.ActivityPubActorTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'instanceOrigin', 'localAccountId']]]],
			},
		],
	},
	'/(social)/(activitypub)/activitypub/instance/[instanceOrigin]': {
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]',
		parameterEncodingByName: {
			instanceOrigin: 'Opaque',
		},
		mappings: [
			{
				id: 'ActivityPubInstance.InstanceOrigin',
				probeAtomPrefixes: ['/activitypub/instance/[instanceOrigin]:ActivityPubInstance.InstanceOrigin'],
				probeCases: [[[0, '1', ['instanceOrigin']]]],
			},
		],
	},
	'/(social)/(activitypub)/activitypub/instance/[instanceOrigin]/observations/[timestampMs]/[source]': {
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]/(activityPubInstance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			instanceOrigin: 'Opaque',
		},
		mappings: [
			{
				id: 'ActivityPubInstance_Timestamp.InstanceTimestampMsSource',
				probeAtomPrefixes: ['/activitypub/instance/[instanceOrigin]/observations/[timestampMs]/[source]:ActivityPubInstance_Timestamp.InstanceTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'instanceOrigin']]]],
			},
		],
	},
	'/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]': {
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]',
		parameterEncodingByName: {
			instanceOrigin: 'Opaque',
		},
		mappings: [
			{
				id: 'ActivityPubNote.InstanceOriginLocalStatusId',
				probeAtomPrefixes: ['/activitypub/note/[instanceOrigin]/[localStatusId]:ActivityPubNote.InstanceOriginLocalStatusId'],
				probeCases: [[[0, '1', ['instanceOrigin', 'localStatusId']]]],
			},
		],
	},
	'/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]/observations/[timestampMs]/[source]': {
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/(activityPubNote)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			instanceOrigin: 'Opaque',
		},
		mappings: [
			{
				id: 'ActivityPubNote_Timestamp.ActivityPubNoteTimestampMsSource',
				probeAtomPrefixes: ['/activitypub/note/[instanceOrigin]/[localStatusId]/observations/[timestampMs]/[source]:ActivityPubNote_Timestamp.ActivityPubNoteTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'instanceOrigin', 'localStatusId']]]],
			},
		],
	},
	'/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]/thread': {
		routeId: '/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]/(activityPubNote)/thread',
		parameterEncodingByName: {
			instanceOrigin: 'Opaque',
		},
		mappings: [
			{
				id: 'ActivityPubNote.InstanceOriginLocalStatusId',
				probeAtomPrefixes: ['/activitypub/note/[instanceOrigin]/[localStatusId]:ActivityPubNote.InstanceOriginLocalStatusId'],
				probeCases: [[[0, '1', ['instanceOrigin', 'localStatusId']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/actor/[did]': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]',
		parameterEncodingByName: {
			did: 'Opaque',
		},
		mappings: [
			{
				id: 'AtprotoActor.Did',
				probeAtomPrefixes: ['/atproto/actor/[did]:AtprotoActor.Did'],
				probeCases: [[[0, '1', ['did']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/actor/[did]/observations': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/observations',
		parameterEncodingByName: {
			did: 'Opaque',
		},
		mappings: [
			{
				id: 'AtprotoActor.Did',
				probeAtomPrefixes: ['/atproto/actor/[did]:AtprotoActor.Did'],
				probeCases: [[[0, '1', ['did']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/actor/[did]/observations/[timestampMs]/[source]': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			did: 'Opaque',
		},
		mappings: [
			{
				id: 'AtprotoActor_Timestamp.AtprotoActorTimestampMsSource',
				probeAtomPrefixes: ['/atproto/actor/[did]/observations/[timestampMs]/[source]:AtprotoActor_Timestamp.AtprotoActorTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'did']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/actor/[did]/posts': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/posts',
		parameterEncodingByName: {
			did: 'Opaque',
		},
		mappings: [
			{
				id: 'AtprotoActor.Did',
				probeAtomPrefixes: ['/atproto/actor/[did]:AtprotoActor.Did'],
				probeCases: [[[0, '1', ['did']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/actor/handle/[handle]': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/handle/[handle=stringSegment]',
		mappings: [
			{
				id: 'AtprotoActor.Handle',
				probeAtomPrefixes: ['/atproto/actor/handle/[handle]:AtprotoActor.Handle'],
				probeCases: [[[0, '1', ['handle']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/post/[...uri]': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]',
		parameterEncodingByName: {
			uri: 'Opaque',
		},
		mappings: [
			{
				id: 'AtprotoPost.Uri',
				probeAtomPrefixes: ['/atproto/post/[...uri]:AtprotoPost.Uri'],
				probeCases: [[[0, '1', ['uri']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/post/[...uri]/observations': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]/(atprotoPost)/observations',
		parameterEncodingByName: {
			uri: 'Opaque',
		},
		mappings: [
			{
				id: 'AtprotoPost.Uri',
				probeAtomPrefixes: ['/atproto/post/[...uri]:AtprotoPost.Uri'],
				probeCases: [[[0, '1', ['uri']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/post/[...uri]/observations/[timestampMs]': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]/(atprotoPost)/observations/[timestampMs=nonNegativeInteger]',
		parameterEncodingByName: {
			uri: 'Opaque',
		},
		mappings: [
			{
				id: 'AtprotoPost_Timestamp.AtprotoPostTimestampMs',
				probeAtomPrefixes: ['/atproto/post/[...uri]/observations/[timestampMs]:AtprotoPost_Timestamp.AtprotoPostTimestampMs'],
				probeCases: [[[0, '1', ['timestampMs', 'uri']]]],
			},
		],
	},
	'/(social)/(atproto)/atproto/post/[...uri]/thread': {
		routeId: '/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]/(atprotoPost)/thread',
		parameterEncodingByName: {
			uri: 'Opaque',
		},
		mappings: [
			{
				id: 'AtprotoPost.Uri',
				probeAtomPrefixes: ['/atproto/post/[...uri]:AtprotoPost.Uri'],
				probeCases: [[[0, '1', ['uri']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/account/[connectionId]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/account/[connectionId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadFarcasterAccountConnection.ConnectionId',
				probeAtomPrefixes: ['/farcaster/account/[connectionId]:BlockheadFarcasterAccountConnection.ConnectionId'],
				probeCases: [[[0, '1', ['connectionId']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/c/[fname]/[hash]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/c/[fname=stringSegment]/[hash=zeroExHex]',
		mappings: [
			{
				id: 'FarcasterCast.UsernameHashPrefix',
				probeAtomPrefixes: ['/farcaster/c/[fname]/[hash]:FarcasterCast.UsernameHashPrefix'],
				probeCases: [[[0, '1', ['fname', 'hash']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/cast/[fid]/[hash]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]',
		mappings: [
			{
				id: 'FarcasterCast.FidHash',
				probeAtomPrefixes: ['/farcaster/cast/[fid]/[hash]:FarcasterCast.FidHash'],
				probeCases: [[[0, '1', ['fid', 'hash']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/cast/[fid]/[hash]/embed/[indexInCast]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]/(farcasterCast)/embed/[indexInCast=nonNegativeInteger]',
		mappings: [
			{
				id: 'FarcasterCastEmbed.CastIndexInCast',
				probeAtomPrefixes: ['/farcaster/cast/[fid]/[hash]/embed/[indexInCast]:FarcasterCastEmbed.CastIndexInCast'],
				probeCases: [[[0, '1', ['indexInCast', 'fid', 'hash']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/cast/[fid]/[hash]/observations/[timestampMs]-[source]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/cast/[fid=farcasterFid]/[hash=zeroExHex]/(farcasterCast)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
		mappings: [
			{
				id: 'FarcasterCast_Timestamp.CastTimestampMsSource',
				probeAtomPrefixes: ['/farcaster/cast/[fid]/[hash]/observations/[timestampMs]-[source]:FarcasterCast_Timestamp.CastTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'fid', 'hash']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/channel/[channelId]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]',
		mappings: [
			{
				id: 'FarcasterChannel.Id',
				probeAtomPrefixes: ['/farcaster/channel/[channelId]:FarcasterChannel.Id'],
				probeCases: [[[0, '1', ['channelId']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/channel/[channelId]/casts': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]/(farcasterChannel)/casts',
		mappings: [
			{
				id: 'FarcasterChannel.Id',
				probeAtomPrefixes: ['/farcaster/channel/[channelId]:FarcasterChannel.Id'],
				probeCases: [[[0, '1', ['channelId']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/channel/[channelId]/observations/[timestampMs]-[source]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]/(farcasterChannel)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
		mappings: [
			{
				id: 'FarcasterChannel_Timestamp.ChannelTimestampMsSource',
				probeAtomPrefixes: ['/farcaster/channel/[channelId]/observations/[timestampMs]-[source]:FarcasterChannel_Timestamp.ChannelTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'channelId']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/feed/channel/[channelId]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/channel/[channelId=stringSegment]',
		mappings: [
			{
				id: 'FarcasterFeed.ByChannel',
				probeAtomPrefixes: ['/farcaster/feed/channel/[channelId]:FarcasterFeed.ByChannel'],
				probeCases: [[[0, '1', ['channelId']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/feed/following/[userId]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/following/[userId=farcasterFid]',
		mappings: [
			{
				id: 'FarcasterFeed.Following',
				probeAtomPrefixes: ['/farcaster/feed/following/[userId]:FarcasterFeed.Following'],
				probeCases: [[[0, '1', ['userId']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/feed/user/[userId]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/user/[userId=farcasterFid]',
		mappings: [
			{
				id: 'FarcasterFeed.ByUser',
				probeAtomPrefixes: ['/farcaster/feed/user/[userId]:FarcasterFeed.ByUser'],
				probeCases: [[[0, '1', ['userId']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/user/[userId]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]',
		mappings: [
			{
				id: 'FarcasterUser.Fid',
				probeAtomPrefixes: ['/farcaster/user/[userId]:FarcasterUser.Fid'],
				probeCases: [[[0, '1', ['userId']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/user/[userId]/casts': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]/(farcasterUser)/casts',
		mappings: [
			{
				id: 'FarcasterUser.Fid',
				probeAtomPrefixes: ['/farcaster/user/[userId]:FarcasterUser.Fid'],
				probeCases: [[[0, '1', ['userId']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/user/[userId]/observations/[timestampMs]-[source]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]/(farcasterUser)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
		mappings: [
			{
				id: 'FarcasterUser_Timestamp.UserTimestampMsSource',
				probeAtomPrefixes: ['/farcaster/user/[userId]/observations/[timestampMs]-[source]:FarcasterUser_Timestamp.UserTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'userId']]]],
			},
		],
	},
	'/(social)/(farcaster)/farcaster/user/[userId]/verified-address/[protocol]/[address]': {
		routeId: '/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]/(farcasterUser)/verified-address/[protocol=stringSegment]/[address=stringSegment]',
		mappings: [
			{
				id: 'FarcasterVerifiedAddress.FidProtocolAddress',
				probeAtomPrefixes: ['/farcaster/user/[userId]/verified-address/[protocol]/[address]:FarcasterVerifiedAddress.FidProtocolAddress'],
				probeCases: [[[0, '1', ['userId', 'protocol', 'address']]]],
			},
		],
	},
	'/(social)/(lens)/lens/account/[address]': {
		routeId: '/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]',
		mappings: [
			{
				id: 'LensAccount.Address',
				probeAtomPrefixes: ['/lens/account/[address]:LensAccount.Address'],
				probeCases: [[[0, '1', ['address']]]],
			},
		],
	},
	'/(social)/(lens)/lens/account/[address]/observations/[timestampMs]': {
		routeId: '/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]/(lensAccount)/observations/[timestampMs=nonNegativeInteger]',
		mappings: [
			{
				id: 'LensAccount_Timestamp.LensAccountTimestampMs',
				probeAtomPrefixes: ['/lens/account/[address]/observations/[timestampMs]:LensAccount_Timestamp.LensAccountTimestampMs'],
				probeCases: [[[0, '1', ['timestampMs', 'address']]]],
			},
		],
	},
	'/(social)/(lens)/lens/account/[address]/posts': {
		routeId: '/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]/(lensAccount)/posts',
		mappings: [
			{
				id: 'LensAccount.Address',
				probeAtomPrefixes: ['/lens/account/[address]:LensAccount.Address'],
				probeCases: [[[0, '1', ['address']]]],
			},
		],
	},
	'/(social)/(lens)/lens/feed/[address]': {
		routeId: '/(social)/(lens)/lens/(lensNetwork)/feed/[address=evmAddress]',
		mappings: [
			{
				id: 'LensFeed.Address',
				probeAtomPrefixes: ['/lens/feed/[address]:LensFeed.Address'],
				probeCases: [[[0, '1', ['address']]]],
			},
		],
	},
	'/(social)/(lens)/lens/namespace/[address]': {
		routeId: '/(social)/(lens)/lens/(lensNetwork)/namespace/[address=evmAddress]',
		mappings: [
			{
				id: 'LensUsernameNamespace.Address',
				probeAtomPrefixes: ['/lens/namespace/[address]:LensUsernameNamespace.Address'],
				probeCases: [[[0, '1', ['address']]]],
			},
		],
	},
	'/(social)/(lens)/lens/post/[postId]': {
		routeId: '/(social)/(lens)/lens/(lensNetwork)/post/[postId=stringSegment]',
		mappings: [
			{
				id: 'LensPost.Id',
				probeAtomPrefixes: ['/lens/post/[postId]:LensPost.Id'],
				probeCases: [[[0, '1', ['postId']]]],
			},
		],
	},
	'/(social)/(lens)/lens/post/[postId]/comments': {
		routeId: '/(social)/(lens)/lens/(lensNetwork)/post/[postId=stringSegment]/(lensPost)/comments',
		mappings: [
			{
				id: 'LensPost.Id',
				probeAtomPrefixes: ['/lens/post/[postId]:LensPost.Id'],
				probeCases: [[[0, '1', ['postId']]]],
			},
		],
	},
	'/(social)/(lens)/lens/post/[postId]/observations/[timestampMs]': {
		routeId: '/(social)/(lens)/lens/(lensNetwork)/post/[postId=stringSegment]/(lensPost)/observations/[timestampMs=nonNegativeInteger]',
		mappings: [
			{
				id: 'LensPost_Timestamp.LensPostTimestampMs',
				probeAtomPrefixes: ['/lens/post/[postId]/observations/[timestampMs]:LensPost_Timestamp.LensPostTimestampMs'],
				probeCases: [[[0, '1', ['timestampMs', 'postId']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/article-version/[eventId]': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/article-version/[eventId=stringSegment]',
		mappings: [
			{
				id: 'NostrArticleEvent.CanonicalEventId',
				probeAtomPrefixes: ['/nostr/article-version/[eventId]:NostrArticleEvent.CanonicalEventId'],
				probeCases: [[[0, '1', ['eventId']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/article/[pubkey]/[identifier]': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/article/[pubkey=stringSegment]/[identifier=stringSegment]',
		mappings: [
			{
				id: 'NostrArticle.CanonicalCoordinate',
				probeAtomPrefixes: ['/nostr/article/[pubkey]/[identifier]:NostrArticle.CanonicalCoordinate'],
				probeCases: [[[0, '1', ['pubkey', 'identifier']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/note/[eventId]': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/note/[eventId=stringSegment]',
		mappings: [
			{
				id: 'NostrNote.CanonicalEventId',
				probeAtomPrefixes: ['/nostr/note/[eventId]:NostrNote.CanonicalEventId'],
				probeCases: [[[0, '1', ['eventId']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/note/[eventId]/reactions': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/note/[eventId=stringSegment]/(nostrNote)/reactions',
		mappings: [
			{
				id: 'NostrNote.CanonicalEventId',
				probeAtomPrefixes: ['/nostr/note/[eventId]:NostrNote.CanonicalEventId'],
				probeCases: [[[0, '1', ['eventId']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/note/[eventId]/replies': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/note/[eventId=stringSegment]/(nostrNote)/replies',
		mappings: [
			{
				id: 'NostrNote.CanonicalEventId',
				probeAtomPrefixes: ['/nostr/note/[eventId]:NostrNote.CanonicalEventId'],
				probeCases: [[[0, '1', ['eventId']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/profile-metadata-version/[eventId]': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile-metadata-version/[eventId=stringSegment]',
		mappings: [
			{
				id: 'NostrProfileMetadataEvent.CanonicalEventId',
				probeAtomPrefixes: ['/nostr/profile-metadata-version/[eventId]:NostrProfileMetadataEvent.CanonicalEventId'],
				probeCases: [[[0, '1', ['eventId']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/profile/[pubkey]': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]',
		mappings: [
			{
				id: 'NostrProfile.CanonicalPubkey',
				probeAtomPrefixes: ['/nostr/profile/[pubkey]:NostrProfile.CanonicalPubkey'],
				probeCases: [[[0, '1', ['pubkey']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/profile/[pubkey]/articles': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]/(nostrProfile)/articles',
		mappings: [
			{
				id: 'NostrProfile.CanonicalPubkey',
				probeAtomPrefixes: ['/nostr/profile/[pubkey]:NostrProfile.CanonicalPubkey'],
				probeCases: [[[0, '1', ['pubkey']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/profile/[pubkey]/notes': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]/(nostrProfile)/notes',
		mappings: [
			{
				id: 'NostrProfile.CanonicalPubkey',
				probeAtomPrefixes: ['/nostr/profile/[pubkey]:NostrProfile.CanonicalPubkey'],
				probeCases: [[[0, '1', ['pubkey']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/profile/[pubkey]/reposts': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]/(nostrProfile)/reposts',
		mappings: [
			{
				id: 'NostrProfile.CanonicalPubkey',
				probeAtomPrefixes: ['/nostr/profile/[pubkey]:NostrProfile.CanonicalPubkey'],
				probeCases: [[[0, '1', ['pubkey']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/reaction/[eventId]': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/reaction/[eventId=stringSegment]',
		mappings: [
			{
				id: 'NostrReaction.CanonicalEventId',
				probeAtomPrefixes: ['/nostr/reaction/[eventId]:NostrReaction.CanonicalEventId'],
				probeCases: [[[0, '1', ['eventId']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/relay/[relayKey]': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/relay/[relayKey=stringSegment]',
		parameterEncodingByName: {
			relayKey: 'Opaque',
		},
		mappings: [
			{
				id: 'NostrRelay.RelayUrl',
				probeAtomPrefixes: ['/nostr/relay/[relayKey]:NostrRelay.RelayUrl'],
				probeCases: [[[0, '1', ['relayKey']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/relay/[relayKey]/observations/[timestampMs]/[source]': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/relay/[relayKey=stringSegment]/(nostrRelay)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			relayKey: 'Opaque',
		},
		mappings: [
			{
				id: 'NostrRelay_Timestamp.RelayTimestampMsSource',
				probeAtomPrefixes: ['/nostr/relay/[relayKey]/observations/[timestampMs]/[source]:NostrRelay_Timestamp.RelayTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'relayKey']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/repost/[eventId]': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/repost/[eventId=stringSegment]',
		mappings: [
			{
				id: 'NostrRepost.CanonicalEventId',
				probeAtomPrefixes: ['/nostr/repost/[eventId]:NostrRepost.CanonicalEventId'],
				probeCases: [[[0, '1', ['eventId']]]],
			},
		],
	},
	'/(social)/(nostr)/nostr/search/[query]': {
		routeId: '/(social)/(nostr)/nostr/(globalNostrNetwork)/search/[query=stringSegment]',
		mappings: [
			{
				id: 'NostrSearchQuery.Query',
				probeAtomPrefixes: ['/nostr/search/[query]:NostrSearchQuery.Query'],
				probeCases: [[[0, '1', ['query']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/comment/[fullname]': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]',
		parameterEncodingByName: {
			fullname: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditComment.Fullname',
				probeAtomPrefixes: ['/reddit/comment/[fullname]:RedditComment.Fullname'],
				probeCases: [[[0, '1', ['fullname']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/comment/[fullname]/observations': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/observations',
		parameterEncodingByName: {
			fullname: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditComment.Fullname',
				probeAtomPrefixes: ['/reddit/comment/[fullname]:RedditComment.Fullname'],
				probeCases: [[[0, '1', ['fullname']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/comment/[fullname]/observations/[timestampMs]/[source]': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			fullname: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditComment_Timestamp.CommentTimestampMsSource',
				probeAtomPrefixes: ['/reddit/comment/[fullname]/observations/[timestampMs]/[source]:RedditComment_Timestamp.CommentTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'fullname']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/comment/[fullname]/replies': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]/(redditComment)/replies',
		parameterEncodingByName: {
			fullname: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditComment.Fullname',
				probeAtomPrefixes: ['/reddit/comment/[fullname]:RedditComment.Fullname'],
				probeCases: [[[0, '1', ['fullname']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/link/[fullname]': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]',
		parameterEncodingByName: {
			fullname: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditLink.Fullname',
				probeAtomPrefixes: ['/reddit/link/[fullname]:RedditLink.Fullname'],
				probeCases: [[[0, '1', ['fullname']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/link/[fullname]/comments': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/comments',
		parameterEncodingByName: {
			fullname: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditLink.Fullname',
				probeAtomPrefixes: ['/reddit/link/[fullname]:RedditLink.Fullname'],
				probeCases: [[[0, '1', ['fullname']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/link/[fullname]/observations': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/observations',
		parameterEncodingByName: {
			fullname: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditLink.Fullname',
				probeAtomPrefixes: ['/reddit/link/[fullname]:RedditLink.Fullname'],
				probeCases: [[[0, '1', ['fullname']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/link/[fullname]/observations/[timestampMs]/[source]': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]/(redditLink)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			fullname: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditLink_Timestamp.LinkTimestampMsSource',
				probeAtomPrefixes: ['/reddit/link/[fullname]/observations/[timestampMs]/[source]:RedditLink_Timestamp.LinkTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'fullname']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/r/[name]': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]',
		parameterEncodingByName: {
			name: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditSubreddit.Name',
				probeAtomPrefixes: ['/reddit/r/[name]:RedditSubreddit.Name'],
				probeCases: [[[0, '1', ['name']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/r/[name]/links': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/links',
		parameterEncodingByName: {
			name: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditSubreddit.Name',
				probeAtomPrefixes: ['/reddit/r/[name]:RedditSubreddit.Name'],
				probeCases: [[[0, '1', ['name']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/r/[name]/observations': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/observations',
		parameterEncodingByName: {
			name: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditSubreddit.Name',
				probeAtomPrefixes: ['/reddit/r/[name]:RedditSubreddit.Name'],
				probeCases: [[[0, '1', ['name']]]],
			},
		],
	},
	'/(social)/(reddit)/reddit/r/[name]/observations/[timestampMs]/[source]': {
		routeId: '/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]/(redditSubreddit)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			name: 'Opaque',
		},
		mappings: [
			{
				id: 'RedditSubreddit_Timestamp.SubredditTimestampMsSource',
				probeAtomPrefixes: ['/reddit/r/[name]/observations/[timestampMs]/[source]:RedditSubreddit_Timestamp.SubredditTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'name']]]],
			},
		],
	},
	'/(social)/(rss)/rss/feed/[feedUrl]': {
		routeId: '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]',
		parameterEncodingByName: {
			feedUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'RssFeed.FeedUrl',
				probeAtomPrefixes: ['/rss/feed/[feedUrl]:RssFeed.FeedUrl'],
				probeCases: [[[0, '1', ['feedUrl']]]],
			},
		],
	},
	'/(social)/(rss)/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]': {
		routeId: '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]',
		parameterEncodingByName: {
			feedUrl: 'Opaque',
			itemIdentity: 'Opaque',
		},
		mappings: [
			{
				id: 'RssItem.FeedIdentity',
				probeAtomPrefixes: ['/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]:RssItem.FeedIdentity'],
				probeCases: [[[0, '1', ['itemIdentityKind', 'itemIdentity', 'feedUrl']]]],
			},
		],
	},
	'/(social)/(rss)/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]/observations/[timestampMs]/[source]': {
		routeId: '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]/(rssItem)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			feedUrl: 'Opaque',
			itemIdentity: 'Opaque',
		},
		mappings: [
			{
				id: 'RssItem_Timestamp.ItemTimestampMsSource',
				probeAtomPrefixes: ['/rss/feed/[feedUrl]/item/[itemIdentityKind]/[itemIdentity]/observations/[timestampMs]/[source]:RssItem_Timestamp.ItemTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'itemIdentityKind', 'itemIdentity', 'feedUrl']]]],
			},
		],
	},
	'/(social)/(rss)/rss/feed/[feedUrl]/items': {
		routeId: '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/items',
		parameterEncodingByName: {
			feedUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'RssFeed.FeedUrl',
				probeAtomPrefixes: ['/rss/feed/[feedUrl]:RssFeed.FeedUrl'],
				probeCases: [[[0, '1', ['feedUrl']]]],
			},
		],
	},
	'/(social)/(rss)/rss/feed/[feedUrl]/observations/[timestampMs]/[source]': {
		routeId: '/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		parameterEncodingByName: {
			feedUrl: 'Opaque',
		},
		mappings: [
			{
				id: 'RssFeed_Timestamp.FeedTimestampMsSource',
				probeAtomPrefixes: ['/rss/feed/[feedUrl]/observations/[timestampMs]/[source]:RssFeed_Timestamp.FeedTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'feedUrl']]]],
			},
		],
	},
	'/(social)/(x)/x/post/[postId]': {
		routeId: '/(social)/(x)/x/(xNetwork)/post/[postId=stringSegment]',
		mappings: [
			{
				id: 'XPost.Id',
				probeAtomPrefixes: ['/x/post/[postId]:XPost.Id'],
				probeCases: [[[0, '1', ['postId']]]],
			},
		],
	},
	'/(social)/(x)/x/post/[postId]/observations/[timestampMs]/[source]': {
		routeId: '/(social)/(x)/x/(xNetwork)/post/[postId=stringSegment]/(xPost)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'XPost_Timestamp.XPostTimestampMsSource',
				probeAtomPrefixes: ['/x/post/[postId]/observations/[timestampMs]/[source]:XPost_Timestamp.XPostTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'postId']]]],
			},
		],
	},
	'/(social)/(x)/x/user/[userId]': {
		routeId: '/(social)/(x)/x/(xNetwork)/user/[userId=stringSegment]',
		mappings: [
			{
				id: 'XUser.Id',
				probeAtomPrefixes: ['/x/user/[userId]:XUser.Id'],
				probeCases: [[[0, '1', ['userId']]]],
			},
		],
	},
	'/(social)/(x)/x/user/[userId]/observations/[timestampMs]/[source]': {
		routeId: '/(social)/(x)/x/(xNetwork)/user/[userId=stringSegment]/(xUser)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: 'XUser_Timestamp.XUserTimestampMsSource',
				probeAtomPrefixes: ['/x/user/[userId]/observations/[timestampMs]/[source]:XUser_Timestamp.XUserTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'userId']]]],
			},
		],
	},
	'/(social)/(xmtp)/xmtp/conversation/[conversationId]': {
		routeId: '/(social)/(xmtp)/xmtp/(xmtpNetwork)/conversation/[conversationId=stringSegment]',
		mappings: [
			{
				id: 'XmtpConversation.Id',
				probeAtomPrefixes: ['/xmtp/conversation/[conversationId]:XmtpConversation.Id'],
				probeCases: [[[0, '1', ['conversationId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/channel/[channelId]': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]',
		parameterEncodingByName: {
			channelId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubeChannel.ChannelId',
				probeAtomPrefixes: ['/youtube/channel/[channelId]:YoutubeChannel.ChannelId'],
				probeCases: [[[0, '1', ['channelId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/channel/[channelId]/observations/[timestampMs]-[source]': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
		parameterEncodingByName: {
			channelId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubeChannel_Timestamp.YoutubeChannelTimestampMsSource',
				probeAtomPrefixes: ['/youtube/channel/[channelId]/observations/[timestampMs]-[source]:YoutubeChannel_Timestamp.YoutubeChannelTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'channelId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/channel/[channelId]/playlists': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/playlists',
		parameterEncodingByName: {
			channelId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubeChannel.ChannelId',
				probeAtomPrefixes: ['/youtube/channel/[channelId]:YoutubeChannel.ChannelId'],
				probeCases: [[[0, '1', ['channelId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/channel/[channelId]/videos': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channel/[channelId=stringSegment]/(youtubeChannel)/videos',
		parameterEncodingByName: {
			channelId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubeChannel.ChannelId',
				probeAtomPrefixes: ['/youtube/channel/[channelId]:YoutubeChannel.ChannelId'],
				probeCases: [[[0, '1', ['channelId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/comment/[videoId]/[commentId]': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/comment/[videoId=stringSegment]/[commentId=stringSegment]',
		parameterEncodingByName: {
			videoId: 'Opaque',
			commentId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubeComment.VideoIdCommentId',
				probeAtomPrefixes: ['/youtube/comment/[videoId]/[commentId]:YoutubeComment.VideoIdCommentId'],
				probeCases: [[[0, '1', ['videoId', 'commentId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/comment/[videoId]/[commentId]/observations/[timestampMs]-[source]': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/comment/[videoId=stringSegment]/[commentId=stringSegment]/(youtubeComment)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
		parameterEncodingByName: {
			videoId: 'Opaque',
			commentId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubeComment_Timestamp.YoutubeCommentTimestampMsSource',
				probeAtomPrefixes: ['/youtube/comment/[videoId]/[commentId]/observations/[timestampMs]-[source]:YoutubeComment_Timestamp.YoutubeCommentTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'videoId', 'commentId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/playlist/[playlistId]': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]',
		parameterEncodingByName: {
			playlistId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubePlaylist.PlaylistId',
				probeAtomPrefixes: ['/youtube/playlist/[playlistId]:YoutubePlaylist.PlaylistId'],
				probeCases: [[[0, '1', ['playlistId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/playlist/[playlistId]/observations/[timestampMs]-[source]': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]/(youtubePlaylist)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
		parameterEncodingByName: {
			playlistId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubePlaylist_Timestamp.YoutubePlaylistTimestampMsSource',
				probeAtomPrefixes: ['/youtube/playlist/[playlistId]/observations/[timestampMs]-[source]:YoutubePlaylist_Timestamp.YoutubePlaylistTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'playlistId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/playlist/[playlistId]/videos': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/playlist/[playlistId=stringSegment]/(youtubePlaylist)/videos',
		parameterEncodingByName: {
			playlistId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubePlaylist.PlaylistId',
				probeAtomPrefixes: ['/youtube/playlist/[playlistId]:YoutubePlaylist.PlaylistId'],
				probeCases: [[[0, '1', ['playlistId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/video/[videoId]': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]',
		parameterEncodingByName: {
			videoId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubeVideo.VideoId',
				probeAtomPrefixes: ['/youtube/video/[videoId]:YoutubeVideo.VideoId'],
				probeCases: [[[0, '1', ['videoId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/video/[videoId]/comments': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]/(youtubeVideo)/comments',
		parameterEncodingByName: {
			videoId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubeVideo.VideoId',
				probeAtomPrefixes: ['/youtube/video/[videoId]:YoutubeVideo.VideoId'],
				probeCases: [[[0, '1', ['videoId']]]],
			},
		],
	},
	'/(social)/(youtube)/youtube/video/[videoId]/observations/[timestampMs]-[source]': {
		routeId: '/(social)/(youtube)/youtube/(globalYoutubeNetwork)/video/[videoId=stringSegment]/(youtubeVideo)/observations/[timestampMs=nonNegativeInteger]-[source=stringSegment]',
		parameterEncodingByName: {
			videoId: 'Opaque',
		},
		mappings: [
			{
				id: 'YoutubeVideo_Timestamp.YoutubeVideoTimestampMsSource',
				probeAtomPrefixes: ['/youtube/video/[videoId]/observations/[timestampMs]-[source]:YoutubeVideo_Timestamp.YoutubeVideoTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source', 'videoId']]]],
			},
		],
	},
	'/(swarm)/swarm/[reference]': {
		routeId: '/(swarm)/swarm/(swarmProtocol)/[reference=stringSegment]',
		mappings: [
			{
				id: 'SwarmResource.ResourceAddress',
				probeAtomPrefixes: ['/swarm/[reference]:SwarmResource.ResourceAddress'],
				probeCases: [[[0, '1', ['reference']]]],
			},
		],
	},
	'/(swarm)/swarm/[reference]/path/[...contentPath]': {
		routeId: '/(swarm)/swarm/(swarmProtocol)/[reference=stringSegment]/path/[...contentPath=stringSegment]',
		mappings: [
			{
				id: 'SwarmResource.ResourceAddress',
				probeCaseId: 'path',
				probeAtomPrefixes: ['/swarm/[reference]:SwarmResource.ResourceAddress', '/swarm/[reference]/path/[...contentPath]:SwarmResource.ResourceAddress.path'],
				probeCases: [[[0, '1', ['reference']], [1, '1', ['contentPath']]]],
			},
		],
	},
	'/(swarm)/swarm/access/observations/[timestampMs]/[source]': {
		routeId: '/(swarm)/swarm/(swarmProtocol)/access/(globalSwarmAccess)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
		mappings: [
			{
				id: '_GlobalSwarmAccess_Timestamp.HubTimestampMsSource',
				probeAtomPrefixes: ['/swarm/access/observations/[timestampMs]/[source]:_GlobalSwarmAccess_Timestamp.HubTimestampMsSource'],
				probeCases: [[[0, '1', ['timestampMs', 'source']]]],
			},
		],
	},
	'/~/accounts/account/[namespace]:[reference]/[accountAddress]': {
		routeId: '/~/accounts/account/[namespace=stringSegment]:[reference=stringSegment]/[accountAddress=stringSegment]',
		mappings: [
			{
				id: 'BlockheadAccount.Account',
				probeAtomPrefixes: ['/~/accounts/account/[namespace]:[reference]/[accountAddress]:BlockheadAccount.Account'],
				probeCases: [[[0, '1', ['namespace', 'reference', 'accountAddress']]]],
			},
		],
	},
	'/~/accounts/allowance/[chainId]/[owner]/[coin]/[spender]': {
		routeId: '/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]',
		mappings: [
			{
				id: 'EvmActorCoinAllowance.EvmAccountEvmContractSpenderInteropAddress',
				probeAtomPrefixes: ['/~/accounts/allowance/[chainId]/[owner]/[coin]/[spender]:EvmActorCoinAllowance.EvmAccountEvmContractSpenderInteropAddress'],
				probeCases: [[[0, '1', ['owner', 'chainId', 'coin', 'spender']]]],
			},
		],
	},
	'/~/accounts/balance/[chainId]/[owner]/[coin]': {
		routeId: '/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]',
		mappings: [
			{
				id: 'EvmNetworkActorCoinBalance.EvmAccountErc20CoinInstance',
				probeAtomPrefixes: ['/~/accounts/balance/[chainId]/[owner]/[coin]:EvmNetworkActorCoinBalance.EvmAccountErc20CoinInstance'],
				probeCases: [[[0, '1', ['owner', 'chainId', 'coin']]]],
			},
		],
	},
	'/~/accounts/transaction/[chainId]/[address]/[sourceTxHash]/[createdAt]': {
		routeId: '/~/accounts/transaction/[chainId=eip155ChainId]/[address=evmAddress]/[sourceTxHash=stringSegment]/[createdAt=nonNegativeInteger]',
		parameterEncodingByName: {
			sourceTxHash: 'Opaque',
		},
		mappings: [
			{
				id: 'BlockheadBridgeTransaction.AccountSourceTxCreatedAt',
				probeAtomPrefixes: ['/~/accounts/transaction/[chainId]/[address]/[sourceTxHash]/[createdAt]:BlockheadBridgeTransaction.AccountSourceTxCreatedAt'],
				probeCases: [[[0, '1', ['createdAt', 'address', 'chainId', 'sourceTxHash']]]],
			},
		],
	},
	'/~/agents/conversation/[conversationId]': {
		routeId: '/~/agents/conversation/[conversationId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadAgentConversation.Id',
				probeAtomPrefixes: ['/~/agents/conversation/[conversationId]:BlockheadAgentConversation.Id'],
				probeCases: [[[0, '1', ['conversationId']]]],
			},
		],
	},
	'/~/agents/conversation/[conversationId]/turn/[turnId]': {
		routeId: '/~/agents/conversation/[conversationId=stringSegment]/(blockheadAgentConversation)/turn/[turnId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadAgentConversationTurn.ConversationTurnId',
				probeAtomPrefixes: ['/~/agents/conversation/[conversationId]/turn/[turnId]:BlockheadAgentConversationTurn.ConversationTurnId'],
				probeCases: [[[0, '1', ['turnId', 'conversationId']]]],
			},
		],
	},
	'/~/dashboard/[dashboardId]': {
		routeId: '/~/dashboard/[dashboardId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadPanelTree.Id',
				probeAtomPrefixes: ['/~/dashboard/[dashboardId]:BlockheadPanelTree.Id'],
				probeCases: [[[0, '1', ['dashboardId']]]],
			},
		],
	},
	'/~/manage/source/[sourceId]': {
		routeId: '/~/manage/source/[sourceId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadSource.Id',
				probeAtomPrefixes: ['/~/manage/source/[sourceId]:BlockheadSource.Id'],
				probeCases: [[[0, '1', ['sourceId']]]],
			},
		],
	},
	'/~/multiplayer/contact/[contactId]': {
		routeId: '/~/multiplayer/contact/[contactId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadRoomPeer.Id',
				probeAtomPrefixes: ['/~/multiplayer/contact/[contactId]:BlockheadRoomPeer.Id'],
				probeCases: [[[0, '1', ['contactId']]]],
			},
		],
	},
	'/~/multiplayer/room/[roomId]': {
		routeId: '/~/multiplayer/room/[roomId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadRoom.Id',
				probeAtomPrefixes: ['/~/multiplayer/room/[roomId]:BlockheadRoom.Id'],
				probeCases: [[[0, '1', ['roomId']]]],
			},
		],
	},
	'/~/session/[sessionId]': {
		routeId: '/~/session/[sessionId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadSession.Id',
				probeAtomPrefixes: ['/~/session/[sessionId]:BlockheadSession.Id'],
				probeCases: [[[0, '1', ['sessionId']]]],
			},
		],
	},
	'/~/wallets/connections/[connectionKey]': {
		routeId: '/~/wallets/connections/[connectionKey=stringSegment]',
		mappings: [
			{
				id: 'BlockheadWalletConnection.ConnectionKey',
				probeAtomPrefixes: ['/~/wallets/connections/[connectionKey]:BlockheadWalletConnection.ConnectionKey'],
				probeCases: [[[0, '1', ['connectionKey']]]],
			},
		],
	},
	'/~/wallets/requests/[id]': {
		routeId: '/~/wallets/requests/[id=stringSegment]',
		mappings: [
			{
				id: 'BlockheadWalletRequest.Id',
				probeAtomPrefixes: ['/~/wallets/requests/[id]:BlockheadWalletRequest.Id'],
				probeCases: [[[0, '1', ['id']]]],
			},
		],
	},
	'/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]': {
		routeId: '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]',
		mappings: [
			{
				id: 'BridgeRoute.Quote',
				probeAtomPrefixes: ['/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]:BridgeRoute.Quote'],
				probeCases: [[[0, '1', ['fromChainId', 'toChainId', 'fromToken', 'toToken', 'fromAmount', 'fromAddress', 'slippage', 'toAddress']]]],
			},
		],
	},
	'/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex]': {
		routeId: '/bridge/route/[fromChainId=nonNegativeInteger]/[toChainId=nonNegativeInteger]/[fromToken=stringSegment]/[toToken=stringSegment]/[fromAmount=nonNegativeBigInt]/[fromAddress=evmAddress]/[slippage=nonNegativeNumber]/[toAddress=evmAddress]/(bridgeRoute)/step/[stepIndex=bridgeRouteStepIndex]',
		mappings: [
			{
				id: 'BridgeRouteStep.RouteIndexInRoute',
				probeAtomPrefixes: ['/bridge/route/[fromChainId]/[toChainId]/[fromToken]/[toToken]/[fromAmount]/[fromAddress]/[slippage]/[toAddress]/step/[stepIndex]:BridgeRouteStep.RouteIndexInRoute'],
				probeCases: [[[0, '1', ['stepIndex', 'fromChainId', 'toChainId', 'fromToken', 'toToken', 'fromAmount', 'fromAddress', 'slippage', 'toAddress']]]],
			},
		],
	},
	'/bridge/transfer/across/[originChainId]/[depositId]': {
		routeId: '/bridge/transfer/across/[originChainId=nonNegativeInteger]/[depositId=nonNegativeInteger]',
		mappings: [
			{
				id: 'BridgeTransfer.OriginChainIdDepositId',
				probeAtomPrefixes: ['/bridge/transfer/across/[originChainId]/[depositId]:BridgeTransfer.OriginChainIdDepositId'],
				probeCases: [[[0, '1', ['originChainId', 'depositId']]]],
			},
		],
	},
	'/channel/[channelId]': {
		routeId: '/channel/[channelId=stringSegment]',
		mappings: [
			{
				id: 'BlockheadStateChannel.Id',
				probeAtomPrefixes: ['/channel/[channelId]:BlockheadStateChannel.Id'],
				probeCases: [[[0, '1', ['channelId']]]],
			},
		],
	},
	'/services/agent/[chainId]/[contractAddress]/[tokenId]': {
		routeId: '/services/agent/[chainId=eip155ChainId]/[contractAddress=evmAddress]/[tokenId=stringSegment]',
		mappings: [
			{
				id: 'EvmNft.EvmContractTokenId',
				probeAtomPrefixes: ['/services/agent/[chainId]/[contractAddress]/[tokenId]:EvmNft.EvmContractTokenId'],
				probeCases: [[[0, '1', ['tokenId', 'chainId', 'contractAddress']]]],
			},
		],
	},
} as const satisfies Record<string, E2eRouteFixtureMetadata>

type E2eRouteProbeAtomForReference<
	_Prefixes extends readonly string[],
	_Reference
> = _Reference extends readonly [
	prefixIndex: infer _PrefixIndex extends number,
	caseNumber: infer _CaseNumber extends string,
	fields: infer _Fields extends readonly string[],
] ? `${_Prefixes[_PrefixIndex]}.${_CaseNumber}.${_Fields[number]}` : never

type E2eRouteProbeAtomForMapping<_Mapping> = _Mapping extends {
	probeAtomPrefixes: infer _Prefixes extends readonly string[]
	probeCases: infer _Cases extends readonly (readonly (readonly [number, string, readonly string[]])[])[]
} ? {
	[_Case in keyof _Cases]: E2eRouteProbeAtomForReference<_Prefixes, _Cases[_Case][number]>
}[number] : never

export type E2eRouteProbeAtom = E2eRouteProbeAtomForMapping<
	(typeof e2eRouteFixtureMetadataByNodeId)[keyof typeof e2eRouteFixtureMetadataByNodeId]['mappings'][number]
>

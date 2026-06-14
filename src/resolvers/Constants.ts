import { resolverContextRowLimit } from '$/resolvers/$resolvers.ts'
import {
	bridgeToolByKey,
	CoinInstanceRepresentation,
} from '$/constants/Bridge.ts'
import { CoinId } from '$/constants/Coin.ts'
import {
	currencies,
	currencyByIso4217,
	currencyCatalogSnapshotTimestampMs,
} from '$/constants/Currency.ts'
import { ensProtocolFieldValues } from '$/constants/EnsProtocol.ts'
import { evmProtocolFieldValues } from '$/constants/EvmProtocol.ts'
import { ipfsProtocolFieldValues } from '$/constants/IpfsProtocol.ts'
import {
	MarketAssetKind,
	MarketKind,
} from '$/constants/Market.ts'
import {
	catalogCoinUsdMarketIdByCoinId,
	catalogMarketsWithCoinAsQuoteByQuoteCoinId,
} from '$/constants/MarketCatalog.ts'
import { stringify } from 'devalue'
import { NetworkExecutionUpgradeLayer } from '$/schema/NetworkUpgradeProtocols.ts'
import {
	networkByCaip2,
	networkBySlug,
	NetworkResourceKind,
	networkResourceUrlsByNetworkSlug,
	NetworkNamespace,
	networks,
} from '$/constants/Network.ts'
import {
	NetworkStackId,
	networkStackByNetworkStackId,
} from '$/constants/NetworkStack.ts'
import {
	ExecutionEnvironmentId,
	executionEnvironmentByExecutionEnvironmentId,
} from '$/constants/ExecutionEnvironment.ts'
import {
	ConsensusMechanismId,
	consensusMechanismById,
} from '$/constants/ConsensusMechanism.ts'
import { AssetInstanceKind } from '$/schema/AssetInstance.ts'
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import {
	proposalCategoryById,
	proposalKindIds,
	proposalKindAllowedInRealmByKey,
	specificationRealmById,
} from '$/constants/SpecificationProposal.ts'
import { activityPubNetworkFieldValues, activityPubNetworkSeedActors } from '$/constants/Social/ActivityPub.ts'
import { atprotoNetworkFieldValues, atprotoNetworkSeedActors } from '$/constants/Social/Atproto.ts'
import { lensNetworkFieldValues, lensNetworkSeedAccounts } from '$/constants/Social/Lens.ts'
import {
	nostrNetworkFieldValues,
	nostrNetworkSeedProfiles,
	nostrNetworkSeedRelays,
} from '$/constants/Social/Nostr.ts'
import { nearMainnetRpcEndpoints } from '$/constants/NearNetwork.ts'
import { redditNetworkFieldValues, redditNetworkSeedSubreddits } from '$/constants/Social/Reddit.ts'
import { rssNetworkFieldValues, rssNetworkSeedFeeds } from '$/constants/Social/Rss.ts'
import { solanaMainnetRpcEndpoints } from '$/constants/SolanaNetwork.ts'
import { swarmProtocolFieldValues } from '$/constants/SwarmProtocol.ts'
import {
	zeroGChainId,
	zeroGMainnetExplorerEndpoints,
	zeroGMainnetRpcEndpoints,
	zeroGMainnetStorageEndpoints,
} from '$/constants/ZeroGNetwork.ts'
import {
	youtubeNetworkFieldValues,
	youtubeNetworkSeedChannels,
	youtubeNetworkSeedPlaylists,
	youtubeNetworkSeedVideos,
} from '$/constants/Social/YouTube.ts'
import { xNetworkFieldValues, xNetworkSeedUsers } from '$/constants/Social/X.ts'
import { xmtpNetworkFieldValues } from '$/constants/Social/Xmtp.ts'
import {
	defineResolver,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
} from '$/schema/$schema.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import type { EntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { Source } from '$/sources/Source.ts'
import type { Entity } from '$/schema/$schema.ts'
import {
	precompilesByChainId,
} from '$/constants/precompiles/index.ts'
import { standardPrecompiles } from '$/constants/precompiles/standard.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { EvmNetworkSelector } from '$/schema/EvmNetwork.ts'
import { _GlobalSelector } from '$/schema/_Global.ts'
import { EthereumNetworkUpgradeSelector } from '$/schema/EthereumNetworkUpgrade.ts'
import { EthereumExecutionUpgradeSelector } from '$/schema/EthereumExecutionUpgrade.ts'
import { EthereumConsensusUpgradeSelector } from '$/schema/EthereumConsensusUpgrade.ts'
import { MarketVenueSelector } from '$/schema/MarketVenue.ts'
import { CurrencySelector } from '$/schema/Currency.ts'
import { Currency_TimestampSelector } from '$/schema/Currency_Timestamp.ts'
import { MarketSelector } from '$/schema/Market.ts'
import { EvmContractSelector } from '$/schema/EvmContract.ts'
import { CoinSelector } from '$/schema/Coin.ts'
import { EvmCoinInstanceSelector } from '$/schema/EvmCoinInstance.ts'
import { CoinBridgeCapabilitySelector } from '$/schema/CoinBridgeCapability.ts'
import { MarketPriceSelector } from '$/schema/MarketPrice.ts'
import { Market_TimeInterval_TimestampSelector } from '$/schema/Market_TimeInterval_Timestamp.ts'
import { UrlSelector } from '$/schema/Url.ts'
import { MevRelaySelector } from '$/schema/MevRelay.ts'
import { NetworkSelector } from '$/schema/Network.ts'
import { NearNetworkSelector } from '$/schema/NearNetwork.ts'
import { ZeroGNetworkSelector } from '$/schema/ZeroGNetwork.ts'
import { QuilibriumNetworkSelector } from '$/schema/QuilibriumNetwork.ts'
import { SolanaNetworkSelector } from '$/schema/SolanaNetwork.ts'
import { NetworkStackSelector } from '$/schema/NetworkStack.ts'
import { ElementsNetworkSelector } from '$/schema/ElementsNetwork.ts'
import { ExecutionEnvironmentSelector } from '$/schema/ExecutionEnvironment.ts'
import { ConsensusMechanismSelector } from '$/schema/ConsensusMechanism.ts'
import { AssetInstanceSelector } from '$/schema/AssetInstance.ts'
import { BittensorSubnetSelector } from '$/schema/BittensorSubnet.ts'
import { NetworkUpgradeSelector } from '$/schema/NetworkUpgrade.ts'
import { CosmosGovernanceProposalSelector } from '$/schema/CosmosGovernanceProposal.ts'
import { PolkadotReferendumSelector } from '$/schema/PolkadotReferendum.ts'
import { SpecificationRealmSelector } from '$/schema/SpecificationRealm.ts'
import { SpecificationProposalKindSelector } from '$/schema/SpecificationProposalKind.ts'
import { ActivityPubNetworkSelector } from '$/schema/ActivityPubNetwork.ts'
import { AtprotoNetworkSelector } from '$/schema/AtprotoNetwork.ts'
import { EnsProtocolSelector } from '$/schema/EnsProtocol.ts'
import { EvmProtocolSelector } from '$/schema/EvmProtocol.ts'
import { IpfsProtocolSelector } from '$/schema/IpfsProtocol.ts'
import { SwarmProtocolSelector } from '$/schema/SwarmProtocol.ts'
import { LensNetworkSelector } from '$/schema/LensNetwork.ts'
import { NostrNetworkSelector } from '$/schema/NostrNetwork.ts'
import { RedditNetworkSelector } from '$/schema/RedditNetwork.ts'
import { RssNetworkSelector } from '$/schema/RssNetwork.ts'
import { XNetworkSelector } from '$/schema/XNetwork.ts'
import { XmtpNetworkSelector } from '$/schema/XmtpNetwork.ts'
import { YouTubeNetworkSelector } from '$/schema/YouTubeNetwork.ts'

const networkStackIdByNamespace = {
	[NetworkNamespace.Bittensor]: NetworkStackId.Bittensor,
	[NetworkNamespace.Bitcoin]: NetworkStackId.Bitcoin,
	[NetworkNamespace.BitcoinCash]: NetworkStackId.BitcoinCash,
	[NetworkNamespace.Cosmos]: NetworkStackId.CosmosSdkCometBft,
	[NetworkNamespace.Dogecoin]: NetworkStackId.Dogecoin,
	[NetworkNamespace.Elements]: NetworkStackId.Elements,
	[NetworkNamespace.Evm]: NetworkStackId.Ethereum,
	[NetworkNamespace.Filecoin]: NetworkStackId.Filecoin,
	[NetworkNamespace.Hyperliquid]: NetworkStackId.Hyperliquid,
	[NetworkNamespace.Lightning]: NetworkStackId.Lightning,
	[NetworkNamespace.Litecoin]: NetworkStackId.Litecoin,
	[NetworkNamespace.Logos]: NetworkStackId.Logos,
	[NetworkNamespace.Monero]: NetworkStackId.Monero,
	[NetworkNamespace.Near]: NetworkStackId.Near,
	[NetworkNamespace.Polkadot]: NetworkStackId.PolkadotSdk,
	[NetworkNamespace.Quilibrium]: NetworkStackId.Quilibrium,
	[NetworkNamespace.Solana]: NetworkStackId.Solana,
	[NetworkNamespace.Tron]: NetworkStackId.Tron,
	[NetworkNamespace.Zcash]: NetworkStackId.Zcash,
	[NetworkNamespace.ZeroG]: NetworkStackId.ZeroG,
} as const satisfies Record<NetworkNamespace, NetworkStackId>

const executionEnvironmentIdsByNamespace = {
	[NetworkNamespace.Bittensor]: [
		ExecutionEnvironmentId.BittensorSubtensorRuntime,
	],
	[NetworkNamespace.Bitcoin]: [
		ExecutionEnvironmentId.BitcoinScript,
	],
	[NetworkNamespace.BitcoinCash]: [
		ExecutionEnvironmentId.BitcoinCashScript,
	],
	[NetworkNamespace.Cosmos]: [
		ExecutionEnvironmentId.CosmWasm,
	],
	[NetworkNamespace.Dogecoin]: [
		ExecutionEnvironmentId.BitcoinScript,
	],
	[NetworkNamespace.Elements]: [
		ExecutionEnvironmentId.ElementsScript,
	],
	[NetworkNamespace.Evm]: [
		ExecutionEnvironmentId.Evm,
	],
	[NetworkNamespace.Filecoin]: [
		ExecutionEnvironmentId.FilecoinVm,
	],
	[NetworkNamespace.Hyperliquid]: [
		ExecutionEnvironmentId.HyperEvm,
	],
	[NetworkNamespace.Lightning]: [
		ExecutionEnvironmentId.LightningProtocol,
	],
	[NetworkNamespace.Litecoin]: [
		ExecutionEnvironmentId.BitcoinScript,
	],
	[NetworkNamespace.Logos]: [
		ExecutionEnvironmentId.LogosBlockchainRuntime,
	],
	[NetworkNamespace.Monero]: [],
	[NetworkNamespace.Near]: [
		ExecutionEnvironmentId.NearRuntime,
	],
	[NetworkNamespace.Polkadot]: [
		ExecutionEnvironmentId.SubstrateRuntime,
	],
	[NetworkNamespace.Quilibrium]: [
		ExecutionEnvironmentId.QuilibriumQcl,
	],
	[NetworkNamespace.Solana]: [
		ExecutionEnvironmentId.SolanaSvm,
	],
	[NetworkNamespace.Tron]: [
		ExecutionEnvironmentId.TronTvm,
	],
	[NetworkNamespace.Zcash]: [
		ExecutionEnvironmentId.BitcoinScript,
	],
	[NetworkNamespace.ZeroG]: [
		ExecutionEnvironmentId.ZeroGChainEvm,
		ExecutionEnvironmentId.ZeroGServingFramework,
	],
} as const satisfies Record<NetworkNamespace, readonly ExecutionEnvironmentId[]>

const consensusMechanismIdsByNamespace = {
	[NetworkNamespace.Bittensor]: [
		ConsensusMechanismId.BittensorYumaConsensus,
	],
	[NetworkNamespace.Bitcoin]: [
		ConsensusMechanismId.NakamotoProofOfWork,
	],
	[NetworkNamespace.BitcoinCash]: [
		ConsensusMechanismId.NakamotoProofOfWork,
	],
	[NetworkNamespace.Cosmos]: [
		ConsensusMechanismId.CometBft,
	],
	[NetworkNamespace.Dogecoin]: [
		ConsensusMechanismId.DogecoinAuxProofOfWork,
	],
	[NetworkNamespace.Elements]: [],
	[NetworkNamespace.Evm]: [
		ConsensusMechanismId.EthereumBeaconProofOfStake,
	],
	[NetworkNamespace.Filecoin]: [
		ConsensusMechanismId.FilecoinExpectedConsensus,
	],
	[NetworkNamespace.Hyperliquid]: [
		ConsensusMechanismId.HyperBft,
	],
	[NetworkNamespace.Lightning]: [],
	[NetworkNamespace.Litecoin]: [
		ConsensusMechanismId.NakamotoProofOfWork,
	],
	[NetworkNamespace.Logos]: [
		ConsensusMechanismId.LogosBedrock,
	],
	[NetworkNamespace.Monero]: [
		ConsensusMechanismId.MoneroRandomXProofOfWork,
	],
	[NetworkNamespace.Near]: [
		ConsensusMechanismId.NearNightshade,
	],
	[NetworkNamespace.Polkadot]: [
		ConsensusMechanismId.PolkadotNposBabeGrandpa,
	],
	[NetworkNamespace.Quilibrium]: [
		ConsensusMechanismId.QuilibriumProofOfMeaningfulWork,
	],
	[NetworkNamespace.Solana]: [
		ConsensusMechanismId.SolanaProofOfHistoryTowerBft,
	],
	[NetworkNamespace.Tron]: [
		ConsensusMechanismId.TronDpos,
	],
	[NetworkNamespace.Zcash]: [
		ConsensusMechanismId.ZcashProofOfWork,
	],
	[NetworkNamespace.ZeroG]: [
		ConsensusMechanismId.ZeroGProofOfStake,
	],
} as const satisfies Record<NetworkNamespace, readonly ConsensusMechanismId[]>

const nativeAssetCoinIdByNamespace = {
	[NetworkNamespace.Bittensor]: CoinId.TAO,
	[NetworkNamespace.Bitcoin]: CoinId.BTC,
	[NetworkNamespace.BitcoinCash]: CoinId.BCH,
	[NetworkNamespace.Cosmos]: CoinId.ATOM,
	[NetworkNamespace.Dogecoin]: CoinId.DOGE,
	[NetworkNamespace.Elements]: CoinId.BTC,
	[NetworkNamespace.Evm]: CoinId.ETH,
	[NetworkNamespace.Filecoin]: CoinId.FIL,
	[NetworkNamespace.Hyperliquid]: CoinId.HYPE,
	[NetworkNamespace.Lightning]: undefined,
	[NetworkNamespace.Litecoin]: CoinId.LTC,
	[NetworkNamespace.Logos]: undefined,
	[NetworkNamespace.Monero]: CoinId.XMR,
	[NetworkNamespace.Near]: CoinId.NEAR,
	[NetworkNamespace.Polkadot]: CoinId.DOT,
	[NetworkNamespace.Quilibrium]: CoinId.QUIL,
	[NetworkNamespace.Solana]: CoinId.SOL,
	[NetworkNamespace.Tron]: CoinId.TRX,
	[NetworkNamespace.Zcash]: CoinId.ZEC,
	[NetworkNamespace.ZeroG]: CoinId._0G,
} as const satisfies Record<NetworkNamespace, CoinId | undefined>

const zeroGEvmNetworkId = {
	caip2: {
		namespace: 'eip155',
		reference: String(zeroGChainId),
	},
} as const

const networkResourceUrlEntitySelectors = (
	slug: string,
	kind: NetworkResourceKind,
) => (
	networkResourceUrlsByNetworkSlug[slug]
		?.filter((resource) => resource.kind === kind)
		.map((resource) => ({
			[EntityMetaKey.Selector]: {
				url: resource.url,
			},
		}))
	?? []
)


export default {
	source: Source.Constants_Internal,

	resolvers: [
		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EthereumNetworkUpgrade,
			resolve: {
				[EthereumNetworkUpgradeSelector.EvmNetworkUpgradeId]: async ({ $network, upgradeId }) => {
				const {
					networkUpgradeByChainIdAndUpgradeId,
					networkExecutionUpgradeByChainIdAndUpgradeId,
					networkConsensusUpgradeByChainIdAndUpgradeId,
				} = await import(
					'$/constants/EthereumNetworkUpgrades.ts'
				)
				const networkUpgrade = networkUpgradeByChainIdAndUpgradeId[
					`${$network.caip2.reference}:${upgradeId}`
				]
				if (networkUpgrade.$networkExecutionUpgrade == null)
					throw new Error(`Constants_Internal: NetworkUpgrade ${$network.caip2.reference}:${upgradeId} has no $networkExecutionUpgrade`)

				const linkedNetworkExecutionUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[
					`${networkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Selector].$network.caip2.reference}:${networkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Selector].upgradeId}`
				]
				const linkedNetworkConsensusUpgrade = (
					networkUpgrade.$networkConsensusUpgrade == null ?
						undefined
					:
						networkConsensusUpgradeByChainIdAndUpgradeId[
							`${networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Selector].$network.caip2.reference}:${networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Selector].upgradeId}`
						]
				)
				const activationTimestampsMs = [
					linkedNetworkExecutionUpgrade.activationTimestampMs,
					linkedNetworkConsensusUpgrade?.activationTimestampMs,
				].filter((timestamp): timestamp is number => timestamp != null)
				const proposals = [
					...(linkedNetworkExecutionUpgrade.$$proposals ?? []),
					...(linkedNetworkConsensusUpgrade?.$$proposals ?? []),
				].filter((proposal, index, proposals) => (
					proposals.findIndex((otherProposal) => (
						stringify(otherProposal[EntityMetaKey.Selector]) === stringify(proposal[EntityMetaKey.Selector])
					)) === index
				))

				return {
					...networkUpgrade,
					...(linkedNetworkExecutionUpgrade.activationBlock != null && {
						activationBlock: linkedNetworkExecutionUpgrade.activationBlock,
					}),
					...(linkedNetworkExecutionUpgrade.activationBlock == null && linkedNetworkConsensusUpgrade?.activationBlock != null && {
						activationBlock: linkedNetworkConsensusUpgrade.activationBlock,
					}),
					...(activationTimestampsMs.length > 0 && {
						activationTimestampMs: Math.max(...activationTimestampsMs),
					}),
					...(linkedNetworkConsensusUpgrade?.activationEpoch != null && {
						activationEpoch: linkedNetworkConsensusUpgrade.activationEpoch,
					}),
					...(linkedNetworkConsensusUpgrade?.activationEpoch == null && linkedNetworkExecutionUpgrade.activationEpoch != null && {
						activationEpoch: linkedNetworkExecutionUpgrade.activationEpoch,
					}),
					...(proposals.length > 0 && { $$proposals: proposals }),
				}
			}
			},
		})({
			fields: {
				name: (upgrade) => upgrade.name,
				slug: (upgrade) => upgrade.slug,
				activationBlock: (upgrade) => upgrade.activationBlock,
				activationTimestampMs: (upgrade) => upgrade.activationTimestampMs,
				activationEpoch: (upgrade) => upgrade.activationEpoch,
				$networkExecutionUpgrade: (upgrade) => upgrade.$networkExecutionUpgrade,
				$networkConsensusUpgrade: (upgrade) => upgrade.$networkConsensusUpgrade,
				$$proposals: (upgrade) => upgrade.$$proposals,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EthereumExecutionUpgrade,
			resolve: {
				[EthereumExecutionUpgradeSelector.EvmNetworkUpgradeId]: async ({ $network, upgradeId }) => {
				const { networkExecutionUpgradeByChainIdAndUpgradeId } = await import(
					'$/constants/EthereumNetworkUpgrades.ts'
				)
				const networkExecutionUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[
					`${$network.caip2.reference}:${upgradeId}`
				]

				return { ...networkExecutionUpgrade }
			}
			},
		})({
			fields: {
				name: (upgrade) => upgrade.name,
				slug: (upgrade) => upgrade.slug,
				activationBlock: (upgrade) => upgrade.activationBlock,
				activationTimestampMs: (upgrade) => upgrade.activationTimestampMs,
				activationEpoch: (upgrade) => upgrade.activationEpoch,
				protocol: (upgrade) => upgrade.protocol,
				layer: (upgrade) => upgrade.layer,
				forkHash: (upgrade) => upgrade.forkHash,
				linkEthereumOrg: (upgrade) => upgrade.linkEthereumOrg,
				linkExecutionDocs: (upgrade) => upgrade.linkExecutionDocs,
				linkForkcast: (upgrade) => upgrade.linkForkcast,
				executionSpecsPinnedMarkdownFilename: (upgrade) => upgrade.executionSpecsPinnedMarkdownFilename,
				$$proposals: (upgrade) => upgrade.$$proposals,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EthereumConsensusUpgrade,
			resolve: {
				[EthereumConsensusUpgradeSelector.EvmNetworkUpgradeId]: async ({ $network, upgradeId }) => {
				const { networkConsensusUpgradeByChainIdAndUpgradeId } = await import(
					'$/constants/EthereumNetworkUpgrades.ts'
				)
				const networkConsensusUpgrade = networkConsensusUpgradeByChainIdAndUpgradeId[
					`${$network.caip2.reference}:${upgradeId}`
				]

				return { ...networkConsensusUpgrade }
			}
			},
		})({
			fields: {
				name: (upgrade) => upgrade.name,
				slug: (upgrade) => upgrade.slug,
				activationBlock: (upgrade) => upgrade.activationBlock,
				activationTimestampMs: (upgrade) => upgrade.activationTimestampMs,
				activationEpoch: (upgrade) => upgrade.activationEpoch,
				protocol: (upgrade) => upgrade.protocol,
				linkEthereumOrg: (upgrade) => upgrade.linkEthereumOrg,
				linkConsensusDocs: (upgrade) => upgrade.linkConsensusDocs,
				linkForkcast: (upgrade) => upgrade.linkForkcast,
				$$proposals: (upgrade) => upgrade.$$proposals,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.MarketVenue,
			resolve: {
				[MarketVenueSelector.MarketVenueId]: async ({ marketVenueId }) => {
				const { marketVenueById } = await import('$/constants/MarketVenue.ts')
				return {
					label: marketVenueById[marketVenueId].label,
				}
			}
			},
		})({
			fields: {
				label: (marketVenue) => marketVenue.label,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async ({ iso4217 }) => {
				const currency = currencyByIso4217[iso4217]
				if (currency == null) {
					throw new Error(`Constants_Internal: Currency not found for ${iso4217}`)
				}
				return {
					name: currency.name,
					symbol: currency.symbol,
					minorUnitExponent: currency.minorUnitExponent,
				}
			}
			},
		})({
			fields: {
				name: (currency) => currency.name,
				symbol: (currency) => currency.symbol,
				minorUnitExponent: (currency) => currency.minorUnitExponent,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Currency_Timestamp,
			resolve: {
				[Currency_TimestampSelector.CurrencyTimestampMs]: async ({ $currency, timestampMs }) => {
				const currency = currencyByIso4217[$currency.iso4217]
				if (currency == null) {
					throw new Error(`Constants_Internal: Currency not found for ${$currency.iso4217}`)
				}
				if (timestampMs !== currencyCatalogSnapshotTimestampMs) {
					throw new Error(`Constants_Internal: Currency snapshot not found for ${$currency.iso4217}:${String(timestampMs)}`)
				}
				return {
					marketCap: BigInt(currency.marketCapUsd),
				}
			}
			},
		})({
			fields: {
				marketCap: (currencyTimestamp) => currencyTimestamp.marketCap,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address: addressSelector }) => {
				const address = hexLowerOfByteSize(addressSelector, 20)
				if (address == null) {
					throw new Error('Constants_Internal: EvmContract address not normalized')
				}
				const chainPrecompiles = (
					precompilesByChainId[Number($network.caip2.reference)]
					?? standardPrecompiles
				)
				const precompileName = chainPrecompiles.find((precompile) => (
					precompile.address.toLowerCase() === address.toLowerCase()
				))?.name
				if (precompileName == null) {
					throw new Error(`Constants_Internal: EvmContract ${address} is not a catalog precompile on chain ${String(Number($network.caip2.reference))}`)
				}
				return {
					precompileName,
				}
			}
			},
		})({
			fields: {
				precompileName: (contract) => contract.precompileName,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const coin = coinById[coinId]
				return {
					symbol: coin.symbol,
				}
			}
			},
		})({
			fields: {
				symbol: (coin) => coin.symbol,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EvmCoinInstanceSelector.NetworkType]: async ({ $network, type }) => {
				if (
					type !== CoinInstanceType.NativeCurrency
					|| Number($network.caip2.reference) !== 1
				) {
					throw new Error('Constants_Internal: CoinInstance not found')
				}
				return {
					coinId: CoinId.ETH,
					symbol: 'ETH',
					decimals: 18,
					representation: CoinInstanceRepresentation.IssuerNative,
				}
			},
[EvmCoinInstanceSelector.NetworkTypeContract]: async ({ $network, type }) => {
				if (
					type !== CoinInstanceType.NativeCurrency
					|| Number($network.caip2.reference) !== 1
				) {
					throw new Error('Constants_Internal: CoinInstance not found')
				}
				return {
					coinId: CoinId.ETH,
					symbol: 'ETH',
					decimals: 18,
					representation: CoinInstanceRepresentation.IssuerNative,
				}
			}
			},
		})({
			fields: {
				coinId: (coinInstance) => coinInstance.coinId,
				symbol: (coinInstance) => coinInstance.symbol,
				decimals: (coinInstance) => coinInstance.decimals,
				representation: (coinInstance) => coinInstance.representation,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.CoinBridgeCapability,
			resolve: {
				[CoinBridgeCapabilitySelector.EvmCoinInstanceEvmCoinInstanceToolKey]: async ({ toolKey }) => {
				const coinBridgeCapabilityFields = bridgeToolByKey[toolKey]
				if (coinBridgeCapabilityFields == null) {
					throw new Error(`Constants_Internal: unknown LI.FI tool key ${toolKey}`)
				}
				return {
					toolKey: toolKey,
					...coinBridgeCapabilityFields,
				}
			}
			},
		})({
			fields: {
				toolKey: (capability) => capability.toolKey,
				railId: (capability) => capability.railId,
				settlementModel: (capability) => capability.settlementModel,
				verificationModel: (capability) => capability.verificationModel,
				assetOutcome: (capability) => capability.assetOutcome,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
				const { beaconRestBaseByExecutionChainId } = await import('$/constants/BeaconConsensus.ts')
				const { executionEndpointsByChainId } = await import('$/constants/ExecutionEndpoints.ts')
				const network = networkByCaip2[`${caip2.namespace}:${caip2.reference}`]
				const beaconRestBase = beaconRestBaseByExecutionChainId[Number(caip2.reference)]
				const executionEndpoints = executionEndpointsByChainId[Number(caip2.reference)] ?? []
				return {
					slug: network.slug,
					name: network.name,
					caip2: network.caip2,
					namespace: network.namespace,
					environment: network.environment,
					executionEndpoints: [...executionEndpoints],
					consensusEndpoints: (
						beaconRestBase == null ?
							[]
						:
							[
								{
									restBaseUrl: beaconRestBase.restBaseUrl,
									consensusProtocol: beaconRestBase.consensusProtocol,
								},
							]
					),
				}
			}
			},
		})({
				fields: {
					slug: (network) => network.slug,
					name: (network) => network.name,
					caip2: (network) => network.caip2,
					namespace: (network) => network.namespace,
					environment: (network) => network.environment,
					executionEndpoints: (network) => network.executionEndpoints,
					consensusEndpoints: (network) => network.consensusEndpoints,
				},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.MevRelay,
			resolve: {
				[MevRelaySelector.EvmNetworkHost]: async ({ host }) => ({
				url: `https://${host}`,
			})
			},
		})({
			fields: {
				url: (relay) => relay.url,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async (entitySelector) => {
					const network = (
						'slug' in entitySelector ?
							networkBySlug[entitySelector.slug]
						:
							networkByCaip2[`${entitySelector.caip2.namespace}:${entitySelector.caip2.reference}`]
					)
					if (network == null) {
						throw new Error(`Constants_Internal: Network not found`)
					}
					return {
						slug: network.slug,
						name: network.name,
						...('caip2' in network && {
							caip2: network.caip2,
						}),
						namespace: network.namespace,
						environment: network.environment,
					}
				},
				[NetworkSelector.Slug]: async (entitySelector) => {
					const network = (
						'slug' in entitySelector ?
							networkBySlug[entitySelector.slug]
						:
							networkByCaip2[`${entitySelector.caip2.namespace}:${entitySelector.caip2.reference}`]
					)
					if (network == null) {
						throw new Error(`Constants_Internal: Network not found`)
					}
					return {
						slug: network.slug,
						name: network.name,
						...('caip2' in network && {
							caip2: network.caip2,
						}),
						namespace: network.namespace,
						environment: network.environment,
					}
				},
			},
		})({
			fields: {
				slug: (network) => network.slug,
				name: (network) => network.name,
				caip2: (network) => network.caip2,
				namespace: (network) => network.namespace,
				environment: (network) => network.environment,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NearNetwork,
			resolve: {
				[NearNetworkSelector.NetworkSlug]: async ({ slug }) => {
				const network = networkBySlug[slug]
				if (network == null) throw new Error('Constants_Internal: NearNetwork not found')
				return {
					slug: network.slug,
					name: network.name,
					...('caip2' in network && {
						caip2: network.caip2,
					}),
					namespace: network.namespace,
					environment: network.environment,
					rpcEndpoints: [
						...nearMainnetRpcEndpoints,
					],
				}
			}
			},
		})({
			fields: {
				slug: (network) => network.slug,
				name: (network) => network.name,
				caip2: (network) => network.caip2,
				namespace: (network) => network.namespace,
				environment: (network) => network.environment,
				rpcEndpoints: (network) => network.rpcEndpoints,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				[ZeroGNetworkSelector.NetworkSlug]: async ({ slug }) => {
				const network = networkBySlug[slug]
				if (network == null) throw new Error('Constants_Internal: ZeroGNetwork not found')
				return {
					slug: network.slug,
					name: network.name,
					...('caip2' in network && {
						caip2: network.caip2,
					}),
					namespace: network.namespace,
					environment: network.environment,
					chainId: zeroGChainId,
					rpcEndpoints: [
						...zeroGMainnetRpcEndpoints,
					],
					explorerEndpoints: [
						...zeroGMainnetExplorerEndpoints,
					],
					storageEndpoints: [
						...zeroGMainnetStorageEndpoints,
					],
					$executionNetwork: {
						[EntityMetaKey.Selector]: zeroGEvmNetworkId,
					},
				}
			}
			},
		})({
			fields: {
				slug: (network) => network.slug,
				name: (network) => network.name,
				caip2: (network) => network.caip2,
				namespace: (network) => network.namespace,
				environment: (network) => network.environment,
				chainId: (network) => network.chainId,
				rpcEndpoints: (network) => network.rpcEndpoints,
				explorerEndpoints: (network) => network.explorerEndpoints,
				storageEndpoints: (network) => network.storageEndpoints,
				$executionNetwork: (network) => network.$executionNetwork,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.QuilibriumNetwork,
			resolve: {
				[QuilibriumNetworkSelector.NetworkSlug]: async ({ slug }) => {
				const network = networkBySlug[slug]
				if (network == null) throw new Error('Constants_Internal: QuilibriumNetwork not found')
				return {
					slug: network.slug,
					name: network.name,
					...('caip2' in network && {
						caip2: network.caip2,
					}),
					namespace: network.namespace,
					environment: network.environment,
				}
			}
			},
		})({
			fields: {
				slug: (network) => network.slug,
				name: (network) => network.name,
				caip2: (network) => network.caip2,
				namespace: (network) => network.namespace,
				environment: (network) => network.environment,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.SolanaNetwork,
			resolve: {
				[SolanaNetworkSelector.Caip2]: async ({ caip2 }) => {
				const network = networkByCaip2[`${caip2.namespace}:${caip2.reference}`]
				if (!('caip2' in network)) throw new Error('Constants_Internal: SolanaNetwork missing CAIP-2')
				return {
					slug: network.slug,
					name: network.name,
					caip2: network.caip2,
					namespace: network.namespace,
					environment: network.environment,
					rpcEndpoints: [
						...solanaMainnetRpcEndpoints,
					],
				}
			}
			},
		})({
			fields: {
				slug: (network) => network.slug,
				name: (network) => network.name,
				caip2: (network) => network.caip2,
				namespace: (network) => network.namespace,
				environment: (network) => network.environment,
				rpcEndpoints: (network) => network.rpcEndpoints,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NetworkStack,
			resolve: {
				[NetworkStackSelector.NetworkStackId]: async ({ networkStackId }) => ({
				label: networkStackByNetworkStackId[networkStackId].label,
			})
			},
		})({
			fields: {
				label: (networkStack) => networkStack.label,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ElementsNetwork,
			resolve: {
				[ElementsNetworkSelector.Network]: async (entitySelector) => {
				const network = (
					'slug' in entitySelector ?
						networkBySlug[entitySelector.slug]
					:
						networkByCaip2[`${entitySelector.caip2.namespace}:${entitySelector.caip2.reference}`]
				)
				if (network?.slug !== networkBySlug.liquid.slug)
					throw new Error('Constants_Internal: unsupported Elements network')

				return {
					$network: {
						[EntityMetaKey.Selector]: {
							slug: network.slug,
						},
					},
					$settlementNetwork: {
						[EntityMetaKey.Selector]: {
							slug: 'bitcoin',
						},
					},
					federationName: 'Liquid Federation',
					blockTimeSeconds: 60,
					confidentialTransactionsDefault: true,
				}
			}
			},
		})({
			fields: {
				$settlementNetwork: (network) => network.$settlementNetwork,
				federationName: (network) => network.federationName,
				blockTimeSeconds: (network) => network.blockTimeSeconds,
				confidentialTransactionsDefault: (network) => network.confidentialTransactionsDefault,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ExecutionEnvironment,
			resolve: {
				[ExecutionEnvironmentSelector.ExecutionEnvironmentId]: async ({ executionEnvironmentId }) => ({
				label: executionEnvironmentByExecutionEnvironmentId[executionEnvironmentId].label,
			})
			},
		})({
			fields: {
				label: (executionEnvironment) => executionEnvironment.label,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ConsensusMechanism,
			resolve: {
				[ConsensusMechanismSelector.ConsensusMechanismId]: async ({ consensusMechanismId }) => ({
				label: consensusMechanismById[consensusMechanismId].label,
			})
			},
		})({
			fields: {
				label: (consensusMechanism) => consensusMechanism.label,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.AssetInstance,
			resolve: {
				[AssetInstanceSelector.NetworkKindAssetKey]: async ({ assetKey, kind }) => ({
				...(kind === AssetInstanceKind.Native && {
					name: assetKey,
					symbol: assetKey,
				}),
			})
			},
		})({
			fields: {
				name: (assetInstance) => assetInstance.name,
				symbol: (assetInstance) => assetInstance.symbol,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.BittensorSubnet,
			resolve: {
				[BittensorSubnetSelector.NetworkNetuid]: async ({ netuid }) => ({
				name: netuid === 0 ? 'Root' : `Subnet ${netuid}`,
			})
			},
		})({
			fields: {
				name: (subnet) => subnet.name,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NetworkUpgrade,
			resolve: {
				[NetworkUpgradeSelector.NetworkUpgradeId]: async ({ upgradeId }) => ({
				name: upgradeId,
			})
			},
		})({
			fields: {
				name: (upgrade) => upgrade.name,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.SpecificationRealm,
			resolve: {
				[SpecificationRealmSelector.Realm]: async ({ realm }) => ({
					label: specificationRealmById[realm].label,
					...(specificationRealmById[realm].labelPlural != null && {
						labelPlural: specificationRealmById[realm].labelPlural,
					}),
					slug: specificationRealmById[realm].slug,
				}),
			},
		})({
			fields: {
				label: (specificationRealm) => specificationRealm.label,
				labelPlural: (specificationRealm) => specificationRealm.labelPlural,
				slug: (specificationRealm) => specificationRealm.slug,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				[SpecificationProposalKindSelector.RealmCategory]: async ({ category }) => (
					{
						label: proposalCategoryById[category].label,
						labelPlural: proposalCategoryById[category].labelPlural,
						slug: proposalCategoryById[category].slug,
					}
				)
			},
		})({
			fields: {
				label: (proposalKind) => proposalKind.label,
				labelPlural: (proposalKind) => proposalKind.labelPlural,
				slug: (proposalKind) => proposalKind.slug,
			},
		}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ActivityPubNetwork,
			resolve: {
				[ActivityPubNetworkSelector.Scope]: async () => activityPubNetworkFieldValues
			},
		})({
				fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.AtprotoNetwork,
			resolve: {
				[AtprotoNetworkSelector.Scope]: async () => atprotoNetworkFieldValues
			},
		})({
				fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EnsProtocol,
			resolve: {
				[EnsProtocolSelector.Scope]: async () => ensProtocolFieldValues
			},
		})({
				fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmProtocol,
			resolve: {
				[EvmProtocolSelector.Scope]: async () => evmProtocolFieldValues
			},
		})({
				fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.IpfsProtocol,
			resolve: {
				[IpfsProtocolSelector.Scope]: async () => ipfsProtocolFieldValues
			},
		})({
				fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.SwarmProtocol,
			resolve: {
				[SwarmProtocolSelector.Scope]: async () => swarmProtocolFieldValues
			},
		})({
				fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.LensNetwork,
			resolve: {
				[LensNetworkSelector.Scope]: async () => lensNetworkFieldValues
			},
		})({
				fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NostrNetwork,
			resolve: {
				[NostrNetworkSelector.Scope]: async () => nostrNetworkFieldValues
			},
		})({
				fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.RedditNetwork,
			resolve: {
				[RedditNetworkSelector.Scope]: async () => redditNetworkFieldValues
			},
		})({
				fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.RssNetwork,
			resolve: {
				[RssNetworkSelector.Scope]: async () => rssNetworkFieldValues
			},
		})({
				fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.XNetwork,
			resolve: {
				[XNetworkSelector.Scope]: async () => xNetworkFieldValues
			},
		})({
				fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.XmtpNetwork,
			resolve: {
				[XmtpNetworkSelector.Scope]: async () => xmtpNetworkFieldValues
			},
		})({
				fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.YouTubeNetwork,
			resolve: {
				[YouTubeNetworkSelector.Scope]: async () => youtubeNetworkFieldValues
			},
		})({
				fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
			}),
		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
				resolve: {
					[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => (
					[...networks].map((network) => ({
						[EntityMetaKey.Selector]: {
							slug: network.slug,
					},
				}))
			)
				},
		})({
				fields: {
				$$networks: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
				const {
					networkUpgrades,
					networkExecutionUpgradeByChainIdAndUpgradeId,
					networkConsensusUpgradeByChainIdAndUpgradeId,
				} = await import('$/constants/EthereumNetworkUpgrades.ts')
				return networkUpgrades.map((networkUpgrade) => {
					if (networkUpgrade.$networkExecutionUpgrade == null)
						throw new Error(`Constants_Internal: NetworkUpgrade ${networkUpgrade[EntityMetaKey.Selector].$network.caip2.reference}:${networkUpgrade[EntityMetaKey.Selector].upgradeId} has no $networkExecutionUpgrade`)

					const linkedNetworkExecutionUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[
						`${networkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Selector].$network.caip2.reference}:${networkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Selector].upgradeId}`
					]
					const linkedNetworkConsensusUpgrade = (
						networkUpgrade.$networkConsensusUpgrade == null ?
							undefined
						:
							networkConsensusUpgradeByChainIdAndUpgradeId[
								`${networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Selector].$network.caip2.reference}:${networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Selector].upgradeId}`
							]
					)
					const activationTimestampsMs = [
						linkedNetworkExecutionUpgrade.activationTimestampMs,
						linkedNetworkConsensusUpgrade?.activationTimestampMs,
					].filter((timestamp): timestamp is number => timestamp != null)
					const proposals = [
						...(linkedNetworkExecutionUpgrade.$$proposals ?? []),
						...(linkedNetworkConsensusUpgrade?.$$proposals ?? []),
					].filter((proposal, index, proposals) => (
						proposals.findIndex((otherProposal) => (
							stringify(otherProposal[EntityMetaKey.Selector]) === stringify(proposal[EntityMetaKey.Selector])
						)) === index
					))

					return {
						...networkUpgrade,
						...(linkedNetworkExecutionUpgrade.activationBlock != null && {
							activationBlock: linkedNetworkExecutionUpgrade.activationBlock,
						}),
						...(linkedNetworkExecutionUpgrade.activationBlock == null && linkedNetworkConsensusUpgrade?.activationBlock != null && {
							activationBlock: linkedNetworkConsensusUpgrade.activationBlock,
						}),
						...(activationTimestampsMs.length > 0 && {
							activationTimestampMs: Math.max(...activationTimestampsMs),
						}),
						...(linkedNetworkConsensusUpgrade?.activationEpoch != null && {
							activationEpoch: linkedNetworkConsensusUpgrade.activationEpoch,
						}),
						...(linkedNetworkConsensusUpgrade?.activationEpoch == null && linkedNetworkExecutionUpgrade.activationEpoch != null && {
							activationEpoch: linkedNetworkExecutionUpgrade.activationEpoch,
						}),
						...(proposals.length > 0 && { $$proposals: proposals }),
						[EntityMetaKey.Selector]: networkUpgrade[EntityMetaKey.Selector],
					}
					})
					}
			},
				})({
				fields: {
						$$networkUpgrades: (entity) => entity,
					},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async (entitySelector: EntitySelector<typeof schema, EntityType.Network>) => {
				const network = (
					'slug' in entitySelector ?
						networkBySlug[entitySelector.slug]
					:
						networkByCaip2[`${entitySelector.caip2.namespace}:${entitySelector.caip2.reference}`]
				)
				if (network == null) return undefined
				const namespace: NetworkNamespace = network.namespace
				return {
					[EntityMetaKey.Selector]: {
						networkStackId: networkStackIdByNamespace[namespace],
					},
				}
				},
[NetworkSelector.Slug]: async (entitySelector: EntitySelector<typeof schema, EntityType.Network>) => {
				const network = (
					'slug' in entitySelector ?
						networkBySlug[entitySelector.slug]
					:
						networkByCaip2[`${entitySelector.caip2.namespace}:${entitySelector.caip2.reference}`]
				)
				if (network == null) return undefined
				const namespace: NetworkNamespace = network.namespace
				return {
					[EntityMetaKey.Selector]: {
						networkStackId: networkStackIdByNamespace[namespace],
					},
				}
				}
			},
			})({
				fields: {
					$networkStack: (entity) => entity,
				},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				[ZeroGNetworkSelector.NetworkSlug]: async ({ slug }) => {
				const network = networkBySlug[slug]
				if (network == null) return undefined
				const namespace: NetworkNamespace = network.namespace
				return {
					[EntityMetaKey.Selector]: {
						networkStackId: networkStackIdByNamespace[namespace],
					},
				}
			}
			},
		})({
				fields: {
				$networkStack: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.QuilibriumNetwork,
			resolve: {
				[QuilibriumNetworkSelector.NetworkSlug]: async ({ slug }) => {
				const network = networkBySlug[slug]
				if (network == null) return undefined
				const namespace: NetworkNamespace = network.namespace
				return {
					[EntityMetaKey.Selector]: {
						networkStackId: networkStackIdByNamespace[namespace],
					},
				}
			}
			},
		})({
				fields: {
				$networkStack: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async (entitySelector: EntitySelector<typeof schema, EntityType.Network>) => {
				const network = (
					'slug' in entitySelector ?
						networkBySlug[entitySelector.slug]
					:
						networkByCaip2[`${entitySelector.caip2.namespace}:${entitySelector.caip2.reference}`]
				)
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				return [...executionEnvironmentIdsByNamespace[namespace]].map((executionEnvironmentId) => ({
					[EntityMetaKey.Selector]: {
						executionEnvironmentId,
					},
				}))
			},
[NetworkSelector.Slug]: async (entitySelector: EntitySelector<typeof schema, EntityType.Network>) => {
				const network = (
					'slug' in entitySelector ?
						networkBySlug[entitySelector.slug]
					:
						networkByCaip2[`${entitySelector.caip2.namespace}:${entitySelector.caip2.reference}`]
				)
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				return [...executionEnvironmentIdsByNamespace[namespace]].map((executionEnvironmentId) => ({
					[EntityMetaKey.Selector]: {
						executionEnvironmentId,
					},
				}))
			}
			},
		})({
				fields: {
				$$executionEnvironments: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				[ZeroGNetworkSelector.NetworkSlug]: async ({ slug }) => {
				const network = networkBySlug[slug]
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				return [...executionEnvironmentIdsByNamespace[namespace]].map((executionEnvironmentId) => ({
					[EntityMetaKey.Selector]: {
						executionEnvironmentId,
					},
				}))
			}
			},
		})({
				fields: {
				$$executionEnvironments: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.QuilibriumNetwork,
			resolve: {
				[QuilibriumNetworkSelector.NetworkSlug]: async ({ slug }) => {
				const network = networkBySlug[slug]
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				return [...executionEnvironmentIdsByNamespace[namespace]].map((executionEnvironmentId) => ({
					[EntityMetaKey.Selector]: {
						executionEnvironmentId,
					},
				}))
			}
			},
		})({
				fields: {
				$$executionEnvironments: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async (entitySelector: EntitySelector<typeof schema, EntityType.Network>) => {
				const network = (
					'slug' in entitySelector ?
						networkBySlug[entitySelector.slug]
					:
						networkByCaip2[`${entitySelector.caip2.namespace}:${entitySelector.caip2.reference}`]
				)
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				return [...consensusMechanismIdsByNamespace[namespace]].map((consensusMechanismId) => ({
					[EntityMetaKey.Selector]: {
						consensusMechanismId,
					},
				}))
			},
[NetworkSelector.Slug]: async (entitySelector: EntitySelector<typeof schema, EntityType.Network>) => {
				const network = (
					'slug' in entitySelector ?
						networkBySlug[entitySelector.slug]
					:
						networkByCaip2[`${entitySelector.caip2.namespace}:${entitySelector.caip2.reference}`]
				)
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				return [...consensusMechanismIdsByNamespace[namespace]].map((consensusMechanismId) => ({
					[EntityMetaKey.Selector]: {
						consensusMechanismId,
					},
				}))
			}
			},
		})({
				fields: {
				$$consensusMechanisms: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				[ZeroGNetworkSelector.NetworkSlug]: async ({ slug }) => {
				const network = networkBySlug[slug]
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				return [...consensusMechanismIdsByNamespace[namespace]].map((consensusMechanismId) => ({
					[EntityMetaKey.Selector]: {
						consensusMechanismId,
					},
				}))
			}
			},
		})({
				fields: {
				$$consensusMechanisms: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.QuilibriumNetwork,
			resolve: {
				[QuilibriumNetworkSelector.NetworkSlug]: async ({ slug }) => {
				const network = networkBySlug[slug]
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				return [...consensusMechanismIdsByNamespace[namespace]].map((consensusMechanismId) => ({
					[EntityMetaKey.Selector]: {
						consensusMechanismId,
					},
				}))
			}
			},
		})({
				fields: {
				$$consensusMechanisms: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async (entitySelector: EntitySelector<typeof schema, EntityType.Network>) => {
				const network = (
					'slug' in entitySelector ?
						networkBySlug[entitySelector.slug]
					:
						networkByCaip2[`${entitySelector.caip2.namespace}:${entitySelector.caip2.reference}`]
				)
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				const coinId = nativeAssetCoinIdByNamespace[namespace]
				if (coinId == null) return []
				return [
					{
						[EntityMetaKey.Selector]: {
							$network: entitySelector,
							kind: AssetInstanceKind.Native,
							assetKey: coinId,
						},
						coinId,
						symbol: coinId,
					},
				]
			},
[NetworkSelector.Slug]: async (entitySelector: EntitySelector<typeof schema, EntityType.Network>) => {
				const network = (
					'slug' in entitySelector ?
						networkBySlug[entitySelector.slug]
					:
						networkByCaip2[`${entitySelector.caip2.namespace}:${entitySelector.caip2.reference}`]
				)
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				const coinId = nativeAssetCoinIdByNamespace[namespace]
				if (coinId == null) return []
				return [
					{
						[EntityMetaKey.Selector]: {
							$network: entitySelector,
							kind: AssetInstanceKind.Native,
							assetKey: coinId,
						},
						coinId,
						symbol: coinId,
					},
				]
			}
			},
		})({
				fields: {
				$$nativeAssets: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async (entitySelector: EntitySelector<typeof schema, EntityType.Network>) => {
				const network = (
					'slug' in entitySelector ?
						networkBySlug[entitySelector.slug]
					:
						networkByCaip2[`${entitySelector.caip2.namespace}:${entitySelector.caip2.reference}`]
				)
				if (network == null) return []
				return networkResourceUrlEntitySelectors(
					network.slug,
					NetworkResourceKind.Faucet,
				)
			},
[NetworkSelector.Slug]: async (entitySelector: EntitySelector<typeof schema, EntityType.Network>) => {
				const network = (
					'slug' in entitySelector ?
						networkBySlug[entitySelector.slug]
					:
						networkByCaip2[`${entitySelector.caip2.namespace}:${entitySelector.caip2.reference}`]
				)
				if (network == null) return []
				return networkResourceUrlEntitySelectors(
					network.slug,
					NetworkResourceKind.Faucet,
				)
			}
			},
		})({
				fields: {
				$$faucetUrls: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Network,
			resolve: {
				[NetworkSelector.Caip2]: async (entitySelector: EntitySelector<typeof schema, EntityType.Network>) => {
				const network = (
					'slug' in entitySelector ?
						networkBySlug[entitySelector.slug]
					:
						networkByCaip2[`${entitySelector.caip2.namespace}:${entitySelector.caip2.reference}`]
				)
				if (network == null) return []
				return networkResourceUrlEntitySelectors(
					network.slug,
					NetworkResourceKind.BlockExplorer,
				)
			},
[NetworkSelector.Slug]: async (entitySelector: EntitySelector<typeof schema, EntityType.Network>) => {
				const network = (
					'slug' in entitySelector ?
						networkBySlug[entitySelector.slug]
					:
						networkByCaip2[`${entitySelector.caip2.namespace}:${entitySelector.caip2.reference}`]
				)
				if (network == null) return []
				return networkResourceUrlEntitySelectors(
					network.slug,
					NetworkResourceKind.BlockExplorer,
				)
			}
			},
		})({
				fields: {
				$$blockExplorerUrls: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => (
				specificationRealmById == null ?
					[]
				:
					Object.values(specificationRealmById).map((realmRow) => ({
						[EntityMetaKey.Selector]: {
							realm: realmRow.id,
						},
					}))
			)
			},
		})({
				fields: {
				$$specificationRealms: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => (
				proposalKindIds.map((proposalKindId) => ({
					[EntityMetaKey.Selector]: proposalKindId,
				}))
			)
			},
		})({
				fields: {
				$$proposalKinds: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.SpecificationRealm,
			resolve: {
				[SpecificationRealmSelector.Realm]: async (entitySelector: EntitySelector<typeof schema, EntityType.SpecificationRealm>) => (
				proposalKindIds
					.filter((proposalKindId) => (
						proposalKindId.realm === entitySelector.realm
					))
					.map((proposalKindId) => ({
						[EntityMetaKey.Selector]: proposalKindId,
					}))
			)
			},
		})({
				fields: {
				$$proposalKinds: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.SpecificationProposalKind,
			resolve: {
				[SpecificationProposalKindSelector.RealmCategory]: async ({ realm }: EntitySelector<typeof schema, EntityType.SpecificationProposalKind>) => (
				{
					[EntityMetaKey.Selector]: {
						realm: realm,
					},
				}
			)
			},
		})({
				fields: {
				$specificationRealm: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
				const { coins } = await import('$/constants/Coin.ts')
				return [
					...coins.map((coin) => (
						{
							[EntityMetaKey.Selector]: {
								coinId: coin.id,
							},
						}
					)),
				]
			}
			},
		})({
				fields: {
				$$coins: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
				const { marketVenues } = await import('$/constants/MarketVenue.ts')
					return [...marketVenues].map((marketVenue) => (
					{
						[EntityMetaKey.Selector]: {
							marketVenueId: marketVenue.id,
						},
					}
				))
			}
			},
		})({
				fields: {
				$$marketVenues: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.MarketVenue,
			resolve: {
				[MarketVenueSelector.MarketVenueId]: async (entitySelector: EntitySelector<typeof schema, EntityType.MarketVenue>) => {
				const { coins } = await import('$/constants/Coin.ts')
				return (
					coins.flatMap((coin) => {
						const marketId = catalogCoinUsdMarketIdByCoinId[coin.id]
						return (
							marketId.$marketVenue.marketVenueId === entitySelector.marketVenueId ?
								[
									{
										[EntityMetaKey.Selector]: marketId,
									},
								]
							:
								[]
						)
					})
				)
			}
			},
		})({
				fields: {
				$$markets: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => (
					[...currencies].map((currency) => (
					{
						[EntityMetaKey.Selector]: {
							iso4217: currency.iso4217,
						},
					}
				))
			)
			},
		})({
				fields: {
				$$currencies: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Currency,
			resolve: {
				[CurrencySelector.Iso4217]: async (entitySelector: EntitySelector<typeof schema, EntityType.Currency>) => {
				const currency = currencyByIso4217[entitySelector.iso4217]
				if (currency == null) return []
				return [
					{
						[EntityMetaKey.Selector]: {
							$currency: entitySelector,
							timestampMs: currencyCatalogSnapshotTimestampMs,
						},
						marketCap: BigInt(currency.marketCapUsd),
					},
				]
			}
			},
		})({
				fields: {
				$$timestamps: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
				const { coins } = await import('$/constants/Coin.ts')
				return (
					coins.map((coin) => (
						{
							[EntityMetaKey.Selector]: catalogCoinUsdMarketIdByCoinId[coin.id],
						}
					))
				)
			}
			},
		})({
				fields: {
				$$markets: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
				const { coins } = await import('$/constants/Coin.ts')
				return (
					coins.map((coin) => (
						{
							[EntityMetaKey.Selector]: {
								$market: catalogCoinUsdMarketIdByCoinId[coin.id],
							},
						}
					))
				)
			}
			},
		})({
				fields: {
				$$marketPrices: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>) => (
				[
					{
						[EntityMetaKey.Selector]: catalogCoinUsdMarketIdByCoinId[coinId],
					},
				]
			)
			},
		})({
				fields: {
				$$marketsWithCoinAsBase: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Coin,
			resolve: {
				[CoinSelector.CoinId]: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>) => (
				(catalogMarketsWithCoinAsQuoteByQuoteCoinId[coinId] ).map((marketId) => ({
					[EntityMetaKey.Selector]: marketId,
				}))
			)
			},
		})({
				fields: {
				$$marketsWithCoinAsQuote: (entity) => entity,
			},
			}),

			defineResolver(Source.Constants_Internal, {
				entityType: EntityType.Coin,
				resolve: {
					[CoinSelector.CoinId]: async ({ coinId }: EntitySelector<typeof schema, EntityType.Coin>) => {
					if (coinId !== CoinId.ETH) return []
					const ethNativeCoinInstance: Entity<typeof schema, EntityType.EvmCoinInstance> = {
						[EntityMetaKey.Selector]: {
							$network: {
								caip2: {
									namespace: 'eip155',
									reference: '1',
								},
							},
							type: CoinInstanceType.NativeCurrency,
						},
						coinId: CoinId.ETH,
						symbol: 'ETH',
						decimals: 18,
						representation: CoinInstanceRepresentation.IssuerNative,
					}
					return [
						ethNativeCoinInstance,
					]
				}
				},
			})({
				fields: {
					$$coinInstances: (entity) => entity,
				},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EvmCoinInstanceSelector.NetworkType]: async () => {
				throw new Error('Constants_Internal: $$outboundBridgeCapabilities is not implemented')
			},
[EvmCoinInstanceSelector.NetworkTypeContract]: async () => {
				throw new Error('Constants_Internal: $$outboundBridgeCapabilities is not implemented')
			}
			},
		})({
				fields: {
				$$outboundBridgeCapabilities: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EvmCoinInstanceSelector.NetworkType]: async () => {
				throw new Error('Constants_Internal: $$inboundBridgeCapabilities is not implemented')
			},
[EvmCoinInstanceSelector.NetworkTypeContract]: async () => {
				throw new Error('Constants_Internal: $$inboundBridgeCapabilities is not implemented')
			}
			},
		})({
				fields: {
				$$inboundBridgeCapabilities: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EvmCoinInstanceSelector.NetworkType]: async () => {
				throw new Error('Constants_Internal: $canonicalInstance is unsupported')
			},
[EvmCoinInstanceSelector.NetworkTypeContract]: async () => {
				throw new Error('Constants_Internal: $canonicalInstance is unsupported')
			}
			},
		})({
				fields: {
				$canonicalInstance: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EvmCoinInstanceSelector.NetworkType]: async ({ $network, type }) => {
				if (
					type === CoinInstanceType.NativeCurrency
					&& Number($network.caip2.reference) === 1
				) {
					return CoinInstanceRepresentation.IssuerNative
				}
				throw new Error('Constants_Internal: CoinInstance representation unsupported')
			},
[EvmCoinInstanceSelector.NetworkTypeContract]: async ({ $network, type }) => {
				if (
					type === CoinInstanceType.NativeCurrency
					&& Number($network.caip2.reference) === 1
				) {
					return CoinInstanceRepresentation.IssuerNative
				}
				throw new Error('Constants_Internal: CoinInstance representation unsupported')
			}
			},
		})({
				fields: {
				representation: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Market,
			resolve: {
				[MarketSelector.BaseQuoteMarketVenueKind]: async ({ $base }: EntitySelector<typeof schema, EntityType.Market>) => (
				$base.kind === MarketAssetKind.Coin ?
					{
						[EntityMetaKey.Selector]: {
							coinId: $base.$coin.coinId,
						},
					}
				:
					undefined
			)
			},
		})({
				fields: {
				$baseCoin: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Market,
			resolve: {
				[MarketSelector.BaseQuoteMarketVenueKind]: async (entitySelector: EntitySelector<typeof schema, EntityType.Market>) => (
				(
					entitySelector.$base.kind === MarketAssetKind.Coin
					&& stringify(catalogCoinUsdMarketIdByCoinId[entitySelector.$base.$coin.coinId]) === stringify(entitySelector)
				) ?
					[
						{
							[EntityMetaKey.Selector]: {
								$market: entitySelector,
							},
						},
					]
				:
					[]
			)
			},
		})({
				fields: {
				$$marketPrices: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Market,
			resolve: {
				[MarketSelector.BaseQuoteMarketVenueKind]: async () => {
				throw new Error('Constants_Internal: $$marketTimeIntervalTimestamps is not implemented')
			}
			},
		})({
				fields: {
				$$marketTimeIntervalTimestamps: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.MarketPrice,
			resolve: {
				[MarketPriceSelector.Market]: async ({ $market }: EntitySelector<typeof schema, EntityType.MarketPrice>) => (
				{
					[EntityMetaKey.Selector]: $market,
				}
			)
			},
		})({
				fields: {
				$parentMarket: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: {
				[Market_TimeInterval_TimestampSelector.MarketTimeIntervalTimestampMsFeedKey]: async ({ $market }: EntitySelector<typeof schema, EntityType.Market_TimeInterval_Timestamp>) => (
				{
					[EntityMetaKey.Selector]: $market,
				}
			)
			},
		})({
				fields: {
				$parentMarket: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EvmCoinInstanceSelector.NetworkType]: async () => {
				throw new Error('Constants_Internal: $$marketsWithInstanceAsBase is unsupported')
			},
[EvmCoinInstanceSelector.NetworkTypeContract]: async () => {
				throw new Error('Constants_Internal: $$marketsWithInstanceAsBase is unsupported')
			}
			},
		})({
				fields: {
				$$marketsWithInstanceAsBase: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmCoinInstance,
			resolve: {
				[EvmCoinInstanceSelector.NetworkType]: async () => {
				throw new Error('Constants_Internal: $$marketsWithInstanceAsQuote is unsupported')
			},
[EvmCoinInstanceSelector.NetworkTypeContract]: async () => {
				throw new Error('Constants_Internal: $$marketsWithInstanceAsQuote is unsupported')
			}
			},
		})({
				fields: {
				$$marketsWithInstanceAsQuote: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
				const { networkExecutionUpgrades } = await import('$/constants/EthereumNetworkUpgrades.ts')
				return (
					networkExecutionUpgrades.some((executionUpgrade) => (
						executionUpgrade[EntityMetaKey.Selector].$network.caip2.reference === caip2.reference
						&& executionUpgrade.layer === NetworkExecutionUpgradeLayer.Blob
					))
				)
			}
			},
		})({
				fields: {
				hasBlobParameterExecutionUpgrade: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
				const { beaconRestBaseByExecutionChainId } = await import('$/constants/BeaconConsensus.ts')
				return beaconRestBaseByExecutionChainId[Number(caip2.reference)]?.consensusProtocol
			}
			},
		})({
				fields: {
				consensusProtocol: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
				const { mevRelayHosts } = await import('$/constants/MevRelayHosts.ts')
				const chainId = Number(caip2.reference)
				return (
					mevRelayHosts
						.filter((mevRelayHost) => mevRelayHost.chainId === chainId)
						.map((mevRelayHost) => ({
							[EntityMetaKey.Selector]: {
								$network: { caip2 },
								host: mevRelayHost.host,
							},
							url: `https://${mevRelayHost.host}`,
						}))
				)
			}
			},
		})({
				fields: {
				$$mevRelays: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
				const {
					networkUpgrades,
					networkExecutionUpgradeByChainIdAndUpgradeId,
					networkConsensusUpgradeByChainIdAndUpgradeId,
				} = await import('$/constants/EthereumNetworkUpgrades.ts')
				return networkUpgrades
					.filter((networkUpgrade) => (
						networkUpgrade[EntityMetaKey.Selector].$network.caip2.reference === caip2.reference
					))
					.map((networkUpgrade) => {
						if (networkUpgrade.$networkExecutionUpgrade == null)
							throw new Error(`Constants_Internal: NetworkUpgrade ${networkUpgrade[EntityMetaKey.Selector].$network.caip2.reference}:${networkUpgrade[EntityMetaKey.Selector].upgradeId} has no $networkExecutionUpgrade`)

						const linkedNetworkExecutionUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[
							`${networkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Selector].$network.caip2.reference}:${networkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Selector].upgradeId}`
						]
						const linkedNetworkConsensusUpgrade = (
							networkUpgrade.$networkConsensusUpgrade == null ?
								undefined
							:
								networkConsensusUpgradeByChainIdAndUpgradeId[
									`${networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Selector].$network.caip2.reference}:${networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Selector].upgradeId}`
								]
						)
						const activationTimestampsMs = [
							linkedNetworkExecutionUpgrade.activationTimestampMs,
							linkedNetworkConsensusUpgrade?.activationTimestampMs,
						].filter((timestamp): timestamp is number => timestamp != null)
						const proposals = [
							...(linkedNetworkExecutionUpgrade.$$proposals ?? []),
							...(linkedNetworkConsensusUpgrade?.$$proposals ?? []),
						].filter((proposal, index, proposals) => (
							proposals.findIndex((otherProposal) => (
								stringify(otherProposal[EntityMetaKey.Selector]) === stringify(proposal[EntityMetaKey.Selector])
							)) === index
						))

						return {
							...networkUpgrade,
							...(linkedNetworkExecutionUpgrade.activationBlock != null && {
								activationBlock: linkedNetworkExecutionUpgrade.activationBlock,
							}),
							...(linkedNetworkExecutionUpgrade.activationBlock == null && linkedNetworkConsensusUpgrade?.activationBlock != null && {
								activationBlock: linkedNetworkConsensusUpgrade.activationBlock,
							}),
							...(activationTimestampsMs.length > 0 && {
								activationTimestampMs: Math.max(...activationTimestampsMs),
							}),
							...(linkedNetworkConsensusUpgrade?.activationEpoch != null && {
								activationEpoch: linkedNetworkConsensusUpgrade.activationEpoch,
							}),
							...(linkedNetworkConsensusUpgrade?.activationEpoch == null && linkedNetworkExecutionUpgrade.activationEpoch != null && {
								activationEpoch: linkedNetworkExecutionUpgrade.activationEpoch,
							}),
							...(proposals.length > 0 && { $$proposals: proposals }),
							[EntityMetaKey.Selector]: networkUpgrade[EntityMetaKey.Selector],
						}
					})
			}
			},
		})({
				fields: {
				$$upgrades: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
				const { networkExecutionUpgrades } = await import('$/constants/EthereumNetworkUpgrades.ts')
				return networkExecutionUpgrades
					.filter((networkExecutionUpgrade) => (
						networkExecutionUpgrade[EntityMetaKey.Selector].$network.caip2.reference === caip2.reference
					))
					.map((networkExecutionUpgrade) => ({ ...networkExecutionUpgrade }))
			}
			},
		})({
				fields: {
				$$executionUpgrades: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }) => {
				const { networkConsensusUpgrades } = await import('$/constants/EthereumNetworkUpgrades.ts')
				return networkConsensusUpgrades
					.filter((networkConsensusUpgrade) => (
						networkConsensusUpgrade[EntityMetaKey.Selector].$network.caip2.reference === caip2.reference
					))
					.map((networkConsensusUpgrade) => ({ ...networkConsensusUpgrade }))
			}
			},
		})({
				fields: {
				$$consensusUpgrades: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
				entityType: EntityType.EthereumNetworkUpgrade,
				resolve: {
					[EthereumNetworkUpgradeSelector.EvmNetworkUpgradeId]: async ({ $network, upgradeId }) => {
					const { networkUpgradeByChainIdAndUpgradeId } = await import('$/constants/EthereumNetworkUpgrades.ts')
					const networkUpgrade = networkUpgradeByChainIdAndUpgradeId[`${$network.caip2.reference}:${upgradeId}`]
					if (networkUpgrade.$networkExecutionUpgrade == null) {
						throw new Error(`Constants_Internal: unknown NetworkUpgrade ${$network.caip2.reference}:${upgradeId}`)
					}
					return (
						{ ...networkUpgrade.$networkExecutionUpgrade }
					)
				}
				},
		})({
				fields: {
				$networkExecutionUpgrade: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EthereumNetworkUpgrade,
			resolve: {
				[EthereumNetworkUpgradeSelector.EvmNetworkUpgradeId]: async ({ $network, upgradeId }) => {
				const { networkUpgradeByChainIdAndUpgradeId } = await import('$/constants/EthereumNetworkUpgrades.ts')
				const networkUpgrade = networkUpgradeByChainIdAndUpgradeId[`${$network.caip2.reference}:${upgradeId}`]
				return (
		networkUpgrade.$networkConsensusUpgrade == null ?
						undefined
					:
						{ ...networkUpgrade.$networkConsensusUpgrade }
				)
			}
			},
		})({
				fields: {
				$networkConsensusUpgrade: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EthereumNetworkUpgrade,
			resolve: {
				[EthereumNetworkUpgradeSelector.EvmNetworkUpgradeId]: async ({ $network, upgradeId }) => {
				const {
					networkUpgradeByChainIdAndUpgradeId,
					networkExecutionUpgradeByChainIdAndUpgradeId,
					networkConsensusUpgradeByChainIdAndUpgradeId,
				} = await import('$/constants/EthereumNetworkUpgrades.ts')
				const networkUpgrade = networkUpgradeByChainIdAndUpgradeId[`${$network.caip2.reference}:${upgradeId}`]
				if (networkUpgrade.$networkExecutionUpgrade == null)
					throw new Error(`Constants_Internal: NetworkUpgrade ${$network.caip2.reference}:${upgradeId} has no $networkExecutionUpgrade`)

				const proposals = [
					...(
						networkExecutionUpgradeByChainIdAndUpgradeId[
							`${networkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Selector].$network.caip2.reference}:${networkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Selector].upgradeId}`
						]?.$$proposals ?? []
					),
					...(
						networkUpgrade.$networkConsensusUpgrade == null ?
							[]
						:
							networkConsensusUpgradeByChainIdAndUpgradeId[
								`${networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Selector].$network.caip2.reference}:${networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Selector].upgradeId}`
							]?.$$proposals ?? []
					),
				].filter((proposal, index, proposals) => (
					proposals.findIndex((otherProposal) => (
						stringify(otherProposal[EntityMetaKey.Selector]) === stringify(proposal[EntityMetaKey.Selector])
					)) === index
				))
				if (proposals.length === 0) {
					throw new Error(`Constants_Internal: NetworkUpgrade ${upgradeId} has no $$proposals`)
				}
				return proposals
			}
			},
		})({
				fields: {
				$$proposals: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EthereumExecutionUpgrade,
			resolve: {
				[EthereumExecutionUpgradeSelector.EvmNetworkUpgradeId]: async ({ $network, upgradeId }) => {
				const { networkExecutionUpgradeByChainIdAndUpgradeId } = await import('$/constants/EthereumNetworkUpgrades.ts')
				const networkExecutionUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[`${$network.caip2.reference}:${upgradeId}`]
				const proposals = [...(networkExecutionUpgrade.$$proposals ?? [])]
				if (proposals.length === 0) {
					throw new Error(`Constants_Internal: NetworkExecutionUpgrade ${upgradeId} has no $$proposals`)
				}
				return proposals
			}
			},
		})({
				fields: {
				$$proposals: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EthereumConsensusUpgrade,
			resolve: {
				[EthereumConsensusUpgradeSelector.EvmNetworkUpgradeId]: async ({ $network, upgradeId }) => {
				const {
					networkConsensusUpgradeByChainIdAndUpgradeId,
					networkExecutionUpgradeByChainIdAndUpgradeId,
					networkUpgrades,
				} = await import('$/constants/EthereumNetworkUpgrades.ts')
				const networkConsensusUpgrade = networkConsensusUpgradeByChainIdAndUpgradeId[`${$network.caip2.reference}:${upgradeId}`]
				const directProposals = [...(networkConsensusUpgrade.$$proposals ?? [])]
				if (directProposals.length > 0) {
					return directProposals
				}
				const umbrellaNetworkUpgrade = networkUpgrades.find((networkUpgrade) => (
					networkUpgrade.$networkConsensusUpgrade?.[EntityMetaKey.Selector].$network.caip2.reference === entitySelector.$network.caip2.reference
					&& networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Selector].upgradeId === entitySelector.upgradeId
				))
				if (umbrellaNetworkUpgrade != null) {
					if (umbrellaNetworkUpgrade.$networkExecutionUpgrade == null)
						throw new Error(`Constants_Internal: NetworkUpgrade ${umbrellaNetworkUpgrade[EntityMetaKey.Selector].$network.caip2.reference}:${umbrellaNetworkUpgrade[EntityMetaKey.Selector].upgradeId} has no $networkExecutionUpgrade`)

					const linkedProposals = [
						...(
							networkExecutionUpgradeByChainIdAndUpgradeId[
								`${umbrellaNetworkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Selector].$network.caip2.reference}:${umbrellaNetworkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Selector].upgradeId}`
							]?.$$proposals ?? []
						),
						...(
							umbrellaNetworkUpgrade.$networkConsensusUpgrade == null ?
								[]
							:
								networkConsensusUpgradeByChainIdAndUpgradeId[
									`${umbrellaNetworkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Selector].$network.caip2.reference}:${umbrellaNetworkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Selector].upgradeId}`
								]?.$$proposals ?? []
						),
					].filter((proposal, index, proposals) => (
						proposals.findIndex((otherProposal) => (
							stringify(otherProposal[EntityMetaKey.Selector]) === stringify(proposal[EntityMetaKey.Selector])
						)) === index
					))
					if (linkedProposals.length > 0) {
						return linkedProposals
					}
				}
				throw new Error(`Constants_Internal: NetworkConsensusUpgrade ${upgradeId} has no $$proposals`)
			}
			},
		})({
				fields: {
				$$proposals: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.LensNetwork,
			resolve: {
				[LensNetworkSelector.Scope]: async () => (
				lensNetworkSeedAccounts.map((account) => ({
					[EntityMetaKey.Selector]: account,
				}))
			)
			},
		})({
				fields: {
				$$lensAccounts: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.LensNetwork,
			resolve: {
				[LensNetworkSelector.Scope]: async () => {
				throw new Error('Constants_Internal: $$lensPosts is unsupported')
			}
			},
		})({
				fields: {
				$$lensPosts: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NostrNetwork,
			resolve: {
				[NostrNetworkSelector.Scope]: async () => (
				nostrNetworkSeedProfiles.map((profile) => ({
					[EntityMetaKey.Selector]: profile,
				}))
			)
			},
		})({
				fields: {
				$$nostrProfiles: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NostrNetwork,
			resolve: {
				[NostrNetworkSelector.Scope]: async () => {
				throw new Error('Constants_Internal: $$nostrNotes is unsupported')
			}
			},
		})({
				fields: {
				$$nostrNotes: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NostrNetwork,
			resolve: {
				[NostrNetworkSelector.Scope]: async () => (
				nostrNetworkSeedRelays.map((relay) => ({
					[EntityMetaKey.Selector]: relay,
				}))
			)
			},
		})({
				fields: {
				$$nostrRelays: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NostrNetwork,
			resolve: {
				[NostrNetworkSelector.Scope]: async () => {
				throw new Error('Constants_Internal: $$nostrReposts is unsupported')
			}
			},
		})({
				fields: {
				$$nostrReposts: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.NostrNetwork,
			resolve: {
				[NostrNetworkSelector.Scope]: async () => {
				throw new Error('Constants_Internal: $$nostrArticles is unsupported')
			}
			},
		})({
				fields: {
				$$nostrArticles: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.AtprotoNetwork,
			resolve: {
				[AtprotoNetworkSelector.Scope]: async () => (
				atprotoNetworkSeedActors.map((actor) => ({
					[EntityMetaKey.Selector]: actor,
				}))
			)
			},
		})({
				fields: {
				$$atprotoActors: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.AtprotoNetwork,
			resolve: {
				[AtprotoNetworkSelector.Scope]: async () => {
				throw new Error('Constants_Internal: $$atprotoPosts is unsupported')
			}
			},
		})({
				fields: {
				$$atprotoPosts: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ActivityPubNetwork,
			resolve: {
				[ActivityPubNetworkSelector.Scope]: async () => (
				activityPubNetworkSeedActors.map((actor) => ({
					[EntityMetaKey.Selector]: actor,
				}))
			)
			},
		})({
				fields: {
				$$activityPubActors: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ActivityPubNetwork,
			resolve: {
				[ActivityPubNetworkSelector.Scope]: async () => {
				throw new Error('Constants_Internal: $$activityPubNotes is unsupported')
			}
			},
		})({
				fields: {
				$$activityPubNotes: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.RedditNetwork,
			resolve: {
				[RedditNetworkSelector.Scope]: async () => (
				redditNetworkSeedSubreddits.map((subreddit) => ({
					[EntityMetaKey.Selector]: subreddit,
				}))
			)
			},
		})({
				fields: {
				$$redditSubreddits: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.RedditNetwork,
			resolve: {
				[RedditNetworkSelector.Scope]: async () => {
				throw new Error('Constants_Internal: $$redditLinks is unsupported')
			}
			},
		})({
				fields: {
				$$redditLinks: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.RssNetwork,
			resolve: {
				[RssNetworkSelector.Scope]: async () => (
				rssNetworkSeedFeeds.map((feed) => ({
					[EntityMetaKey.Selector]: feed,
				}))
			)
			},
		})({
				fields: {
				$$rssFeeds: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.RssNetwork,
			resolve: {
				[RssNetworkSelector.Scope]: async () => {
				throw new Error('Constants_Internal: $$rssItems is unsupported')
			}
			},
		})({
				fields: {
				$$rssItems: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.XNetwork,
			resolve: {
				[XNetworkSelector.Scope]: async () => (
				xNetworkSeedUsers.map((user) => ({
					[EntityMetaKey.Selector]: user,
				}))
			)
			},
		})({
				fields: {
				$$xUsers: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.XNetwork,
			resolve: {
				[XNetworkSelector.Scope]: async () => {
				throw new Error('Constants_Internal: $$xPosts is unsupported')
			}
			},
		})({
				fields: {
				$$xPosts: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.XmtpNetwork,
			resolve: {
				[XmtpNetworkSelector.Scope]: async () => {
				throw new Error('Constants_Internal: $$xmtpConversations is unsupported')
			}
			},
		})({
				fields: {
				$$xmtpConversations: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
				entityType: EntityType.YouTubeNetwork,
				resolve: {
					[YouTubeNetworkSelector.Scope]: async () => (
					[...youtubeNetworkSeedChannels].map((channel) => ({
						[EntityMetaKey.Selector]: channel,
					}))
				)
				},
		})({
				fields: {
				$$youtubeChannels: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
				entityType: EntityType.YouTubeNetwork,
				resolve: {
					[YouTubeNetworkSelector.Scope]: async () => (
					[...youtubeNetworkSeedVideos].map((video) => ({
						[EntityMetaKey.Selector]: video,
					}))
				)
				},
		})({
				fields: {
				$$youtubeVideos: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
				entityType: EntityType.YouTubeNetwork,
				resolve: {
					[YouTubeNetworkSelector.Scope]: async () => (
					[...youtubeNetworkSeedPlaylists].map((playlist) => ({
						[EntityMetaKey.Selector]: playlist,
					}))
				)
				},
		})({
				fields: {
				$$youtubePlaylists: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType._Global,
			resolve: {
				[_GlobalSelector.Scope]: async (_globalScopeEntitySelector: EntitySelector<typeof schema, EntityType._Global>) => {
				throw new Error('Constants_Internal: $$liquidityPositions is unsupported')
			}
			},
		})({
				fields: {
				$$liquidityPositions: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmContract,
			resolve: {
				[EvmContractSelector.EvmNetworkAddress]: async ({ $network, address: addressSelector }) => {
				const address = hexLowerOfByteSize(addressSelector, 20)
				if (address == null) {
					throw new Error('Constants_Internal: EvmContract address not normalized')
				}
				const chainPrecompiles = (
					precompilesByChainId[Number($network.caip2.reference)]
					?? standardPrecompiles
				)
				return chainPrecompiles.find((precompile) => (
					precompile.address.toLowerCase() === address.toLowerCase()
				))?.name
			}
			},
		})({
				fields: {
				precompileName: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.EvmNetwork,
			resolve: {
				[EvmNetworkSelector.Caip2]: async ({ caip2 }, context) => {
				const limit = resolverContextRowLimit(context)
				return (
					precompilesByChainId[Number(caip2.reference)]
					?? standardPrecompiles
				)
					.slice(0, limit)
					.flatMap((precompile) => {
						const address = hexLowerOfByteSize(precompile.address, 20)
						return address == null ?
							[]
						:
							[{
							[EntityMetaKey.Selector]: {
								$network: { caip2: entitySelector.caip2 },
								address,
							},
						}]
					})
			}
			},
		})({
				fields: {
				$$contracts: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.ZeroGNetwork,
			resolve: {
				[ZeroGNetworkSelector.NetworkSlug]: async ({ slug }) => {
				const network = networkBySlug[slug]
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				const coinId = nativeAssetCoinIdByNamespace[namespace]
				if (coinId == null) return []
				return [
					{
						[EntityMetaKey.Selector]: {
							$network: {
								slug: slug,
							},
							kind: AssetInstanceKind.Native,
							assetKey: coinId,
						},
						coinId,
						symbol: coinId,
					},
				]
			}
			},
		})({
				fields: {
				$$nativeAssets: (entity) => entity,
			},
			}),

		defineResolver(Source.Constants_Internal, {
			entityType: EntityType.QuilibriumNetwork,
			resolve: {
				[QuilibriumNetworkSelector.NetworkSlug]: async ({ slug }) => {
				const network = networkBySlug[slug]
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				const coinId = nativeAssetCoinIdByNamespace[namespace]
				if (coinId == null) return []
				return [
					{
						[EntityMetaKey.Selector]: {
							$network: {
								slug: slug,
							},
							kind: AssetInstanceKind.Native,
							assetKey: coinId,
						},
						coinId,
					},
				]
			}
			},
		})({
				fields: {
				$$nativeAssets: (entity) => entity,
			},
			}),
	],
}

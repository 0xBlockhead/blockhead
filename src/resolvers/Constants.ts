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
	resolverContextRowLimit,
} from '$/resolvers/$resolvers.ts'
import {
	EntityIdProjection,
	EntityMetaKey,
} from '$/schema/$EntityDefinition.ts'
import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type { Entity } from '$/schema/$schema.ts'
import {
	precompilesByChainId,
} from '$/constants/precompiles/index.ts'
import { standardPrecompiles } from '$/constants/precompiles/standard.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'

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

const networkResourceUrlEntityIds = (
	networkSlug: string,
	kind: NetworkResourceKind,
) => (
	networkResourceUrlsByNetworkSlug[networkSlug]
		?.filter((resource) => resource.kind === kind)
		.map((resource) => ({
			[EntityMetaKey.Id]: {
				url: resource.url,
			},
		}))
	?? []
)


export default {
	source: Source.Constants_Internal,

	resolvers: [
		defineResolver({
			entityType: EntityType.EthereumNetworkUpgrade,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const {
					networkUpgradeByChainIdAndUpgradeId,
					networkExecutionUpgradeByChainIdAndUpgradeId,
					networkConsensusUpgradeByChainIdAndUpgradeId,
				} = await import(
					'$/constants/EthereumNetworkUpgrades.ts'
				)
				const networkUpgrade = networkUpgradeByChainIdAndUpgradeId[
					`${entityId.$network.caip2.reference}:${entityId.upgradeId}`
				]
				if (networkUpgrade.$networkExecutionUpgrade == null)
					throw new Error(`Constants_Internal: NetworkUpgrade ${entityId.$network.caip2.reference}:${entityId.upgradeId} has no $networkExecutionUpgrade`)

				const linkedNetworkExecutionUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[
					`${networkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${networkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Id].upgradeId}`
				]
				const linkedNetworkConsensusUpgrade = (
					networkUpgrade.$networkConsensusUpgrade == null ?
						undefined
					:
						networkConsensusUpgradeByChainIdAndUpgradeId[
							`${networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Id].upgradeId}`
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
						stringify(otherProposal[EntityMetaKey.Id]) === stringify(proposal[EntityMetaKey.Id])
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
			},
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.EthereumExecutionUpgrade,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { networkExecutionUpgradeByChainIdAndUpgradeId } = await import(
					'$/constants/EthereumNetworkUpgrades.ts'
				)
				const networkExecutionUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[
					`${entityId.$network.caip2.reference}:${entityId.upgradeId}`
				]

				return { ...networkExecutionUpgrade }
			},
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.EthereumConsensusUpgrade,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { networkConsensusUpgradeByChainIdAndUpgradeId } = await import(
					'$/constants/EthereumNetworkUpgrades.ts'
				)
				const networkConsensusUpgrade = networkConsensusUpgradeByChainIdAndUpgradeId[
					`${entityId.$network.caip2.reference}:${entityId.upgradeId}`
				]

				return { ...networkConsensusUpgrade }
			},
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.MarketVenue,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { marketVenueById } = await import('$/constants/MarketVenue.ts')
				return {
					label: marketVenueById[entityId.marketVenueId].label,
				}
			},
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.Currency,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const currency = currencyByIso4217[entityId.iso4217]
				if (currency == null) {
					throw new Error(`Constants_Internal: Currency not found for ${entityId.iso4217}`)
				}
				return {
					name: currency.name,
					symbol: currency.symbol,
					minorUnitExponent: currency.minorUnitExponent,
				}
			},
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.Currency_Timestamp,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const currency = currencyByIso4217[entityId.$currency.iso4217]
				if (currency == null) {
					throw new Error(`Constants_Internal: Currency not found for ${entityId.$currency.iso4217}`)
				}
				if (entityId.timestampMs !== currencyCatalogSnapshotTimestampMs) {
					throw new Error(`Constants_Internal: Currency snapshot not found for ${entityId.$currency.iso4217}:${String(entityId.timestampMs)}`)
				}
				return {
					marketCap: BigInt(currency.marketCapUsd),
				}
			},
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.Market,
			accepts: [EntityIdProjection.Identity],
			resolve: async (_entityId) => ({}),
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.EvmContract,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) {
					throw new Error('Constants_Internal: EvmContract address not normalized')
				}
				const chainPrecompiles = (
					precompilesByChainId[Number(entityId.$network.caip2.reference)]
					?? standardPrecompiles
				)
				const precompileName = chainPrecompiles.find((precompile) => (
					precompile.address.toLowerCase() === address.toLowerCase()
				))?.name
				if (precompileName == null) {
					throw new Error(`Constants_Internal: EvmContract ${address} is not a catalog precompile on chain ${String(Number(entityId.$network.caip2.reference))}`)
				}
				return {
					precompileName,
				}
			},
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.Coin,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const coin = coinById[entityId.coinId]
				return {
					symbol: coin.symbol,
				}
			},
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.EvmCoinInstance,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				if (
					entityId.type !== CoinInstanceType.NativeCurrency
					|| Number(entityId.$network.caip2.reference) !== 1
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
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.CoinBridgeCapability,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const coinBridgeCapabilityFields = bridgeToolByKey[entityId.toolKey]
				if (coinBridgeCapabilityFields == null) {
					throw new Error(`Constants_Internal: unknown LI.FI tool key ${entityId.toolKey}`)
				}
				return {
					toolKey: entityId.toolKey,
					...coinBridgeCapabilityFields,
				}
			},
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.MarketPrice,
			accepts: [EntityIdProjection.Identity],
			resolve: async (_entityId) => ({}),
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			accepts: [EntityIdProjection.Identity],
			resolve: async (_entityId) => ({}),
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.Url,
			accepts: [EntityIdProjection.Identity],
			resolve: async (_entityId) => (
				{}
			),
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.EvmNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { beaconRestBaseByExecutionChainId } = await import('$/constants/BeaconConsensus.ts')
				const { executionEndpointsByChainId } = await import('$/constants/ExecutionEndpoints.ts')
				const network = networkByCaip2[`${entityId.caip2.namespace}:${entityId.caip2.reference}`]
				const beaconRestBase = beaconRestBaseByExecutionChainId[Number(entityId.caip2.reference)]
				const executionEndpoints = executionEndpointsByChainId[Number(entityId.caip2.reference)] ?? []
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
			},
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.MevRelay,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => ({
				url: `https://${entityId.host}`,
			}),
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.Network,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const network = (
					'networkSlug' in entityId ?
						networkBySlug[entityId.networkSlug]
					:
						networkByCaip2[`${entityId.caip2.namespace}:${entityId.caip2.reference}`]
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
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.NearNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const network = networkBySlug[entityId.networkSlug]
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
			},
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.ZeroGNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const network = networkBySlug[entityId.networkSlug]
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
						[EntityMetaKey.Id]: zeroGEvmNetworkId,
					},
				}
			},
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.QuilibriumNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const network = networkBySlug[entityId.networkSlug]
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
			},
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.SolanaNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const network = networkByCaip2[`${entityId.caip2.namespace}:${entityId.caip2.reference}`]
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
			},
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.NetworkStack,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => ({
				label: networkStackByNetworkStackId[entityId.networkStackId].label,
			}),
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.ElementsNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const network = (
					'networkSlug' in entityId ?
						networkBySlug[entityId.networkSlug]
					:
						networkByCaip2[`${entityId.caip2.namespace}:${entityId.caip2.reference}`]
				)
				if (network?.slug !== networkBySlug.liquid.slug)
					throw new Error('Constants_Internal: unsupported Elements network')

				return {
					$network: {
						[EntityMetaKey.Id]: {
							networkSlug: network.slug,
						},
					},
					$settlementNetwork: {
						[EntityMetaKey.Id]: {
							networkSlug: 'bitcoin',
						},
					},
					federationName: 'Liquid Federation',
					blockTimeSeconds: 60,
					confidentialTransactionsDefault: true,
				}
			},
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.ExecutionEnvironment,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => ({
				label: executionEnvironmentByExecutionEnvironmentId[entityId.executionEnvironmentId].label,
			}),
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.ConsensusMechanism,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => ({
				label: consensusMechanismById[entityId.consensusMechanismId].label,
			}),
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.AssetInstance,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => ({
				...(entityId.kind === AssetInstanceKind.Native && {
					name: entityId.assetKey,
					symbol: entityId.assetKey,
				}),
			}),
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.BittensorSubnet,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => ({
				name: entityId.netuid === 0 ? 'Root' : `Subnet ${entityId.netuid}`,
			}),
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.NetworkUpgrade,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => ({
				name: entityId.upgradeId,
			}),
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.CosmosGovernanceProposal,
			accepts: [EntityIdProjection.Identity],
			resolve: async (_entityId) => ({}),
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.PolkadotReferendum,
			accepts: [EntityIdProjection.Identity],
			resolve: async (_entityId) => ({}),
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.SpecificationRealm,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => ({
				label: specificationRealmById[entityId.realm].label,
				...(specificationRealmById[entityId.realm].labelPlural != null && {
					labelPlural: specificationRealmById[entityId.realm].labelPlural,
				}),
				slug: specificationRealmById[entityId.realm].slug,
			}),
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.SpecificationProposalKind,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => (
				{
					label: proposalCategoryById[entityId.category].label,
					labelPlural: proposalCategoryById[entityId.category].labelPlural,
					slug: proposalCategoryById[entityId.category].slug,
				}
			),
			fields: {},
		}),

		defineResolver({
			entityType: EntityType.ActivityPubNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => activityPubNetworkFieldValues,
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
		}),

		defineResolver({
			entityType: EntityType.AtprotoNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => atprotoNetworkFieldValues,
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
		}),

		defineResolver({
			entityType: EntityType.EnsProtocol,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => ensProtocolFieldValues,
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmProtocol,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => evmProtocolFieldValues,
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
		}),

		defineResolver({
			entityType: EntityType.IpfsProtocol,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => ipfsProtocolFieldValues,
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
		}),

		defineResolver({
			entityType: EntityType.SwarmProtocol,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => swarmProtocolFieldValues,
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
		}),

		defineResolver({
			entityType: EntityType.LensNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => lensNetworkFieldValues,
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => nostrNetworkFieldValues,
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
		}),

		defineResolver({
			entityType: EntityType.RedditNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => redditNetworkFieldValues,
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
		}),

		defineResolver({
			entityType: EntityType.RssNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => rssNetworkFieldValues,
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
		}),

		defineResolver({
			entityType: EntityType.XNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => xNetworkFieldValues,
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
		}),

		defineResolver({
			entityType: EntityType.XmtpNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => xmtpNetworkFieldValues,
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
		}),

		defineResolver({
			entityType: EntityType.YouTubeNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => youtubeNetworkFieldValues,
			fields: {
				protocolName: (entity) => entity.protocolName,
				homeUrl: (entity) => entity.homeUrl,
				docsUrl: (entity) => entity.docsUrl,
				registryLabel: (entity) => entity.registryLabel,
				topology: (entity) => entity.topology,
			},
		}),
		defineResolver({
			entityType: EntityType._Global,
			accepts: [EntityIdProjection.Identity],
				resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => (
					[...networks].map((network) => ({
						[EntityMetaKey.Id]: {
							networkSlug: network.slug,
					},
				}))
			),
			fields: {
				$$networks: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType._Global,
			accepts: [EntityIdProjection.Identity],
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const {
					networkUpgrades,
					networkExecutionUpgradeByChainIdAndUpgradeId,
					networkConsensusUpgradeByChainIdAndUpgradeId,
				} = await import('$/constants/EthereumNetworkUpgrades.ts')
				return networkUpgrades.map((networkUpgrade) => {
					if (networkUpgrade.$networkExecutionUpgrade == null)
						throw new Error(`Constants_Internal: NetworkUpgrade ${networkUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${networkUpgrade[EntityMetaKey.Id].upgradeId} has no $networkExecutionUpgrade`)

					const linkedNetworkExecutionUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[
						`${networkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${networkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Id].upgradeId}`
					]
					const linkedNetworkConsensusUpgrade = (
						networkUpgrade.$networkConsensusUpgrade == null ?
							undefined
						:
							networkConsensusUpgradeByChainIdAndUpgradeId[
								`${networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Id].upgradeId}`
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
							stringify(otherProposal[EntityMetaKey.Id]) === stringify(proposal[EntityMetaKey.Id])
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
						[EntityMetaKey.Id]: networkUpgrade[EntityMetaKey.Id],
					}
					})
					},
					fields: {
						$$networkUpgrades: (entity) => entity,
					},
				}),

		defineResolver({
			entityType: EntityType.Network,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.Network>) => {
				const network = (
					'networkSlug' in entityId ?
						networkBySlug[entityId.networkSlug]
					:
						networkByCaip2[`${entityId.caip2.namespace}:${entityId.caip2.reference}`]
				)
				if (network == null) return undefined
				const namespace: NetworkNamespace = network.namespace
				return {
					[EntityMetaKey.Id]: {
						networkStackId: networkStackIdByNamespace[namespace],
					},
				}
				},
				fields: {
					$networkStack: (entity) => entity,
				},
			}),

		defineResolver({
			entityType: EntityType.ZeroGNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const network = networkBySlug[entityId.networkSlug]
				if (network == null) return undefined
				const namespace: NetworkNamespace = network.namespace
				return {
					[EntityMetaKey.Id]: {
						networkStackId: networkStackIdByNamespace[namespace],
					},
				}
			},
			fields: {
				$networkStack: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.QuilibriumNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const network = networkBySlug[entityId.networkSlug]
				if (network == null) return undefined
				const namespace: NetworkNamespace = network.namespace
				return {
					[EntityMetaKey.Id]: {
						networkStackId: networkStackIdByNamespace[namespace],
					},
				}
			},
			fields: {
				$networkStack: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.Network>) => {
				const network = (
					'networkSlug' in entityId ?
						networkBySlug[entityId.networkSlug]
					:
						networkByCaip2[`${entityId.caip2.namespace}:${entityId.caip2.reference}`]
				)
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				return [...executionEnvironmentIdsByNamespace[namespace]].map((executionEnvironmentId) => ({
					[EntityMetaKey.Id]: {
						executionEnvironmentId,
					},
				}))
			},
			fields: {
				$$executionEnvironments: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.ZeroGNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const network = networkBySlug[entityId.networkSlug]
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				return [...executionEnvironmentIdsByNamespace[namespace]].map((executionEnvironmentId) => ({
					[EntityMetaKey.Id]: {
						executionEnvironmentId,
					},
				}))
			},
			fields: {
				$$executionEnvironments: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.QuilibriumNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const network = networkBySlug[entityId.networkSlug]
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				return [...executionEnvironmentIdsByNamespace[namespace]].map((executionEnvironmentId) => ({
					[EntityMetaKey.Id]: {
						executionEnvironmentId,
					},
				}))
			},
			fields: {
				$$executionEnvironments: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.Network>) => {
				const network = (
					'networkSlug' in entityId ?
						networkBySlug[entityId.networkSlug]
					:
						networkByCaip2[`${entityId.caip2.namespace}:${entityId.caip2.reference}`]
				)
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				return [...consensusMechanismIdsByNamespace[namespace]].map((consensusMechanismId) => ({
					[EntityMetaKey.Id]: {
						consensusMechanismId,
					},
				}))
			},
			fields: {
				$$consensusMechanisms: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.ZeroGNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const network = networkBySlug[entityId.networkSlug]
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				return [...consensusMechanismIdsByNamespace[namespace]].map((consensusMechanismId) => ({
					[EntityMetaKey.Id]: {
						consensusMechanismId,
					},
				}))
			},
			fields: {
				$$consensusMechanisms: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.QuilibriumNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const network = networkBySlug[entityId.networkSlug]
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				return [...consensusMechanismIdsByNamespace[namespace]].map((consensusMechanismId) => ({
					[EntityMetaKey.Id]: {
						consensusMechanismId,
					},
				}))
			},
			fields: {
				$$consensusMechanisms: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.Network>) => {
				const network = (
					'networkSlug' in entityId ?
						networkBySlug[entityId.networkSlug]
					:
						networkByCaip2[`${entityId.caip2.namespace}:${entityId.caip2.reference}`]
				)
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				const coinId = nativeAssetCoinIdByNamespace[namespace]
				if (coinId == null) return []
				return [
					{
						[EntityMetaKey.Id]: {
							$network: entityId,
							kind: AssetInstanceKind.Native,
							assetKey: coinId,
						},
						coinId,
						symbol: coinId,
					},
				]
			},
			fields: {
				$$nativeAssets: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.Network>) => {
				const network = (
					'networkSlug' in entityId ?
						networkBySlug[entityId.networkSlug]
					:
						networkByCaip2[`${entityId.caip2.namespace}:${entityId.caip2.reference}`]
				)
				if (network == null) return []
				return networkResourceUrlEntityIds(
					network.slug,
					NetworkResourceKind.Faucet,
				)
			},
			fields: {
				$$faucetUrls: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.Network,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.Network>) => {
				const network = (
					'networkSlug' in entityId ?
						networkBySlug[entityId.networkSlug]
					:
						networkByCaip2[`${entityId.caip2.namespace}:${entityId.caip2.reference}`]
				)
				if (network == null) return []
				return networkResourceUrlEntityIds(
					network.slug,
					NetworkResourceKind.BlockExplorer,
				)
			},
			fields: {
				$$blockExplorerUrls: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType._Global,
			accepts: [EntityIdProjection.Identity],
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => (
				specificationRealmById == null ?
					[]
				:
					Object.values(specificationRealmById).map((realmRow) => ({
						[EntityMetaKey.Id]: {
							realm: realmRow.id,
						},
					}))
			),
			fields: {
				$$specificationRealms: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType._Global,
			accepts: [EntityIdProjection.Identity],
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => (
				proposalKindIds.map((proposalKindId) => ({
					[EntityMetaKey.Id]: proposalKindId,
				}))
			),
			fields: {
				$$proposalKinds: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.SpecificationRealm,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.SpecificationRealm>) => (
				proposalKindIds
					.filter((proposalKindId) => (
						proposalKindId.realm === entityId.realm
					))
					.map((proposalKindId) => ({
						[EntityMetaKey.Id]: proposalKindId,
					}))
			),
			fields: {
				$$proposalKinds: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.SpecificationProposalKind,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.SpecificationProposalKind>) => (
				{
					[EntityMetaKey.Id]: {
						realm: entityId.realm,
					},
				}
			),
			fields: {
				$specificationRealm: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType._Global,
			accepts: [EntityIdProjection.Identity],
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coins } = await import('$/constants/Coin.ts')
				return [
					...coins.map((coin) => (
						{
							[EntityMetaKey.Id]: {
								coinId: coin.id,
							},
						}
					)),
				]
			},
			fields: {
				$$coins: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType._Global,
			accepts: [EntityIdProjection.Identity],
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { marketVenues } = await import('$/constants/MarketVenue.ts')
					return [...marketVenues].map((marketVenue) => (
					{
						[EntityMetaKey.Id]: {
							marketVenueId: marketVenue.id,
						},
					}
				))
			},
			fields: {
				$$marketVenues: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.MarketVenue,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.MarketVenue>) => {
				const { coins } = await import('$/constants/Coin.ts')
				return (
					coins.flatMap((coin) => {
						const marketId = catalogCoinUsdMarketIdByCoinId[coin.id]
						return (
							marketId.$marketVenue.marketVenueId === entityId.marketVenueId ?
								[
									{
										[EntityMetaKey.Id]: marketId,
									},
								]
							:
								[]
						)
					})
				)
			},
			fields: {
				$$markets: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType._Global,
			accepts: [EntityIdProjection.Identity],
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => (
					[...currencies].map((currency) => (
					{
						[EntityMetaKey.Id]: {
							iso4217: currency.iso4217,
						},
					}
				))
			),
			fields: {
				$$currencies: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.Currency,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.Currency>) => {
				const currency = currencyByIso4217[entityId.iso4217]
				if (currency == null) return []
				return [
					{
						[EntityMetaKey.Id]: {
							$currency: entityId,
							timestampMs: currencyCatalogSnapshotTimestampMs,
						},
						marketCap: BigInt(currency.marketCapUsd),
					},
				]
			},
			fields: {
				$$timestamps: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType._Global,
			accepts: [EntityIdProjection.Identity],
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coins } = await import('$/constants/Coin.ts')
				return (
					coins.map((coin) => (
						{
							[EntityMetaKey.Id]: catalogCoinUsdMarketIdByCoinId[coin.id],
						}
					))
				)
			},
			fields: {
				$$markets: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType._Global,
			accepts: [EntityIdProjection.Identity],
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const { coins } = await import('$/constants/Coin.ts')
				return (
					coins.map((coin) => (
						{
							[EntityMetaKey.Id]: {
								$market: catalogCoinUsdMarketIdByCoinId[coin.id],
							},
						}
					))
				)
			},
			fields: {
				$$marketPrices: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.Coin,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => (
				[
					{
						[EntityMetaKey.Id]: catalogCoinUsdMarketIdByCoinId[entityId.coinId],
					},
				]
			),
			fields: {
				$$marketsWithCoinAsBase: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.Coin,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => (
				(catalogMarketsWithCoinAsQuoteByQuoteCoinId[entityId.coinId] ).map((marketId) => ({
					[EntityMetaKey.Id]: marketId,
				}))
			),
			fields: {
				$$marketsWithCoinAsQuote: (entity) => entity,
			},
		}),

			defineResolver({
				entityType: EntityType.Coin,
				accepts: [EntityIdProjection.Identity],
				resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => {
					if (entityId.coinId !== CoinId.ETH) return []
					const ethNativeCoinInstance: Entity<typeof schema, EntityType.EvmCoinInstance> = {
						[EntityMetaKey.Id]: {
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
				},
				fields: {
					$$coinInstances: (entity) => entity,
				},
			}),

		defineResolver({
			entityType: EntityType.EvmCoinInstance,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => {
				throw new Error('Constants_Internal: $$outboundBridgeCapabilities is not implemented')
			},
			fields: {
				$$outboundBridgeCapabilities: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmCoinInstance,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => {
				throw new Error('Constants_Internal: $$inboundBridgeCapabilities is not implemented')
			},
			fields: {
				$$inboundBridgeCapabilities: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmCoinInstance,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => {
				throw new Error('Constants_Internal: $canonicalInstance is unsupported')
			},
			fields: {
				$canonicalInstance: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmCoinInstance,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				if (
					entityId.type === CoinInstanceType.NativeCurrency
					&& Number(entityId.$network.caip2.reference) === 1
				) {
					return CoinInstanceRepresentation.IssuerNative
				}
				throw new Error('Constants_Internal: CoinInstance representation unsupported')
			},
			fields: {
				representation: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.Market,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market>) => (
				entityId.$base.kind === MarketAssetKind.Coin ?
					{
						[EntityMetaKey.Id]: {
							coinId: entityId.$base.$coin.coinId,
						},
					}
				:
					undefined
			),
			fields: {
				$baseCoin: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.Market,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market>) => (
				(
					entityId.$base.kind === MarketAssetKind.Coin
					&& stringify(catalogCoinUsdMarketIdByCoinId[entityId.$base.$coin.coinId]) === stringify(entityId)
				) ?
					[
						{
							[EntityMetaKey.Id]: {
								$market: entityId,
							},
						},
					]
				:
					[]
			),
			fields: {
				$$marketPrices: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.Market,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => {
				throw new Error('Constants_Internal: $$marketTimeIntervalTimestamps is not implemented')
			},
			fields: {
				$$marketTimeIntervalTimestamps: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.MarketPrice,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.MarketPrice>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			),
			fields: {
				$parentMarket: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market_TimeInterval_Timestamp>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			),
			fields: {
				$parentMarket: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmCoinInstance,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => {
				throw new Error('Constants_Internal: $$marketsWithInstanceAsBase is unsupported')
			},
			fields: {
				$$marketsWithInstanceAsBase: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmCoinInstance,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => {
				throw new Error('Constants_Internal: $$marketsWithInstanceAsQuote is unsupported')
			},
			fields: {
				$$marketsWithInstanceAsQuote: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { networkExecutionUpgrades } = await import('$/constants/EthereumNetworkUpgrades.ts')
				return (
					networkExecutionUpgrades.some((executionUpgrade) => (
						executionUpgrade[EntityMetaKey.Id].$network.caip2.reference === entityId.caip2.reference
						&& executionUpgrade.layer === NetworkExecutionUpgradeLayer.Blob
					))
				)
			},
			fields: {
				hasBlobParameterExecutionUpgrade: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { beaconRestBaseByExecutionChainId } = await import('$/constants/BeaconConsensus.ts')
				return beaconRestBaseByExecutionChainId[Number(entityId.caip2.reference)]?.consensusProtocol
			},
			fields: {
				consensusProtocol: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { mevRelayHosts } = await import('$/constants/MevRelayHosts.ts')
				const chainId = Number(entityId.caip2.reference)
				return (
					mevRelayHosts
						.filter((mevRelayHost) => mevRelayHost.chainId === chainId)
						.map((mevRelayHost) => ({
							[EntityMetaKey.Id]: {
								$network: entityId,
								host: mevRelayHost.host,
							},
							url: `https://${mevRelayHost.host}`,
						}))
				)
			},
			fields: {
				$$mevRelays: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const {
					networkUpgrades,
					networkExecutionUpgradeByChainIdAndUpgradeId,
					networkConsensusUpgradeByChainIdAndUpgradeId,
				} = await import('$/constants/EthereumNetworkUpgrades.ts')
				return networkUpgrades
					.filter((networkUpgrade) => (
						networkUpgrade[EntityMetaKey.Id].$network.caip2.reference === entityId.caip2.reference
					))
					.map((networkUpgrade) => {
						if (networkUpgrade.$networkExecutionUpgrade == null)
							throw new Error(`Constants_Internal: NetworkUpgrade ${networkUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${networkUpgrade[EntityMetaKey.Id].upgradeId} has no $networkExecutionUpgrade`)

						const linkedNetworkExecutionUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[
							`${networkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${networkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Id].upgradeId}`
						]
						const linkedNetworkConsensusUpgrade = (
							networkUpgrade.$networkConsensusUpgrade == null ?
								undefined
							:
								networkConsensusUpgradeByChainIdAndUpgradeId[
									`${networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Id].upgradeId}`
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
								stringify(otherProposal[EntityMetaKey.Id]) === stringify(proposal[EntityMetaKey.Id])
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
							[EntityMetaKey.Id]: networkUpgrade[EntityMetaKey.Id],
						}
					})
			},
			fields: {
				$$upgrades: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { networkExecutionUpgrades } = await import('$/constants/EthereumNetworkUpgrades.ts')
				return networkExecutionUpgrades
					.filter((networkExecutionUpgrade) => (
						networkExecutionUpgrade[EntityMetaKey.Id].$network.caip2.reference === entityId.caip2.reference
					))
					.map((networkExecutionUpgrade) => ({ ...networkExecutionUpgrade }))
			},
			fields: {
				$$executionUpgrades: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { networkConsensusUpgrades } = await import('$/constants/EthereumNetworkUpgrades.ts')
				return networkConsensusUpgrades
					.filter((networkConsensusUpgrade) => (
						networkConsensusUpgrade[EntityMetaKey.Id].$network.caip2.reference === entityId.caip2.reference
					))
					.map((networkConsensusUpgrade) => ({ ...networkConsensusUpgrade }))
			},
			fields: {
				$$consensusUpgrades: (entity) => entity,
			},
		}),

		defineResolver({
				entityType: EntityType.EthereumNetworkUpgrade,
				accepts: [EntityIdProjection.Identity],
				resolve: async (entityId) => {
					const { networkUpgradeByChainIdAndUpgradeId } = await import('$/constants/EthereumNetworkUpgrades.ts')
					const networkUpgrade = networkUpgradeByChainIdAndUpgradeId[`${entityId.$network.caip2.reference}:${entityId.upgradeId}`]
					if (networkUpgrade.$networkExecutionUpgrade == null) {
						throw new Error(`Constants_Internal: unknown NetworkUpgrade ${entityId.$network.caip2.reference}:${entityId.upgradeId}`)
					}
					return (
						{ ...networkUpgrade.$networkExecutionUpgrade }
					)
				},
			fields: {
				$networkExecutionUpgrade: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.EthereumNetworkUpgrade,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { networkUpgradeByChainIdAndUpgradeId } = await import('$/constants/EthereumNetworkUpgrades.ts')
				const networkUpgrade = networkUpgradeByChainIdAndUpgradeId[`${entityId.$network.caip2.reference}:${entityId.upgradeId}`]
				return (
		networkUpgrade.$networkConsensusUpgrade == null ?
						undefined
					:
						{ ...networkUpgrade.$networkConsensusUpgrade }
				)
			},
			fields: {
				$networkConsensusUpgrade: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.EthereumNetworkUpgrade,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const {
					networkUpgradeByChainIdAndUpgradeId,
					networkExecutionUpgradeByChainIdAndUpgradeId,
					networkConsensusUpgradeByChainIdAndUpgradeId,
				} = await import('$/constants/EthereumNetworkUpgrades.ts')
				const networkUpgrade = networkUpgradeByChainIdAndUpgradeId[`${entityId.$network.caip2.reference}:${entityId.upgradeId}`]
				if (networkUpgrade.$networkExecutionUpgrade == null)
					throw new Error(`Constants_Internal: NetworkUpgrade ${entityId.$network.caip2.reference}:${entityId.upgradeId} has no $networkExecutionUpgrade`)

				const proposals = [
					...(
						networkExecutionUpgradeByChainIdAndUpgradeId[
							`${networkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${networkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Id].upgradeId}`
						]?.$$proposals ?? []
					),
					...(
						networkUpgrade.$networkConsensusUpgrade == null ?
							[]
						:
							networkConsensusUpgradeByChainIdAndUpgradeId[
								`${networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Id].upgradeId}`
							]?.$$proposals ?? []
					),
				].filter((proposal, index, proposals) => (
					proposals.findIndex((otherProposal) => (
						stringify(otherProposal[EntityMetaKey.Id]) === stringify(proposal[EntityMetaKey.Id])
					)) === index
				))
				if (proposals.length === 0) {
					throw new Error(`Constants_Internal: NetworkUpgrade ${entityId.upgradeId} has no $$proposals`)
				}
				return proposals
			},
			fields: {
				$$proposals: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.EthereumExecutionUpgrade,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const { networkExecutionUpgradeByChainIdAndUpgradeId } = await import('$/constants/EthereumNetworkUpgrades.ts')
				const networkExecutionUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[`${entityId.$network.caip2.reference}:${entityId.upgradeId}`]
				const proposals = [...(networkExecutionUpgrade.$$proposals ?? [])]
				if (proposals.length === 0) {
					throw new Error(`Constants_Internal: NetworkExecutionUpgrade ${entityId.upgradeId} has no $$proposals`)
				}
				return proposals
			},
			fields: {
				$$proposals: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.EthereumConsensusUpgrade,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const {
					networkConsensusUpgradeByChainIdAndUpgradeId,
					networkExecutionUpgradeByChainIdAndUpgradeId,
					networkUpgrades,
				} = await import('$/constants/EthereumNetworkUpgrades.ts')
				const networkConsensusUpgrade = networkConsensusUpgradeByChainIdAndUpgradeId[`${entityId.$network.caip2.reference}:${entityId.upgradeId}`]
				const directProposals = [...(networkConsensusUpgrade.$$proposals ?? [])]
				if (directProposals.length > 0) {
					return directProposals
				}
				const umbrellaNetworkUpgrade = networkUpgrades.find((networkUpgrade) => (
					networkUpgrade.$networkConsensusUpgrade?.[EntityMetaKey.Id].$network.caip2.reference === entityId.$network.caip2.reference
					&& networkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Id].upgradeId === entityId.upgradeId
				))
				if (umbrellaNetworkUpgrade != null) {
					if (umbrellaNetworkUpgrade.$networkExecutionUpgrade == null)
						throw new Error(`Constants_Internal: NetworkUpgrade ${umbrellaNetworkUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${umbrellaNetworkUpgrade[EntityMetaKey.Id].upgradeId} has no $networkExecutionUpgrade`)

					const linkedProposals = [
						...(
							networkExecutionUpgradeByChainIdAndUpgradeId[
								`${umbrellaNetworkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${umbrellaNetworkUpgrade.$networkExecutionUpgrade[EntityMetaKey.Id].upgradeId}`
							]?.$$proposals ?? []
						),
						...(
							umbrellaNetworkUpgrade.$networkConsensusUpgrade == null ?
								[]
							:
								networkConsensusUpgradeByChainIdAndUpgradeId[
									`${umbrellaNetworkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${umbrellaNetworkUpgrade.$networkConsensusUpgrade[EntityMetaKey.Id].upgradeId}`
								]?.$$proposals ?? []
						),
					].filter((proposal, index, proposals) => (
						proposals.findIndex((otherProposal) => (
							stringify(otherProposal[EntityMetaKey.Id]) === stringify(proposal[EntityMetaKey.Id])
						)) === index
					))
					if (linkedProposals.length > 0) {
						return linkedProposals
					}
				}
				throw new Error(`Constants_Internal: NetworkConsensusUpgrade ${entityId.upgradeId} has no $$proposals`)
			},
			fields: {
				$$proposals: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.LensNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => (
				lensNetworkSeedAccounts.map((account) => ({
					[EntityMetaKey.Id]: account,
				}))
			),
			fields: {
				$$lensAccounts: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.LensNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => {
				throw new Error('Constants_Internal: $$lensPosts is unsupported')
			},
			fields: {
				$$lensPosts: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => (
				nostrNetworkSeedProfiles.map((profile) => ({
					[EntityMetaKey.Id]: profile,
				}))
			),
			fields: {
				$$nostrProfiles: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => {
				throw new Error('Constants_Internal: $$nostrNotes is unsupported')
			},
			fields: {
				$$nostrNotes: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => (
				nostrNetworkSeedRelays.map((relay) => ({
					[EntityMetaKey.Id]: relay,
				}))
			),
			fields: {
				$$nostrRelays: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => {
				throw new Error('Constants_Internal: $$nostrReposts is unsupported')
			},
			fields: {
				$$nostrReposts: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.NostrNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => {
				throw new Error('Constants_Internal: $$nostrArticles is unsupported')
			},
			fields: {
				$$nostrArticles: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.AtprotoNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => (
				atprotoNetworkSeedActors.map((actor) => ({
					[EntityMetaKey.Id]: actor,
				}))
			),
			fields: {
				$$atprotoActors: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.AtprotoNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => {
				throw new Error('Constants_Internal: $$atprotoPosts is unsupported')
			},
			fields: {
				$$atprotoPosts: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.ActivityPubNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => (
				activityPubNetworkSeedActors.map((actor) => ({
					[EntityMetaKey.Id]: actor,
				}))
			),
			fields: {
				$$activityPubActors: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.ActivityPubNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => {
				throw new Error('Constants_Internal: $$activityPubNotes is unsupported')
			},
			fields: {
				$$activityPubNotes: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.RedditNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => (
				redditNetworkSeedSubreddits.map((subreddit) => ({
					[EntityMetaKey.Id]: subreddit,
				}))
			),
			fields: {
				$$redditSubreddits: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.RedditNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => {
				throw new Error('Constants_Internal: $$redditLinks is unsupported')
			},
			fields: {
				$$redditLinks: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.RssNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => (
				rssNetworkSeedFeeds.map((feed) => ({
					[EntityMetaKey.Id]: feed,
				}))
			),
			fields: {
				$$rssFeeds: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.RssNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => {
				throw new Error('Constants_Internal: $$rssItems is unsupported')
			},
			fields: {
				$$rssItems: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.XNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => (
				xNetworkSeedUsers.map((user) => ({
					[EntityMetaKey.Id]: user,
				}))
			),
			fields: {
				$$xUsers: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.XNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => {
				throw new Error('Constants_Internal: $$xPosts is unsupported')
			},
			fields: {
				$$xPosts: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.XmtpNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async () => {
				throw new Error('Constants_Internal: $$xmtpConversations is unsupported')
			},
			fields: {
				$$xmtpConversations: (entity) => entity,
			},
		}),

		defineResolver({
				entityType: EntityType.YouTubeNetwork,
				accepts: [EntityIdProjection.Identity],
				resolve: async () => (
					[...youtubeNetworkSeedChannels].map((channel) => ({
						[EntityMetaKey.Id]: channel,
					}))
				),
			fields: {
				$$youtubeChannels: (entity) => entity,
			},
		}),

		defineResolver({
				entityType: EntityType.YouTubeNetwork,
				accepts: [EntityIdProjection.Identity],
				resolve: async () => (
					[...youtubeNetworkSeedVideos].map((video) => ({
						[EntityMetaKey.Id]: video,
					}))
				),
			fields: {
				$$youtubeVideos: (entity) => entity,
			},
		}),

		defineResolver({
				entityType: EntityType.YouTubeNetwork,
				accepts: [EntityIdProjection.Identity],
				resolve: async () => (
					[...youtubeNetworkSeedPlaylists].map((playlist) => ({
						[EntityMetaKey.Id]: playlist,
					}))
				),
			fields: {
				$$youtubePlaylists: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType._Global,
			accepts: [EntityIdProjection.Identity],
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				throw new Error('Constants_Internal: $$liquidityPositions is unsupported')
			},
			fields: {
				$$liquidityPositions: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmContract,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const address = hexLowerOfByteSize(entityId.address, 20)
				if (address == null) {
					throw new Error('Constants_Internal: EvmContract address not normalized')
				}
				const chainPrecompiles = (
					precompilesByChainId[Number(entityId.$network.caip2.reference)]
					?? standardPrecompiles
				)
				return chainPrecompiles.find((precompile) => (
					precompile.address.toLowerCase() === address.toLowerCase()
				))?.name
			},
			fields: {
				precompileName: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.EvmNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId, context) => {
				const limit = resolverContextRowLimit(context)
				return (
					precompilesByChainId[Number(entityId.caip2.reference)]
					?? standardPrecompiles
				)
					.slice(0, limit)
					.flatMap((precompile) => {
						const address = hexLowerOfByteSize(precompile.address, 20)
						return address == null ?
							[]
						:
							[{
							[EntityMetaKey.Id]: {
								$network: { caip2: entityId.caip2 },
								address,
							},
						}]
					})
			},
			fields: {
				$$contracts: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.ZeroGNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const network = networkBySlug[entityId.networkSlug]
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				const coinId = nativeAssetCoinIdByNamespace[namespace]
				if (coinId == null) return []
				return [
					{
						[EntityMetaKey.Id]: {
							$network: {
								networkSlug: entityId.networkSlug,
							},
							kind: AssetInstanceKind.Native,
							assetKey: coinId,
						},
						coinId,
						symbol: coinId,
					},
				]
			},
			fields: {
				$$nativeAssets: (entity) => entity,
			},
		}),

		defineResolver({
			entityType: EntityType.QuilibriumNetwork,
			accepts: [EntityIdProjection.Identity],
			resolve: async (entityId) => {
				const network = networkBySlug[entityId.networkSlug]
				if (network == null) return []
				const namespace: NetworkNamespace = network.namespace
				const coinId = nativeAssetCoinIdByNamespace[namespace]
				if (coinId == null) return []
				return [
					{
						[EntityMetaKey.Id]: {
							$network: {
								networkSlug: entityId.networkSlug,
							},
							kind: AssetInstanceKind.Native,
							assetKey: coinId,
						},
						coinId,
					},
				]
			},
			fields: {
				$$nativeAssets: (entity) => entity,
			},
		}),
	],
}

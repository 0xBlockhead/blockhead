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
	defineEntityFieldResolver,
	defineEntityResolver,
	resolverLoadSubsetRowLimit,
} from '$/resolvers/$resolvers.ts'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
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

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.EthereumNetworkUpgrade,
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
				if (networkUpgrade == null)
					throw new Error(`Constants_Internal: unknown NetworkUpgrade ${entityId.$network.caip2.reference}:${entityId.upgradeId}`)
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
					linkedNetworkExecutionUpgrade?.activationTimestampMs,
					linkedNetworkConsensusUpgrade?.activationTimestampMs,
				].filter((timestamp): timestamp is number => timestamp != null)
				const proposals = [
					...(linkedNetworkExecutionUpgrade?.$$proposals ?? []),
					...(linkedNetworkConsensusUpgrade?.$$proposals ?? []),
				].filter((proposal, index, proposals) => (
					proposals.findIndex((otherProposal) => (
						stringify(otherProposal[EntityMetaKey.Id]) === stringify(proposal[EntityMetaKey.Id])
					)) === index
				))

				return {
					...networkUpgrade,
					...(linkedNetworkExecutionUpgrade?.activationBlock != null && {
						activationBlock: linkedNetworkExecutionUpgrade.activationBlock,
					}),
					...(linkedNetworkExecutionUpgrade?.activationBlock == null && linkedNetworkConsensusUpgrade?.activationBlock != null && {
						activationBlock: linkedNetworkConsensusUpgrade.activationBlock,
					}),
					...(activationTimestampsMs.length > 0 && {
						activationTimestampMs: Math.max(...activationTimestampsMs),
					}),
					...(linkedNetworkConsensusUpgrade?.activationEpoch != null && {
						activationEpoch: linkedNetworkConsensusUpgrade.activationEpoch,
					}),
					...(linkedNetworkConsensusUpgrade?.activationEpoch == null && linkedNetworkExecutionUpgrade?.activationEpoch != null && {
						activationEpoch: linkedNetworkExecutionUpgrade.activationEpoch,
					}),
					...(proposals.length > 0 && { $$proposals: proposals }),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EthereumExecutionUpgrade,
			resolve: async (entityId) => {
				const { networkExecutionUpgradeByChainIdAndUpgradeId } = await import(
					'$/constants/EthereumNetworkUpgrades.ts'
				)
				const networkExecutionUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[
					`${entityId.$network.caip2.reference}:${entityId.upgradeId}`
				]
				if (networkExecutionUpgrade == null)
					throw new Error(`Constants_Internal: unknown NetworkExecutionUpgrade ${entityId.$network.caip2.reference}:${entityId.upgradeId}`)

				return { ...networkExecutionUpgrade }
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EthereumConsensusUpgrade,
			resolve: async (entityId) => {
				const { networkConsensusUpgradeByChainIdAndUpgradeId } = await import(
					'$/constants/EthereumNetworkUpgrades.ts'
				)
				const networkConsensusUpgrade = networkConsensusUpgradeByChainIdAndUpgradeId[
					`${entityId.$network.caip2.reference}:${entityId.upgradeId}`
				]
				if (networkConsensusUpgrade == null)
					throw new Error(`Constants_Internal: unknown NetworkConsensusUpgrade ${entityId.$network.caip2.reference}:${entityId.upgradeId}`)

				return { ...networkConsensusUpgrade }
			},
		}),

		defineEntityResolver({
			entityType: EntityType.MarketVenue,
			resolve: async (entityId) => {
				const { marketVenueById } = await import('$/constants/MarketVenue.ts')
				return {
					label: marketVenueById[entityId.marketVenueId].label,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.Currency,
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
		}),

		defineEntityResolver({
			entityType: EntityType.Currency_Timestamp,
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
		}),

		defineEntityResolver({
			entityType: EntityType.Market,
			resolve: async (_entityId) => ({}),
		}),

		defineEntityResolver({
			entityType: EntityType.EvmContract,
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
		}),

		defineEntityResolver({
			entityType: EntityType.Coin,
			resolve: async (entityId) => {
				const { coinById } = await import('$/constants/Coin.ts')
				const coin = coinById[entityId.coinId]
				return {
					symbol: coin.symbol,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmCoinInstance,
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
		}),

		defineEntityResolver({
			entityType: EntityType.CoinBridgeCapability,
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
		}),

		defineEntityResolver({
			entityType: EntityType.MarketPrice,
			resolve: async (_entityId) => ({}),
		}),

		defineEntityResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			resolve: async (_entityId) => ({}),
		}),

		defineEntityResolver({
			entityType: EntityType.Url,
			resolve: async (_entityId) => (
				{}
			),
		}),

		defineEntityResolver({
			entityType: EntityType.EvmNetwork,
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
		}),

		defineEntityResolver({
			entityType: EntityType.MevRelay,
			resolve: async (entityId) => ({
				url: `https://${entityId.host}`,
			}),
		}),

		defineEntityResolver({
			entityType: EntityType.Network,
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
		}),

		defineEntityResolver({
			entityType: EntityType.NearNetwork,
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
		}),

		defineEntityResolver({
			entityType: EntityType.ZeroGNetwork,
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
		}),

		defineEntityResolver({
			entityType: EntityType.QuilibriumNetwork,
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
		}),

		defineEntityResolver({
			entityType: EntityType.SolanaNetwork,
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
		}),

		defineEntityResolver({
			entityType: EntityType.NetworkStack,
			resolve: async (entityId) => ({
				label: networkStackByNetworkStackId[entityId.networkStackId].label,
			}),
		}),

		defineEntityResolver({
			entityType: EntityType.ExecutionEnvironment,
			resolve: async (entityId) => ({
				label: executionEnvironmentByExecutionEnvironmentId[entityId.executionEnvironmentId].label,
			}),
		}),

		defineEntityResolver({
			entityType: EntityType.ConsensusMechanism,
			resolve: async (entityId) => ({
				label: consensusMechanismById[entityId.consensusMechanismId].label,
			}),
		}),

		defineEntityResolver({
			entityType: EntityType.AssetInstance,
			resolve: async (entityId) => ({
				...(entityId.kind === AssetInstanceKind.Native && {
					name: entityId.assetKey,
					symbol: entityId.assetKey,
				}),
			}),
		}),

		defineEntityResolver({
			entityType: EntityType.BittensorSubnet,
			resolve: async (entityId) => ({
				name: entityId.netuid === 0 ? 'Root' : `Subnet ${entityId.netuid}`,
			}),
		}),

		defineEntityResolver({
			entityType: EntityType.NetworkUpgrade,
			resolve: async (entityId) => ({
				name: entityId.upgradeId,
			}),
		}),

		defineEntityResolver({
			entityType: EntityType.CosmosGovernanceProposal,
			resolve: async (_entityId) => ({}),
		}),

		defineEntityResolver({
			entityType: EntityType.PolkadotReferendum,
			resolve: async (_entityId) => ({}),
		}),

		defineEntityResolver({
			entityType: EntityType.SpecificationRealm,
			resolve: async (entityId) => ({
				label: specificationRealmById[entityId.realm].label,
				...(specificationRealmById[entityId.realm].labelPlural != null && {
					labelPlural: specificationRealmById[entityId.realm].labelPlural,
				}),
				slug: specificationRealmById[entityId.realm].slug,
			}),
		}),

		defineEntityResolver({
			entityType: EntityType.SpecificationProposalKind,
			resolve: async (entityId) => (
				{
					label: proposalCategoryById[entityId.category].label,
					labelPlural: proposalCategoryById[entityId.category].labelPlural,
					slug: proposalCategoryById[entityId.category].slug,
				}
			),
		}),

		defineEntityResolver({
			entityType: EntityType.ActivityPubNetwork,
				resolve: async () => activityPubNetworkFieldValues,
			}),

		defineEntityResolver({
			entityType: EntityType.AtprotoNetwork,
				resolve: async () => atprotoNetworkFieldValues,
			}),

		defineEntityResolver({
			entityType: EntityType.EnsProtocol,
				resolve: async () => ensProtocolFieldValues,
			}),

		defineEntityResolver({
			entityType: EntityType.EvmProtocol,
				resolve: async () => evmProtocolFieldValues,
			}),

		defineEntityResolver({
			entityType: EntityType.IpfsProtocol,
				resolve: async () => ipfsProtocolFieldValues,
			}),

		defineEntityResolver({
			entityType: EntityType.SwarmProtocol,
				resolve: async () => swarmProtocolFieldValues,
			}),

		defineEntityResolver({
			entityType: EntityType.LensNetwork,
				resolve: async () => lensNetworkFieldValues,
			}),

		defineEntityResolver({
			entityType: EntityType.NostrNetwork,
				resolve: async () => nostrNetworkFieldValues,
			}),

		defineEntityResolver({
			entityType: EntityType.RedditNetwork,
				resolve: async () => redditNetworkFieldValues,
			}),

		defineEntityResolver({
			entityType: EntityType.RssNetwork,
				resolve: async () => rssNetworkFieldValues,
			}),

		defineEntityResolver({
			entityType: EntityType.XNetwork,
				resolve: async () => xNetworkFieldValues,
			}),

		defineEntityResolver({
			entityType: EntityType.XmtpNetwork,
				resolve: async () => xmtpNetworkFieldValues,
			}),

		defineEntityResolver({
				entityType: EntityType.YouTubeNetwork,
				resolve: async () => youtubeNetworkFieldValues,
			}),
	],

	entityFieldResolvers: [
		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$networks',
				resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => (
					[...networks].map((network) => ({
						[EntityMetaKey.Id]: {
							networkSlug: network.slug,
					},
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$networkUpgrades',
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
						linkedNetworkExecutionUpgrade?.activationTimestampMs,
						linkedNetworkConsensusUpgrade?.activationTimestampMs,
					].filter((timestamp): timestamp is number => timestamp != null)
					const proposals = [
						...(linkedNetworkExecutionUpgrade?.$$proposals ?? []),
						...(linkedNetworkConsensusUpgrade?.$$proposals ?? []),
					].filter((proposal, index, proposals) => (
						proposals.findIndex((otherProposal) => (
							stringify(otherProposal[EntityMetaKey.Id]) === stringify(proposal[EntityMetaKey.Id])
						)) === index
					))

					return {
						...networkUpgrade,
						...(linkedNetworkExecutionUpgrade?.activationBlock != null && {
							activationBlock: linkedNetworkExecutionUpgrade.activationBlock,
						}),
						...(linkedNetworkExecutionUpgrade?.activationBlock == null && linkedNetworkConsensusUpgrade?.activationBlock != null && {
							activationBlock: linkedNetworkConsensusUpgrade.activationBlock,
						}),
						...(activationTimestampsMs.length > 0 && {
							activationTimestampMs: Math.max(...activationTimestampsMs),
						}),
						...(linkedNetworkConsensusUpgrade?.activationEpoch != null && {
							activationEpoch: linkedNetworkConsensusUpgrade.activationEpoch,
						}),
						...(linkedNetworkConsensusUpgrade?.activationEpoch == null && linkedNetworkExecutionUpgrade?.activationEpoch != null && {
							activationEpoch: linkedNetworkExecutionUpgrade.activationEpoch,
						}),
						...(proposals.length > 0 && { $$proposals: proposals }),
						[EntityMetaKey.Id]: networkUpgrade[EntityMetaKey.Id],
					}
				})
				},
			}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$networkStack',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ZeroGNetwork,
			fieldName: '$networkStack',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.QuilibriumNetwork,
			fieldName: '$networkStack',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$executionEnvironments',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ZeroGNetwork,
			fieldName: '$$executionEnvironments',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.QuilibriumNetwork,
			fieldName: '$$executionEnvironments',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$consensusMechanisms',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ZeroGNetwork,
			fieldName: '$$consensusMechanisms',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.QuilibriumNetwork,
			fieldName: '$$consensusMechanisms',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$nativeAssets',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$faucetUrls',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$blockExplorerUrls',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$specificationRealms',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$proposalKinds',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => (
				proposalKindIds.map((proposalKindId) => ({
					[EntityMetaKey.Id]: proposalKindId,
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationRealm,
			fieldName: '$$proposalKinds',
			resolve: async (entityId: EntityId<typeof schema, EntityType.SpecificationRealm>) => (
				proposalKindIds
					.filter((proposalKindId) => (
						proposalKindId.realm === entityId.realm
					))
					.map((proposalKindId) => ({
						[EntityMetaKey.Id]: proposalKindId,
					}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.SpecificationProposalKind,
			fieldName: '$specificationRealm',
			resolve: async (entityId: EntityId<typeof schema, EntityType.SpecificationProposalKind>) => (
				{
					[EntityMetaKey.Id]: {
						realm: entityId.realm,
					},
				}
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$coins',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketVenues',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.MarketVenue,
			fieldName: '$$markets',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$currencies',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => (
					[...currencies].map((currency) => (
					{
						[EntityMetaKey.Id]: {
							iso4217: currency.iso4217,
						},
					}
				))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Currency,
			fieldName: '$$timestamps',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$markets',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$marketPrices',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsBase',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => (
				[
					{
						[EntityMetaKey.Id]: catalogCoinUsdMarketIdByCoinId[entityId.coinId],
					},
				]
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Coin,
			fieldName: '$$marketsWithCoinAsQuote',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => (
				(catalogMarketsWithCoinAsQuoteByQuoteCoinId[entityId.coinId] ).map((marketId) => ({
					[EntityMetaKey.Id]: marketId,
				}))
			),
		}),

				defineEntityFieldResolver({
					entityType: EntityType.Coin,
					fieldName: '$$coinInstances',
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
				}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmCoinInstance,
			fieldName: '$$outboundBridgeCapabilities',
			resolve: async () => {
				throw new Error('Constants_Internal: $$outboundBridgeCapabilities is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmCoinInstance,
			fieldName: '$$inboundBridgeCapabilities',
			resolve: async () => {
				throw new Error('Constants_Internal: $$inboundBridgeCapabilities is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmCoinInstance,
			fieldName: '$canonicalInstance',
			resolve: async () => {
				throw new Error('Constants_Internal: $canonicalInstance is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmCoinInstance,
			fieldName: 'representation',
			resolve: async (entityId) => {
				if (
					entityId.type === CoinInstanceType.NativeCurrency
					&& Number(entityId.$network.caip2.reference) === 1
				) {
					return CoinInstanceRepresentation.IssuerNative
				}
				throw new Error('Constants_Internal: CoinInstance representation unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$baseCoin',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$$marketPrices',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market,
			fieldName: '$$marketTimeIntervalTimestamps',
			resolve: async () => {
				throw new Error('Constants_Internal: $$marketTimeIntervalTimestamps is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.MarketPrice,
			fieldName: '$parentMarket',
			resolve: async (entityId: EntityId<typeof schema, EntityType.MarketPrice>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			fieldName: '$parentMarket',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market_TimeInterval_Timestamp>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmCoinInstance,
			fieldName: '$$marketsWithInstanceAsBase',
			resolve: async () => {
				throw new Error('Constants_Internal: $$marketsWithInstanceAsBase is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmCoinInstance,
			fieldName: '$$marketsWithInstanceAsQuote',
			resolve: async () => {
				throw new Error('Constants_Internal: $$marketsWithInstanceAsQuote is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: 'hasBlobParameterExecutionUpgrade',
			resolve: async (entityId) => {
				const { networkExecutionUpgrades } = await import('$/constants/EthereumNetworkUpgrades.ts')
				return (
					networkExecutionUpgrades.some((executionUpgrade) => (
						executionUpgrade[EntityMetaKey.Id].$network.caip2.reference === entityId.caip2.reference
						&& executionUpgrade.layer === NetworkExecutionUpgradeLayer.Blob
					))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: 'consensusProtocol',
			resolve: async (entityId) => {
				const { beaconRestBaseByExecutionChainId } = await import('$/constants/BeaconConsensus.ts')
				return beaconRestBaseByExecutionChainId[Number(entityId.caip2.reference)]?.consensusProtocol
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$mevRelays',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$upgrades',
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
							linkedNetworkExecutionUpgrade?.activationTimestampMs,
							linkedNetworkConsensusUpgrade?.activationTimestampMs,
						].filter((timestamp): timestamp is number => timestamp != null)
						const proposals = [
							...(linkedNetworkExecutionUpgrade?.$$proposals ?? []),
							...(linkedNetworkConsensusUpgrade?.$$proposals ?? []),
						].filter((proposal, index, proposals) => (
							proposals.findIndex((otherProposal) => (
								stringify(otherProposal[EntityMetaKey.Id]) === stringify(proposal[EntityMetaKey.Id])
							)) === index
						))

						return {
							...networkUpgrade,
							...(linkedNetworkExecutionUpgrade?.activationBlock != null && {
								activationBlock: linkedNetworkExecutionUpgrade.activationBlock,
							}),
							...(linkedNetworkExecutionUpgrade?.activationBlock == null && linkedNetworkConsensusUpgrade?.activationBlock != null && {
								activationBlock: linkedNetworkConsensusUpgrade.activationBlock,
							}),
							...(activationTimestampsMs.length > 0 && {
								activationTimestampMs: Math.max(...activationTimestampsMs),
							}),
							...(linkedNetworkConsensusUpgrade?.activationEpoch != null && {
								activationEpoch: linkedNetworkConsensusUpgrade.activationEpoch,
							}),
							...(linkedNetworkConsensusUpgrade?.activationEpoch == null && linkedNetworkExecutionUpgrade?.activationEpoch != null && {
								activationEpoch: linkedNetworkExecutionUpgrade.activationEpoch,
							}),
							...(proposals.length > 0 && { $$proposals: proposals }),
							[EntityMetaKey.Id]: networkUpgrade[EntityMetaKey.Id],
						}
					})
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$executionUpgrades',
			resolve: async (entityId) => {
				const { networkExecutionUpgrades } = await import('$/constants/EthereumNetworkUpgrades.ts')
				return networkExecutionUpgrades
					.filter((networkExecutionUpgrade) => (
						networkExecutionUpgrade[EntityMetaKey.Id].$network.caip2.reference === entityId.caip2.reference
					))
					.map((networkExecutionUpgrade) => ({ ...networkExecutionUpgrade }))
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$consensusUpgrades',
			resolve: async (entityId) => {
				const { networkConsensusUpgrades } = await import('$/constants/EthereumNetworkUpgrades.ts')
				return networkConsensusUpgrades
					.filter((networkConsensusUpgrade) => (
						networkConsensusUpgrade[EntityMetaKey.Id].$network.caip2.reference === entityId.caip2.reference
					))
					.map((networkConsensusUpgrade) => ({ ...networkConsensusUpgrade }))
			},
		}),

		defineEntityFieldResolver({
				entityType: EntityType.EthereumNetworkUpgrade,
				fieldName: '$networkExecutionUpgrade',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EthereumNetworkUpgrade,
			fieldName: '$networkConsensusUpgrade',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EthereumNetworkUpgrade,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const {
					networkUpgradeByChainIdAndUpgradeId,
					networkExecutionUpgradeByChainIdAndUpgradeId,
					networkConsensusUpgradeByChainIdAndUpgradeId,
				} = await import('$/constants/EthereumNetworkUpgrades.ts')
				const networkUpgrade = networkUpgradeByChainIdAndUpgradeId[`${entityId.$network.caip2.reference}:${entityId.upgradeId}`]
				if (networkUpgrade == null)
					throw new Error(`Constants_Internal: unknown NetworkUpgrade ${entityId.$network.caip2.reference}:${entityId.upgradeId}`)
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EthereumExecutionUpgrade,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { networkExecutionUpgradeByChainIdAndUpgradeId } = await import('$/constants/EthereumNetworkUpgrades.ts')
				const networkExecutionUpgrade = networkExecutionUpgradeByChainIdAndUpgradeId[`${entityId.$network.caip2.reference}:${entityId.upgradeId}`]
				const proposals = [...(networkExecutionUpgrade.$$proposals ?? [])]
				if (proposals.length === 0) {
					throw new Error(`Constants_Internal: NetworkExecutionUpgrade ${entityId.upgradeId} has no $$proposals`)
				}
				return proposals
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EthereumConsensusUpgrade,
			fieldName: '$$proposals',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.LensNetwork,
			fieldName: '$$lensAccounts',
			resolve: async () => (
				lensNetworkSeedAccounts.map((account) => ({
					[EntityMetaKey.Id]: account,
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.LensNetwork,
			fieldName: '$$lensPosts',
			resolve: async () => {
				throw new Error('Constants_Internal: $$lensPosts is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrProfiles',
			resolve: async () => (
				nostrNetworkSeedProfiles.map((profile) => ({
					[EntityMetaKey.Id]: profile,
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrNotes',
			resolve: async () => {
				throw new Error('Constants_Internal: $$nostrNotes is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrRelays',
			resolve: async () => (
				nostrNetworkSeedRelays.map((relay) => ({
					[EntityMetaKey.Id]: relay,
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrReposts',
			resolve: async () => {
				throw new Error('Constants_Internal: $$nostrReposts is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NostrNetwork,
			fieldName: '$$nostrArticles',
			resolve: async () => {
				throw new Error('Constants_Internal: $$nostrArticles is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.AtprotoNetwork,
			fieldName: '$$atprotoActors',
			resolve: async () => (
				atprotoNetworkSeedActors.map((actor) => ({
					[EntityMetaKey.Id]: actor,
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.AtprotoNetwork,
			fieldName: '$$atprotoPosts',
			resolve: async () => {
				throw new Error('Constants_Internal: $$atprotoPosts is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubNetwork,
			fieldName: '$$activityPubActors',
			resolve: async () => (
				activityPubNetworkSeedActors.map((actor) => ({
					[EntityMetaKey.Id]: actor,
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ActivityPubNetwork,
			fieldName: '$$activityPubNotes',
			resolve: async () => {
				throw new Error('Constants_Internal: $$activityPubNotes is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RedditNetwork,
			fieldName: '$$redditSubreddits',
			resolve: async () => (
				redditNetworkSeedSubreddits.map((subreddit) => ({
					[EntityMetaKey.Id]: subreddit,
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RedditNetwork,
			fieldName: '$$redditLinks',
			resolve: async () => {
				throw new Error('Constants_Internal: $$redditLinks is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RssNetwork,
			fieldName: '$$rssFeeds',
			resolve: async () => (
				rssNetworkSeedFeeds.map((feed) => ({
					[EntityMetaKey.Id]: feed,
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.RssNetwork,
			fieldName: '$$rssItems',
			resolve: async () => {
				throw new Error('Constants_Internal: $$rssItems is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.XNetwork,
			fieldName: '$$xUsers',
			resolve: async () => (
				xNetworkSeedUsers.map((user) => ({
					[EntityMetaKey.Id]: user,
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.XNetwork,
			fieldName: '$$xPosts',
			resolve: async () => {
				throw new Error('Constants_Internal: $$xPosts is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.XmtpNetwork,
			fieldName: '$$xmtpConversations',
			resolve: async () => {
				throw new Error('Constants_Internal: $$xmtpConversations is unsupported')
			},
		}),

		defineEntityFieldResolver({
				entityType: EntityType.YouTubeNetwork,
				fieldName: '$$youtubeChannels',
				resolve: async () => (
					[...youtubeNetworkSeedChannels].map((channel) => ({
						[EntityMetaKey.Id]: channel,
					}))
				),
		}),

		defineEntityFieldResolver({
				entityType: EntityType.YouTubeNetwork,
				fieldName: '$$youtubeVideos',
				resolve: async () => (
					[...youtubeNetworkSeedVideos].map((video) => ({
						[EntityMetaKey.Id]: video,
					}))
				),
		}),

		defineEntityFieldResolver({
				entityType: EntityType.YouTubeNetwork,
				fieldName: '$$youtubePlaylists',
				resolve: async () => (
					[...youtubeNetworkSeedPlaylists].map((playlist) => ({
						[EntityMetaKey.Id]: playlist,
					}))
				),
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$liquidityPositions',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				throw new Error('Constants_Internal: $$liquidityPositions is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmContract,
			fieldName: 'precompileName',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$contracts',
			resolve: async (entityId, context) => {
				const limit = resolverLoadSubsetRowLimit(context)
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.ZeroGNetwork,
			fieldName: '$$nativeAssets',
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
		}),

		defineEntityFieldResolver({
			entityType: EntityType.QuilibriumNetwork,
			fieldName: '$$nativeAssets',
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
		}),
	],
}

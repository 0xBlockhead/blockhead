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
import { beaconRestBaseByExecutionChainId } from '$/constants/BeaconConsensus.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	precompilesByChainId,
} from '$/constants/precompiles/index.ts'
import { standardPrecompiles } from '$/constants/precompiles/standard.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { jsonRpcUrlWithTransportForChain } from '$/sources/Evm/JsonRpc/client.ts'

const networkUpgradeDenormalizedFields = (
	row: Entity<typeof schema, EntityType.EthereumNetworkUpgrade>,
	networkExecutionUpgradeByChainIdAndUpgradeId: Record<
		string,
		Entity<typeof schema, EntityType.EthereumExecutionUpgrade>
	>,
	networkConsensusUpgradeByChainIdAndUpgradeId: Record<
		string,
		Entity<typeof schema, EntityType.EthereumConsensusUpgrade>
	>,
): Partial<
	Pick<
		Entity<typeof schema, EntityType.EthereumNetworkUpgrade>,
		| 'activationBlock'
		| 'activationTimestampMs'
		| 'activationEpoch'
		| '$$proposals'
	>
> => {
	const execRef = row.$networkExecutionUpgrade?.[EntityMetaKey.Id]
	const executionRow = (
		execRef == null ?
			null
		:	networkExecutionUpgradeByChainIdAndUpgradeId[
				`${execRef.$network.caip2.reference}:${execRef.upgradeId}`
			]
	)
	const consRef = row.$networkConsensusUpgrade
	const consensusRow = (
		consRef == null ?
			null
		:	networkConsensusUpgradeByChainIdAndUpgradeId[
				`${consRef[EntityMetaKey.Id].$network.caip2.reference}:${consRef[EntityMetaKey.Id].upgradeId}`
			]
	)

	const activationBlock = executionRow?.activationBlock ?? consensusRow?.activationBlock
	const activationTimestampsMs = [
		executionRow?.activationTimestampMs,
		consensusRow?.activationTimestampMs,
	].filter((timestamp): timestamp is number => timestamp != null)
	const activationTimestampMs = (
		activationTimestampsMs.length > 0 ?
			Math.max(...activationTimestampsMs)
		:	undefined
	)
	const activationEpoch = consensusRow?.activationEpoch ?? executionRow?.activationEpoch

	const seen = new Set<string>()
	const linkedProposals: Entity<typeof schema, EntityType.SpecificationProposal>[] = []
	for (const proposal of [
		...(executionRow?.$$proposals ?? []),
		...(consensusRow?.$$proposals ?? []),
	]) {
		const key = stringify(proposal[EntityMetaKey.Id])
		if (seen.has(key)) continue
		seen.add(key)
		linkedProposals.push(proposal)
	}

	return {
		...(activationBlock != null && { activationBlock }),
		...(activationTimestampMs != null && { activationTimestampMs }),
		...(activationEpoch != null && { activationEpoch }),
		...(linkedProposals.length > 0 && { $$proposals: linkedProposals }),
	}
}

const BEACON_SLOTS_PER_EPOCH = 32
const BEACON_SECONDS_PER_SLOT = 12

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

const executionBlockActivationTimestampMsByKey = new Map<string, number | undefined>()

const zeroGEvmNetworkId = {
	caip2: {
		namespace: 'eip155',
		reference: String(zeroGChainId),
	},
} as const

const activationTimestampMsFromSecondsOrMs = (
	timestamp: number,
): number => (
	timestamp < 1e12 ?
		timestamp * 1000
	:
		timestamp
)

const consensusEpochActivationTimestampMs = async (
	chainId: number,
	activationEpoch: number,
): Promise<number | undefined> => {
	const beaconRestBaseUrl = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
	if (beaconRestBaseUrl == null) {
		return undefined
	}
	const { getBeaconGenesisTimeSeconds } = await import('$/sources/Beacon/Rest/queries.ts')
	const genesisTimeSeconds = await singleFlight(getBeaconGenesisTimeSeconds)(beaconRestBaseUrl)
		.catch(() => undefined)
	if (genesisTimeSeconds == null) {
		return undefined
	}
	return (
		genesisTimeSeconds + activationEpoch * BEACON_SLOTS_PER_EPOCH * BEACON_SECONDS_PER_SLOT
	) * 1000
}

const executionBlockActivationTimestampMs = async (
	chainId: number,
	activationBlock: number,
): Promise<number | undefined> => {
	const cacheKey = `${chainId}:${activationBlock}`
	if (executionBlockActivationTimestampMsByKey.has(cacheKey)) {
		return executionBlockActivationTimestampMsByKey.get(cacheKey)
	}
	const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
	if (jsonRpcTransport == null) {
		executionBlockActivationTimestampMsByKey.set(cacheKey, undefined)
		return undefined
	}
	const { getBlockByNumber } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
	const { getHttpProvider } = await import('$/lib/voltaire.ts')
	const block = await getBlockByNumber({
		provider: getHttpProvider(jsonRpcTransport.rpcUrl),
		blockNumber: BigInt(activationBlock),
	}).catch(() => undefined)
	const activationTimestampMs = (
		block?.timestamp == null ?
			undefined
		:	activationTimestampMsFromSecondsOrMs(Number(block.timestamp))
	)
	executionBlockActivationTimestampMsByKey.set(cacheKey, activationTimestampMs)
	return activationTimestampMs
}

const enrichNetworkExecutionUpgradeActivationTimestamp = async (
	row: Entity<typeof schema, EntityType.EthereumExecutionUpgrade>,
): Promise<Entity<typeof schema, EntityType.EthereumExecutionUpgrade>> => {
	if (row.activationTimestampMs != null) {
		return {
			...row,
			activationTimestampMs: activationTimestampMsFromSecondsOrMs(row.activationTimestampMs),
		}
	}
	if (row.activationBlock != null) {
		const activationTimestampMs = await executionBlockActivationTimestampMs(
			Number(row[EntityMetaKey.Id].$network.caip2.reference),
			row.activationBlock,
		)
		return (
			activationTimestampMs == null ?
				row
			:	{
					...row,
					activationTimestampMs,
	}
)

		}
		if (row.activationEpoch != null) {
			const activationTimestampMs = await consensusEpochActivationTimestampMs(
			Number(row[EntityMetaKey.Id].$network.caip2.reference),
			row.activationEpoch,
		)
		return (
			activationTimestampMs == null ?
				row
			:	{
					...row,
					activationTimestampMs,
				}
		)
		}
		return row
	}

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

const enrichNetworkConsensusUpgradeActivationTimestamp = async (
	row: Entity<typeof schema, EntityType.EthereumConsensusUpgrade>,
): Promise<Entity<typeof schema, EntityType.EthereumConsensusUpgrade>> => {
	if (row.activationTimestampMs != null) {
		return {
			...row,
			activationTimestampMs: activationTimestampMsFromSecondsOrMs(row.activationTimestampMs),
		}
	}
	if (row.activationEpoch != null) {
		const activationTimestampMs = await consensusEpochActivationTimestampMs(
			Number(row[EntityMetaKey.Id].$network.caip2.reference),
			row.activationEpoch,
		)
		return (
			activationTimestampMs == null ?
				row
			:	{
					...row,
					activationTimestampMs,
				}
		)
	}
	if (row.activationBlock != null) {
		const activationTimestampMs = await executionBlockActivationTimestampMs(
			Number(row[EntityMetaKey.Id].$network.caip2.reference),
			row.activationBlock,
		)
		return (
			activationTimestampMs == null ?
				row
			:	{
					...row,
					activationTimestampMs,
				}
		)
	}
	return row
}

const enrichNetworkUpgradeActivationTimestamp = async (
	row: Entity<typeof schema, EntityType.EthereumNetworkUpgrade>,
): Promise<Entity<typeof schema, EntityType.EthereumNetworkUpgrade>> => {
	const {
		networkExecutionUpgradeByChainIdAndUpgradeId,
		networkConsensusUpgradeByChainIdAndUpgradeId,
	} = await import('$/constants/EthereumNetworkUpgrades.ts')
	const executionRow = (
		row.$networkExecutionUpgrade == null ?
			null
		:	networkExecutionUpgradeByChainIdAndUpgradeId[
			`${row.$networkExecutionUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${row.$networkExecutionUpgrade[EntityMetaKey.Id].upgradeId}`
		]
	)
	const consensusRow = (
		row.$networkConsensusUpgrade == null ?
			null
		:	networkConsensusUpgradeByChainIdAndUpgradeId[
			`${row.$networkConsensusUpgrade[EntityMetaKey.Id].$network.caip2.reference}:${row.$networkConsensusUpgrade[EntityMetaKey.Id].upgradeId}`
		]
	)
	const executionTimestamp = (
		executionRow == null ?
			undefined
		:	(await enrichNetworkExecutionUpgradeActivationTimestamp(executionRow)).activationTimestampMs
	)
	const consensusTimestamp = (
		consensusRow == null ?
			undefined
		:	(await enrichNetworkConsensusUpgradeActivationTimestamp(consensusRow)).activationTimestampMs
	)
	const activationTimestampMs = (
		[
			row.activationTimestampMs,
			executionTimestamp,
			consensusTimestamp,
		]
			.filter((timestamp): timestamp is number => timestamp != null)
			.reduce(
				(latest, timestamp) => (
					timestamp > latest ?
						timestamp
					:
						latest
				),
				-Infinity,
			)
	)
	return (
		activationTimestampMs > -Infinity ?
			{
				...row,
				activationTimestampMs,
			}
		:
			row
	)
}

const enrichNetworkUpgradeRowsActivationTimestamp = async (
	rows: Entity<typeof schema, EntityType.EthereumNetworkUpgrade>[],
): Promise<Entity<typeof schema, EntityType.EthereumNetworkUpgrade>[]> => (
	Promise.all(
		rows.map((row) => enrichNetworkUpgradeActivationTimestamp(row)),
	)
)

const enrichNetworkExecutionUpgradeRowsActivationTimestamp = async (
	rows: Entity<typeof schema, EntityType.EthereumExecutionUpgrade>[],
): Promise<Entity<typeof schema, EntityType.EthereumExecutionUpgrade>[]> => (
	Promise.all(
		rows.map((row) => enrichNetworkExecutionUpgradeActivationTimestamp(row)),
	)
)

const enrichNetworkConsensusUpgradeRowsActivationTimestamp = async (
	rows: Entity<typeof schema, EntityType.EthereumConsensusUpgrade>[],
): Promise<Entity<typeof schema, EntityType.EthereumConsensusUpgrade>[]> => (
	Promise.all(
		rows.map((row) => enrichNetworkConsensusUpgradeActivationTimestamp(row)),
	)
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
				const upgradeDefinition = networkUpgradeByChainIdAndUpgradeId[
					`${entityId.$network.caip2.reference}:${entityId.upgradeId}`
				]
				if (upgradeDefinition == null) {
					throw new Error(`Constants_Internal: NetworkUpgrade not found for ${entityId.$network.caip2.reference}:${entityId.upgradeId}`)
				}
				return enrichNetworkUpgradeActivationTimestamp({
					...upgradeDefinition,
					...networkUpgradeDenormalizedFields(
						upgradeDefinition,
						networkExecutionUpgradeByChainIdAndUpgradeId,
						networkConsensusUpgradeByChainIdAndUpgradeId,
					),
				})
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EthereumExecutionUpgrade,
			resolve: async (entityId) => {
				const { networkExecutionUpgradeByChainIdAndUpgradeId } = await import(
					'$/constants/EthereumNetworkUpgrades.ts'
				)
				const upgradeDefinition = networkExecutionUpgradeByChainIdAndUpgradeId[
					`${entityId.$network.caip2.reference}:${entityId.upgradeId}`
				]
				if (upgradeDefinition == null) {
					throw new Error(`Constants_Internal: NetworkExecutionUpgrade not found for ${entityId.$network.caip2.reference}:${entityId.upgradeId}`)
				}
				return enrichNetworkExecutionUpgradeActivationTimestamp({ ...upgradeDefinition })
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EthereumConsensusUpgrade,
			resolve: async (entityId) => {
				const { networkConsensusUpgradeByChainIdAndUpgradeId } = await import(
					'$/constants/EthereumNetworkUpgrades.ts'
				)
				const upgradeDefinition = networkConsensusUpgradeByChainIdAndUpgradeId[
					`${entityId.$network.caip2.reference}:${entityId.upgradeId}`
				]
				if (upgradeDefinition == null) {
					throw new Error(`Constants_Internal: NetworkConsensusUpgrade not found for ${entityId.$network.caip2.reference}:${entityId.upgradeId}`)
				}
				return enrichNetworkConsensusUpgradeActivationTimestamp({ ...upgradeDefinition })
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
				if (coin == null) {
					throw new Error(`Constants_Internal: Coin not found for ${entityId.coinId}`)
				}
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
					throw new Error(`Bridge: unknown LI.FI tool key ${entityId.toolKey}`)
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
				const row = networkByCaip2[`${entityId.caip2.namespace}:${entityId.caip2.reference}`]
				if (row == null) {
					throw new Error(`Constants_Internal: EvmNetwork not found`)
				}
				const beaconRestBase = beaconRestBaseByExecutionChainId[Number(entityId.caip2.reference)]
				const list = executionEndpointsByChainId[Number(entityId.caip2.reference)] ?? []
				return {
					slug: row.slug,
					name: row.name,
					caip2: row.caip2,
					namespace: row.namespace,
					environment: row.environment,
					executionEndpoints: [...list],
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
				const row = (
					'networkSlug' in entityId ?
						networkBySlug[entityId.networkSlug]
					:	networkByCaip2[`${entityId.caip2.namespace}:${entityId.caip2.reference}`]
				)
				if (row == null) {
					throw new Error(`Constants_Internal: Network not found`)
				}
				return {
					slug: row.slug,
					name: row.name,
					...('caip2' in row && {
						caip2: row.caip2,
					}),
					namespace: row.namespace,
					environment: row.environment,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NearNetwork,
			resolve: async (entityId) => {
				const row = networkBySlug[entityId.networkSlug]
				if (row == null) throw new Error('Constants_Internal: NearNetwork not found')
				return {
					slug: row.slug,
					name: row.name,
					...('caip2' in row && {
						caip2: row.caip2,
					}),
					namespace: row.namespace,
					environment: row.environment,
					rpcEndpoints: [
						...nearMainnetRpcEndpoints,
					],
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.ZeroGNetwork,
			resolve: async (entityId) => {
				const row = networkBySlug[entityId.networkSlug]
				if (row == null) throw new Error('Constants_Internal: ZeroGNetwork not found')
				return {
					slug: row.slug,
					name: row.name,
					...('caip2' in row && {
						caip2: row.caip2,
					}),
					namespace: row.namespace,
					environment: row.environment,
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
				const row = networkBySlug[entityId.networkSlug]
				if (row == null) throw new Error('Constants_Internal: QuilibriumNetwork not found')
				return {
					slug: row.slug,
					name: row.name,
					...('caip2' in row && {
						caip2: row.caip2,
					}),
					namespace: row.namespace,
					environment: row.environment,
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.SolanaNetwork,
			resolve: async (entityId) => {
				const row = networkByCaip2[`${entityId.caip2.namespace}:${entityId.caip2.reference}`]
				if (row == null) throw new Error('Constants_Internal: SolanaNetwork not found')
				if (!('caip2' in row)) throw new Error('Constants_Internal: SolanaNetwork missing CAIP-2')
				return {
					slug: row.slug,
					name: row.name,
					caip2: row.caip2,
					namespace: row.namespace,
					environment: row.environment,
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
			resolve: async (entityId) => (
				{
					...specificationRealmById[entityId.realm],
				}
			),
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
			resolve: async (entityId) => {
				if (entityId.scope !== 'ActivityPubNetwork') {
					throw new Error('Constants: unexpected ActivityPubNetwork id')
				}
				return activityPubNetworkFieldValues
			},
		}),

		defineEntityResolver({
			entityType: EntityType.AtprotoNetwork,
			resolve: async (entityId) => {
				if (entityId.scope !== 'AtprotoNetwork') {
					throw new Error('Constants: unexpected AtprotoNetwork id')
				}
				return atprotoNetworkFieldValues
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EnsProtocol,
			resolve: async (entityId) => {
				if (entityId.scope !== 'EnsProtocol') {
					throw new Error('Constants: unexpected EnsProtocol id')
				}
				return ensProtocolFieldValues
			},
		}),

		defineEntityResolver({
			entityType: EntityType.EvmProtocol,
			resolve: async (entityId) => {
				if (entityId.scope !== 'EvmProtocol') {
					throw new Error('Constants: unexpected EvmProtocol id')
				}
				return evmProtocolFieldValues
			},
		}),

		defineEntityResolver({
			entityType: EntityType.IpfsProtocol,
			resolve: async (entityId) => {
				if (entityId.scope !== 'IpfsProtocol') {
					throw new Error('Constants: unexpected IpfsProtocol id')
				}
				return ipfsProtocolFieldValues
			},
		}),

		defineEntityResolver({
			entityType: EntityType.SwarmProtocol,
			resolve: async (entityId) => {
				if (entityId.scope !== 'SwarmProtocol') {
					throw new Error('Constants: unexpected SwarmProtocol id')
				}
				return swarmProtocolFieldValues
			},
		}),

		defineEntityResolver({
			entityType: EntityType.LensNetwork,
			resolve: async (entityId) => {
				if (entityId.scope !== 'LensNetwork') {
					throw new Error('Constants: unexpected LensNetwork id')
				}
				return lensNetworkFieldValues
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NostrNetwork,
			resolve: async (entityId) => {
				if (entityId.scope !== 'NostrNetwork') {
					throw new Error('Constants: unexpected NostrNetwork id')
				}
				return nostrNetworkFieldValues
			},
		}),

		defineEntityResolver({
			entityType: EntityType.RedditNetwork,
			resolve: async (entityId) => {
				if (entityId.scope !== 'RedditNetwork') {
					throw new Error('Constants: unexpected RedditNetwork id')
				}
				return redditNetworkFieldValues
			},
		}),

		defineEntityResolver({
			entityType: EntityType.RssNetwork,
			resolve: async (entityId) => {
				if (entityId.scope !== 'RssNetwork') {
					throw new Error('Constants: unexpected RssNetwork id')
				}
				return rssNetworkFieldValues
			},
		}),

		defineEntityResolver({
			entityType: EntityType.XNetwork,
			resolve: async (entityId) => {
				if (entityId.scope !== 'XNetwork') {
					throw new Error('Constants: unexpected XNetwork id')
				}
				return xNetworkFieldValues
			},
		}),

		defineEntityResolver({
			entityType: EntityType.XmtpNetwork,
			resolve: async (entityId) => {
				if (entityId.scope !== 'XmtpNetwork') {
					throw new Error('Constants: unexpected XmtpNetwork id')
				}
				return xmtpNetworkFieldValues
			},
		}),

		defineEntityResolver({
			entityType: EntityType.YouTubeNetwork,
			resolve: async (entityId) => {
				if (entityId.scope !== 'YouTubeNetwork') {
					throw new Error('Constants: unexpected YouTubeNetwork id')
				}
				return youtubeNetworkFieldValues
			},
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
					return enrichNetworkUpgradeRowsActivationTimestamp(
						networkUpgrades
							.filter((upgradeRow): upgradeRow is Entity<typeof schema, EntityType.EthereumNetworkUpgrade> => upgradeRow != null)
							.map((upgradeRow) => ({
								...upgradeRow,
								...networkUpgradeDenormalizedFields(
									upgradeRow,
									networkExecutionUpgradeByChainIdAndUpgradeId,
									networkConsensusUpgradeByChainIdAndUpgradeId,
								),
								[EntityMetaKey.Id]: upgradeRow[EntityMetaKey.Id],
							})),
					)
				},
			}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$networkStack',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Network>) => {
				const row = (
					'networkSlug' in entityId ?
						networkBySlug[entityId.networkSlug]
					:	networkByCaip2[`${entityId.caip2.namespace}:${entityId.caip2.reference}`]
				)
				if (row == null) return undefined
				const namespace: NetworkNamespace = row.namespace
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
				const row = networkBySlug[entityId.networkSlug]
				if (row == null) return undefined
				const namespace: NetworkNamespace = row.namespace
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
				const row = networkBySlug[entityId.networkSlug]
				if (row == null) return undefined
				const namespace: NetworkNamespace = row.namespace
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
				const row = (
					'networkSlug' in entityId ?
						networkBySlug[entityId.networkSlug]
					:	networkByCaip2[`${entityId.caip2.namespace}:${entityId.caip2.reference}`]
				)
				if (row == null) return []
				const namespace: NetworkNamespace = row.namespace
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
				const row = networkBySlug[entityId.networkSlug]
				if (row == null) return []
				const namespace: NetworkNamespace = row.namespace
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
				const row = networkBySlug[entityId.networkSlug]
				if (row == null) return []
				const namespace: NetworkNamespace = row.namespace
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
				const row = (
					'networkSlug' in entityId ?
						networkBySlug[entityId.networkSlug]
					:	networkByCaip2[`${entityId.caip2.namespace}:${entityId.caip2.reference}`]
				)
				if (row == null) return []
				const namespace: NetworkNamespace = row.namespace
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
				const row = networkBySlug[entityId.networkSlug]
				if (row == null) return []
				const namespace: NetworkNamespace = row.namespace
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
				const row = networkBySlug[entityId.networkSlug]
				if (row == null) return []
				const namespace: NetworkNamespace = row.namespace
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
				const row = (
					'networkSlug' in entityId ?
						networkBySlug[entityId.networkSlug]
					:	networkByCaip2[`${entityId.caip2.namespace}:${entityId.caip2.reference}`]
				)
				if (row == null) return []
				const namespace: NetworkNamespace = row.namespace
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
				const row = (
					'networkSlug' in entityId ?
						networkBySlug[entityId.networkSlug]
					:	networkByCaip2[`${entityId.caip2.namespace}:${entityId.caip2.reference}`]
				)
				if (row == null) return []
				return networkResourceUrlEntityIds(
					row.slug,
					NetworkResourceKind.Faucet,
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$blockExplorerUrls',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Network>) => {
				const row = (
					'networkSlug' in entityId ?
						networkBySlug[entityId.networkSlug]
					:	networkByCaip2[`${entityId.caip2.namespace}:${entityId.caip2.reference}`]
				)
				if (row == null) return []
				return networkResourceUrlEntityIds(
					row.slug,
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
				:	Object.values(specificationRealmById).map((realmRow) => ({
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
				(catalogMarketsWithCoinAsQuoteByQuoteCoinId[entityId.coinId] ?? []).map((marketId) => ({
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
			fieldName: '$$baseCoin',
			resolve: async (entityId: EntityId<typeof schema, EntityType.Market>) => (
				entityId.$base.kind === MarketAssetKind.Coin ?
					{
						[EntityMetaKey.Id]: {
							coinId: entityId.$base.$coin.coinId,
						},
					}
				:	undefined
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
			fieldName: '$$parentMarket',
			resolve: async (entityId: EntityId<typeof schema, EntityType.MarketPrice>) => (
				{
					[EntityMetaKey.Id]: entityId.$market,
				}
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Market_TimeInterval_Timestamp,
			fieldName: '$$parentMarket',
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
						.filter((row) => row.chainId === chainId)
						.map((row) => ({
							[EntityMetaKey.Id]: {
								$network: entityId,
								host: row.host,
							},
							url: `https://${row.host}`,
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
					return enrichNetworkUpgradeRowsActivationTimestamp(
						networkUpgrades
							.filter((upgradeRow): upgradeRow is Entity<typeof schema, EntityType.EthereumNetworkUpgrade> => upgradeRow != null)
							.filter((upgradeRow) => (
								upgradeRow[EntityMetaKey.Id].$network.caip2.reference === entityId.caip2.reference
							))
							.map((upgradeRow) => ({
								...upgradeRow,
								...networkUpgradeDenormalizedFields(
									upgradeRow,
									networkExecutionUpgradeByChainIdAndUpgradeId,
									networkConsensusUpgradeByChainIdAndUpgradeId,
								),
								[EntityMetaKey.Id]: upgradeRow[EntityMetaKey.Id],
							})),
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$executionUpgrades',
			resolve: async (entityId) => {
				const { networkExecutionUpgrades } = await import('$/constants/EthereumNetworkUpgrades.ts')
				return enrichNetworkExecutionUpgradeRowsActivationTimestamp(
					networkExecutionUpgrades
						.filter((upgradeRow) => (
							upgradeRow[EntityMetaKey.Id].$network.caip2.reference === entityId.caip2.reference
						))
						.map((upgradeRow) => ({ ...upgradeRow })),
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EvmNetwork,
			fieldName: '$$consensusUpgrades',
			resolve: async (entityId) => {
				const { networkConsensusUpgrades } = await import('$/constants/EthereumNetworkUpgrades.ts')
				return enrichNetworkConsensusUpgradeRowsActivationTimestamp(
					networkConsensusUpgrades
						.filter((upgradeRow) => (
							upgradeRow[EntityMetaKey.Id].$network.caip2.reference === entityId.caip2.reference
						))
						.map((upgradeRow) => ({ ...upgradeRow })),
				)
			},
		}),

		defineEntityFieldResolver({
				entityType: EntityType.EthereumNetworkUpgrade,
				fieldName: '$networkExecutionUpgrade',
				resolve: async (entityId) => {
					const { networkUpgradeByChainIdAndUpgradeId } = await import('$/constants/EthereumNetworkUpgrades.ts')
					const upgradeRow = networkUpgradeByChainIdAndUpgradeId[`${entityId.$network.caip2.reference}:${entityId.upgradeId}`]
					if (upgradeRow?.$networkExecutionUpgrade == null) {
						throw new Error(`Constants_Internal: unknown NetworkUpgrade ${entityId.$network.caip2.reference}:${entityId.upgradeId}`)
					}
					return (
						{ ...upgradeRow.$networkExecutionUpgrade }
					)
				},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.EthereumNetworkUpgrade,
			fieldName: '$networkConsensusUpgrade',
			resolve: async (entityId) => {
				const { networkUpgradeByChainIdAndUpgradeId } = await import('$/constants/EthereumNetworkUpgrades.ts')
				const upgradeRow = networkUpgradeByChainIdAndUpgradeId[`${entityId.$network.caip2.reference}:${entityId.upgradeId}`]
				return (
					upgradeRow?.$networkConsensusUpgrade == null ?
						undefined
					:	{ ...upgradeRow.$networkConsensusUpgrade }
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
				const upgradeRow = networkUpgradeByChainIdAndUpgradeId[`${entityId.$network.caip2.reference}:${entityId.upgradeId}`]
				if (upgradeRow == null) {
					throw new Error(`Constants_Internal: unknown NetworkUpgrade ${entityId.$network.caip2.reference}:${entityId.upgradeId}`)
				}
				const denorm = networkUpgradeDenormalizedFields(
					upgradeRow,
					networkExecutionUpgradeByChainIdAndUpgradeId,
					networkConsensusUpgradeByChainIdAndUpgradeId,
				)
				const proposals = [...(denorm.$$proposals ?? [])]
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
				const upgradeRow = networkExecutionUpgradeByChainIdAndUpgradeId[`${entityId.$network.caip2.reference}:${entityId.upgradeId}`]
				const proposals = [...(upgradeRow?.$$proposals ?? [])]
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
				const upgradeRow = networkConsensusUpgradeByChainIdAndUpgradeId[`${entityId.$network.caip2.reference}:${entityId.upgradeId}`]
				const directProposals = [...(upgradeRow?.$$proposals ?? [])]
				if (directProposals.length > 0) {
					return directProposals
					}
					const umbrellaRow = networkUpgrades.find((networkUpgrade) => (
						networkUpgrade?.$networkConsensusUpgrade?.[EntityMetaKey.Id].$network.caip2.reference === entityId.$network.caip2.reference
						&& networkUpgrade?.$networkConsensusUpgrade?.[EntityMetaKey.Id].upgradeId === entityId.upgradeId
					))
				if (umbrellaRow != null) {
					const linkedProposals = [...(networkUpgradeDenormalizedFields(
						umbrellaRow,
						networkExecutionUpgradeByChainIdAndUpgradeId,
						networkConsensusUpgradeByChainIdAndUpgradeId,
					).$$proposals ?? [])]
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
						:	[{
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
				const row = networkBySlug[entityId.networkSlug]
				if (row == null) return []
				const namespace: NetworkNamespace = row.namespace
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
				const row = networkBySlug[entityId.networkSlug]
				if (row == null) return []
				const namespace: NetworkNamespace = row.namespace
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

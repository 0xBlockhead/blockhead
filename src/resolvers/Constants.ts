import type { ChainId } from '$/constants/ChainId.ts'
import { type } from 'arktype'
import {
	bridgeToolByKey,
	CoinInstanceRepresentation,
} from '$/constants/Bridge.ts'
import { CoinId } from '$/constants/Coin.ts'
import {
	currencies,
	currencyByIso4217,
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
import { MarketVenueId } from '$/constants/MarketVenue.ts'
import {
	proposalCategoryById,
	proposalKindAllowedInRealmByKey,
	proposalRealmById,
} from '$/constants/Proposal.ts'
import { activityPubNetworkFieldValues, activityPubNetworkSeedActors } from '$/constants/Social/ActivityPub.ts'
import { atprotoNetworkFieldValues, atprotoNetworkSeedActors } from '$/constants/Social/Atproto.ts'
import { lensNetworkFieldValues, lensNetworkSeedAccounts } from '$/constants/Social/Lens.ts'
import {
	nostrNetworkFieldValues,
	nostrNetworkSeedProfiles,
	nostrNetworkSeedRelays,
} from '$/constants/Social/Nostr.ts'
import { redditNetworkFieldValues, redditNetworkSeedSubreddits } from '$/constants/Social/Reddit.ts'
import { rssNetworkFieldValues, rssNetworkSeedFeeds } from '$/constants/Social/Rss.ts'
import { swarmProtocolFieldValues } from '$/constants/SwarmProtocol.ts'
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
import { CoinInstanceType } from '$/schema/CoinInstance.ts'
import type { EntityId } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { Source } from '$/sources/$Source.ts'
import type { Entity } from '$/schema/$schema.ts'
import { UrlString } from '$/schema/$Url.ts'
import { beaconRestBaseByExecutionChainId } from '$/constants/BeaconConsensus.ts'
import { singleFlight } from '$/lib/singleFlight.ts'
import {
	precompilesByChainId,
} from '$/constants/precompiles/index.ts'
import { standardPrecompiles } from '$/constants/precompiles/standard.ts'
import { hexLowerOfByteSize } from '$/lib/hexLowerOfByteSize.ts'
import { jsonRpcUrlWithTransportForChain } from '$/resolvers/Voltaire-JsonRpc.ts'

const networkUpgradeDenormalizedFields = (
	row: Entity<typeof schema, EntityType.NetworkUpgrade>,
	networkExecutionUpgradeByChainIdAndUpgradeId: Record<
		string,
		Entity<typeof schema, EntityType.NetworkExecutionUpgrade>
	>,
	networkConsensusUpgradeByChainIdAndUpgradeId: Record<
		string,
		Entity<typeof schema, EntityType.NetworkConsensusUpgrade>
	>,
): Partial<
	Pick<
		Entity<typeof schema, EntityType.NetworkUpgrade>,
		| 'activationBlock'
		| 'activationTimestamp'
		| 'activationEpoch'
		| '$$proposals'
	>
> => {
	const execRef = row.$networkExecutionUpgrade?.[EntityMetaKey.Id]
	const executionRow = (
		execRef == null ?
			null
		:	networkExecutionUpgradeByChainIdAndUpgradeId[
				`${execRef.$network.chainId}:${execRef.upgradeId}`
			]
	)
	const consRef = row.$networkConsensusUpgrade
	const consensusRow = (
		consRef == null ?
			null
		:	networkConsensusUpgradeByChainIdAndUpgradeId[
				`${consRef[EntityMetaKey.Id].$network.chainId}:${consRef[EntityMetaKey.Id].upgradeId}`
			]
	)

	const activationBlock = executionRow?.activationBlock ?? consensusRow?.activationBlock
	const activationTimestamps = [
		executionRow?.activationTimestamp,
		consensusRow?.activationTimestamp,
	].filter((timestamp): timestamp is number => timestamp != null)
	const activationTimestamp = (
		activationTimestamps.length > 0 ?
			Math.max(...activationTimestamps)
		:	undefined
	)
	const activationEpoch = consensusRow?.activationEpoch ?? executionRow?.activationEpoch

	const executionProposals = executionRow?.$$proposals
	const consensusProposals = consensusRow?.$$proposals
	const linkedProposals = (
		executionProposals != null && executionProposals.length > 0 ?
			[...executionProposals]
		: consensusProposals != null && consensusProposals.length > 0 ?
			[...consensusProposals]
		:	(() => {
				const seen = new Set<string>()
				const out: Entity<typeof schema, EntityType.Proposal>[] = []
				for (const proposal of [
					...(executionProposals ?? []),
					...(consensusProposals ?? []),
				]) {
					const key = stringify(proposal[EntityMetaKey.Id])
					if (seen.has(key)) continue
					seen.add(key)
					out.push(proposal)
				}
				return out
			})()
	)

	return {
		...(activationBlock != null && { activationBlock }),
		...(activationTimestamp != null && { activationTimestamp }),
		...(activationEpoch != null && { activationEpoch }),
		...(linkedProposals.length > 0 && { $$proposals: linkedProposals }),
	}
}

const canonicalPublicHttpUrlFromCatalogString = (raw: string): string => {
	const trimmed = raw.trim()
	const absolute = (
		trimmed.startsWith('http://')
		|| trimmed.startsWith('https://') ?
			trimmed
		: trimmed.startsWith('//') ?
			`https:${trimmed}`
		:	`https://${trimmed}`
	)
	return new URL(absolute).toString()
}

const urlEntitiesFromFaucetUrlStrings = (
	faucetUrls: string[],
): Entity<typeof schema, EntityType.Url>[] =>
	faucetUrls.flatMap((raw) => {
		const trimmed = raw.trim()
		if (trimmed === '') return []
		const url = canonicalPublicHttpUrlFromCatalogString(trimmed)
		const hrefAsUrlString = UrlString(url)
		if (hrefAsUrlString instanceof type.errors) return []
		return [{ [EntityMetaKey.Id]: { url: hrefAsUrlString } } as Entity<typeof schema, EntityType.Url>]
	})

const BEACON_SLOTS_PER_EPOCH = 32
const BEACON_SECONDS_PER_SLOT = 12

const executionBlockActivationTimestampSecondsByKey = new Map<string, number | undefined>()

const activationTimestampSecondsForSort = (
	activationTimestamp: number,
): number => (
	activationTimestamp < 1e12 ?
		activationTimestamp
	:
		Math.floor(activationTimestamp / 1000)
)

const consensusEpochActivationTimestampSeconds = async (
	chainId: number,
	activationEpoch: number,
): Promise<number | undefined> => {
	const beaconRestBaseUrl = beaconRestBaseByExecutionChainId[chainId]?.restBaseUrl
	if (beaconRestBaseUrl == null) {
		return undefined
	}
	const { getBeaconGenesisTimeSeconds } = await import('$/sources/Beacon/Rest/queries.ts')
	const genesisTimeSeconds = await singleFlight(getBeaconGenesisTimeSeconds)(beaconRestBaseUrl)
	if (genesisTimeSeconds == null) {
		return undefined
	}
	return (
		genesisTimeSeconds + activationEpoch * BEACON_SLOTS_PER_EPOCH * BEACON_SECONDS_PER_SLOT
	)
}

const executionBlockActivationTimestampSeconds = async (
	chainId: number,
	activationBlock: number,
): Promise<number | undefined> => {
	const cacheKey = `${chainId}:${activationBlock}`
	if (executionBlockActivationTimestampSecondsByKey.has(cacheKey)) {
		return executionBlockActivationTimestampSecondsByKey.get(cacheKey)
	}
	const jsonRpcTransport = await jsonRpcUrlWithTransportForChain(chainId)
	if (jsonRpcTransport == null) {
		executionBlockActivationTimestampSecondsByKey.set(cacheKey, undefined)
		return undefined
	}
	const { getBlockByNumber } = await import('$/sources/Voltaire/JsonRpc/queries.ts')
	const { getHttpProvider } = await import('$/lib/voltaire.ts')
	const block = await getBlockByNumber({
		provider: getHttpProvider(jsonRpcTransport.rpcUrl),
		blockNumber: BigInt(activationBlock),
	})
	const activationTimestampSeconds = (
		block?.timestamp == null ?
			undefined
		:	activationTimestampSecondsForSort(Number(block.timestamp))
	)
	executionBlockActivationTimestampSecondsByKey.set(cacheKey, activationTimestampSeconds)
	return activationTimestampSeconds
}

const enrichNetworkExecutionUpgradeActivationTimestamp = async (
	row: Entity<typeof schema, EntityType.NetworkExecutionUpgrade>,
): Promise<Entity<typeof schema, EntityType.NetworkExecutionUpgrade>> => {
	if (row.activationTimestamp != null) {
		return row
	}
	if (row.activationBlock != null) {
		const activationTimestamp = await executionBlockActivationTimestampSeconds(
			row[EntityMetaKey.Id].$network.chainId,
			row.activationBlock,
		)
		return (
			activationTimestamp == null ?
				row
			:	{
					...row,
					activationTimestamp,
				}
		)
	}
	if (row.activationEpoch != null) {
		const activationTimestamp = await consensusEpochActivationTimestampSeconds(
			row[EntityMetaKey.Id].$network.chainId,
			row.activationEpoch,
		)
		return (
			activationTimestamp == null ?
				row
			:	{
					...row,
					activationTimestamp,
				}
		)
	}
	return row
}

const enrichNetworkConsensusUpgradeActivationTimestamp = async (
	row: Entity<typeof schema, EntityType.NetworkConsensusUpgrade>,
): Promise<Entity<typeof schema, EntityType.NetworkConsensusUpgrade>> => {
	if (row.activationTimestamp != null) {
		return row
	}
	if (row.activationEpoch != null) {
		const activationTimestamp = await consensusEpochActivationTimestampSeconds(
			row[EntityMetaKey.Id].$network.chainId,
			row.activationEpoch,
		)
		return (
			activationTimestamp == null ?
				row
			:	{
					...row,
					activationTimestamp,
				}
		)
	}
	if (row.activationBlock != null) {
		const activationTimestamp = await executionBlockActivationTimestampSeconds(
			row[EntityMetaKey.Id].$network.chainId,
			row.activationBlock,
		)
		return (
			activationTimestamp == null ?
				row
			:	{
					...row,
					activationTimestamp,
				}
		)
	}
	return row
}

const enrichNetworkUpgradeActivationTimestamp = async (
	row: Entity<typeof schema, EntityType.NetworkUpgrade>,
): Promise<Entity<typeof schema, EntityType.NetworkUpgrade>> => {
	const {
		networkExecutionUpgradeByChainIdAndUpgradeId,
		networkConsensusUpgradeByChainIdAndUpgradeId,
	} = await import('$/constants/NetworkUpgrades.ts')
	const executionRow = networkExecutionUpgradeByChainIdAndUpgradeId[
		`${row.$networkExecutionUpgrade[EntityMetaKey.Id].$network.chainId}:${row.$networkExecutionUpgrade[EntityMetaKey.Id].upgradeId}`
	]
	const consensusRow = (
		row.$networkConsensusUpgrade == null ?
			null
		:	networkConsensusUpgradeByChainIdAndUpgradeId[
			`${row.$networkConsensusUpgrade[EntityMetaKey.Id].$network.chainId}:${row.$networkConsensusUpgrade[EntityMetaKey.Id].upgradeId}`
		]
	)
	const executionTimestamp = (
		executionRow == null ?
			undefined
		:	(await enrichNetworkExecutionUpgradeActivationTimestamp(executionRow)).activationTimestamp
	)
	const consensusTimestamp = (
		consensusRow == null ?
			undefined
		:	(await enrichNetworkConsensusUpgradeActivationTimestamp(consensusRow)).activationTimestamp
	)
	const activationTimestamp = (
		[
			row.activationTimestamp,
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
		activationTimestamp > -Infinity ?
			{
				...row,
				activationTimestamp,
			}
		:
			row
	)
}

const enrichNetworkUpgradeRowsActivationTimestamp = async <
	Row extends Entity<typeof schema, EntityType.NetworkUpgrade>,
>(
	rows: Row[],
): Promise<Row[]> => (
	Promise.all(
		rows.map((row) => enrichNetworkUpgradeActivationTimestamp(row)),
	)
)

const enrichNetworkExecutionUpgradeRowsActivationTimestamp = async <
	Row extends Entity<typeof schema, EntityType.NetworkExecutionUpgrade>,
>(
	rows: Row[],
): Promise<Row[]> => (
	Promise.all(
		rows.map((row) => enrichNetworkExecutionUpgradeActivationTimestamp(row)),
	)
)

const enrichNetworkConsensusUpgradeRowsActivationTimestamp = async <
	Row extends Entity<typeof schema, EntityType.NetworkConsensusUpgrade>,
>(
	rows: Row[],
): Promise<Row[]> => (
	Promise.all(
		rows.map((row) => enrichNetworkConsensusUpgradeActivationTimestamp(row)),
	)
)

export default {
	source: Source.Constants_Internal,

	entityResolvers: [
		defineEntityResolver({
			entityType: EntityType.NetworkUpgrade,
			resolve: async (entityId) => {
				const {
					networkUpgradeByChainIdAndUpgradeId,
					networkExecutionUpgradeByChainIdAndUpgradeId,
					networkConsensusUpgradeByChainIdAndUpgradeId,
				} = await import(
					'$/constants/NetworkUpgrades.ts'
				)
				const upgradeDefinition = networkUpgradeByChainIdAndUpgradeId[
					`${entityId.$network.chainId}:${entityId.upgradeId}`
				]
				if (upgradeDefinition == null) {
					throw new Error(`Constants_Internal: NetworkUpgrade not found for ${entityId.$network.chainId}:${entityId.upgradeId}`)
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
			entityType: EntityType.NetworkExecutionUpgrade,
			resolve: async (entityId) => {
				const { networkExecutionUpgradeByChainIdAndUpgradeId } = await import(
					'$/constants/NetworkUpgrades.ts'
				)
				const upgradeDefinition = networkExecutionUpgradeByChainIdAndUpgradeId[
					`${entityId.$network.chainId}:${entityId.upgradeId}`
				]
				if (upgradeDefinition == null) {
					throw new Error(`Constants_Internal: NetworkExecutionUpgrade not found for ${entityId.$network.chainId}:${entityId.upgradeId}`)
				}
				return enrichNetworkExecutionUpgradeActivationTimestamp({ ...upgradeDefinition })
			},
		}),

		defineEntityResolver({
			entityType: EntityType.NetworkConsensusUpgrade,
			resolve: async (entityId) => {
				const { networkConsensusUpgradeByChainIdAndUpgradeId } = await import(
					'$/constants/NetworkUpgrades.ts'
				)
				const upgradeDefinition = networkConsensusUpgradeByChainIdAndUpgradeId[
					`${entityId.$network.chainId}:${entityId.upgradeId}`
				]
				if (upgradeDefinition == null) {
					throw new Error(`Constants_Internal: NetworkConsensusUpgrade not found for ${entityId.$network.chainId}:${entityId.upgradeId}`)
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
					precompilesByChainId[entityId.$network.chainId]
					?? standardPrecompiles
				)
				const precompileName = chainPrecompiles.find((precompile) => (
					precompile.address.toLowerCase() === address.toLowerCase()
				))?.name
				if (precompileName == null) {
					throw new Error(`Constants_Internal: EvmContract ${address} is not a catalog precompile on chain ${String(entityId.$network.chainId)}`)
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
			entityType: EntityType.CoinInstance,
			resolve: async (entityId) => {
				if (
					entityId.type !== CoinInstanceType.NativeCurrency
					|| entityId.$network.chainId !== 1
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
			entityType: EntityType.Network,
			resolve: async (entityId) => {
				const { executionEndpointsByChainId } = await import('$/constants/ExecutionEndpoints.ts')
				const list = executionEndpointsByChainId[entityId.chainId as ChainId] ?? []
				return {
					executionEndpoints: [...list],
					$$rpcUrls: urlEntitiesFromFaucetUrlStrings(list.map((endpoint) => endpoint.url)),
				}
			},
		}),

		defineEntityResolver({
			entityType: EntityType.ProposalRealm,
			resolve: async (entityId) => (
				{
					...proposalRealmById[entityId.realm],
				}
			),
		}),

		defineEntityResolver({
			entityType: EntityType.ProposalKind,
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
			fieldName: '$$networkUpgrades',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => {
				const {
					networkUpgrades,
					networkExecutionUpgradeByChainIdAndUpgradeId,
					networkConsensusUpgradeByChainIdAndUpgradeId,
				} = await import('$/constants/NetworkUpgrades.ts')
				return enrichNetworkUpgradeRowsActivationTimestamp(
					networkUpgrades.map((upgradeRow) => ({
						...upgradeRow,
						...networkUpgradeDenormalizedFields(
							upgradeRow,
							networkExecutionUpgradeByChainIdAndUpgradeId,
							networkConsensusUpgradeByChainIdAndUpgradeId,
						),
					})),
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType._Global,
			fieldName: '$$proposalRealms',
			resolve: async (_globalScopeEntityId: EntityId<typeof schema, EntityType._Global>) => (
				proposalRealmById == null ?
					[]
				:	Object.values(proposalRealmById).map((realmRow) => ({
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
			entityType: EntityType.ProposalRealm,
			fieldName: '$$proposalKinds',
			resolve: async (entityId: EntityId<typeof schema, EntityType.ProposalRealm>) => (
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
			entityType: EntityType.ProposalKind,
			fieldName: '$proposalRealm',
			resolve: async (entityId: EntityId<typeof schema, EntityType.ProposalKind>) => (
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
				return marketVenues.map((marketVenue) => (
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
				currencies.map((currency) => (
					{
						[EntityMetaKey.Id]: {
							iso4217: currency.iso4217,
						},
					}
				))
			),
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
			resolve: async (entityId: EntityId<typeof schema, EntityType.Coin>) => (
				entityId.coinId === CoinId.ETH ?
					[
						{
							[EntityMetaKey.Id]: {
								$network: { chainId: 1 },
								type: CoinInstanceType.NativeCurrency,
							},
							representation: CoinInstanceRepresentation.IssuerNative,
						},
					]
				:	[]
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.CoinInstance,
			fieldName: '$$outboundBridgeCapabilities',
			resolve: async () => {
				throw new Error('Constants_Internal: $$outboundBridgeCapabilities is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.CoinInstance,
			fieldName: '$$inboundBridgeCapabilities',
			resolve: async () => {
				throw new Error('Constants_Internal: $$inboundBridgeCapabilities is not implemented')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.CoinInstance,
			fieldName: '$canonicalInstance',
			resolve: async () => {
				throw new Error('Constants_Internal: $canonicalInstance is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.CoinInstance,
			fieldName: 'representation',
			resolve: async (entityId) => {
				if (
					entityId.type === CoinInstanceType.NativeCurrency
					&& entityId.$network.chainId === 1
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
			entityType: EntityType.CoinInstance,
			fieldName: '$$marketsWithInstanceAsBase',
			resolve: async () => {
				throw new Error('Constants_Internal: $$marketsWithInstanceAsBase is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.CoinInstance,
			fieldName: '$$marketsWithInstanceAsQuote',
			resolve: async () => {
				throw new Error('Constants_Internal: $$marketsWithInstanceAsQuote is unsupported')
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: 'hasBlobParameterExecutionUpgrade',
			resolve: async (entityId) => {
				const { networkExecutionUpgrades } = await import('$/constants/NetworkUpgrades.ts')
				return (
					networkExecutionUpgrades.some((executionUpgrade) => (
						executionUpgrade[EntityMetaKey.Id].$network.chainId === entityId.chainId
						&& executionUpgrade.layer === NetworkExecutionUpgradeLayer.Blob
					))
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: 'consensusProtocol',
			resolve: async (entityId) => {
				const { beaconRestBaseByExecutionChainId } = await import('$/constants/BeaconConsensus.ts')
				return beaconRestBaseByExecutionChainId[entityId.chainId]?.consensusProtocol
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$upgrades',
			resolve: async (entityId) => {
				const {
					networkUpgrades,
					networkExecutionUpgradeByChainIdAndUpgradeId,
					networkConsensusUpgradeByChainIdAndUpgradeId,
				} = await import('$/constants/NetworkUpgrades.ts')
				return enrichNetworkUpgradeRowsActivationTimestamp(
					networkUpgrades
						.filter((upgradeRow) => (
							upgradeRow[EntityMetaKey.Id].$network.chainId === entityId.chainId
						))
						.map((upgradeRow) => ({
							...upgradeRow,
							...networkUpgradeDenormalizedFields(
								upgradeRow,
								networkExecutionUpgradeByChainIdAndUpgradeId,
								networkConsensusUpgradeByChainIdAndUpgradeId,
							),
						})),
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$executionUpgrades',
			resolve: async (entityId) => {
				const { networkExecutionUpgrades } = await import('$/constants/NetworkUpgrades.ts')
				return enrichNetworkExecutionUpgradeRowsActivationTimestamp(
					networkExecutionUpgrades
						.filter((upgradeRow) => (
							upgradeRow[EntityMetaKey.Id].$network.chainId === entityId.chainId
						))
						.map((upgradeRow) => ({ ...upgradeRow })),
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$consensusUpgrades',
			resolve: async (entityId) => {
				const { networkConsensusUpgrades } = await import('$/constants/NetworkUpgrades.ts')
				return enrichNetworkConsensusUpgradeRowsActivationTimestamp(
					networkConsensusUpgrades
						.filter((upgradeRow) => (
							upgradeRow[EntityMetaKey.Id].$network.chainId === entityId.chainId
						))
						.map((upgradeRow) => ({ ...upgradeRow })),
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NetworkUpgrade,
			fieldName: '$networkExecutionUpgrade',
			resolve: async (entityId) => {
				const { networkUpgradeByChainIdAndUpgradeId } = await import('$/constants/NetworkUpgrades.ts')
				const upgradeRow = networkUpgradeByChainIdAndUpgradeId[`${entityId.$network.chainId}:${entityId.upgradeId}`]
				if (upgradeRow == null) {
					return undefined
				}
				return (
					{ ...upgradeRow.$networkExecutionUpgrade }
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NetworkUpgrade,
			fieldName: '$networkConsensusUpgrade',
			resolve: async (entityId) => {
				const { networkUpgradeByChainIdAndUpgradeId } = await import('$/constants/NetworkUpgrades.ts')
				const upgradeRow = networkUpgradeByChainIdAndUpgradeId[`${entityId.$network.chainId}:${entityId.upgradeId}`]
				return (
					upgradeRow?.$networkConsensusUpgrade == null ?
						undefined
					:	{ ...upgradeRow.$networkConsensusUpgrade }
				)
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NetworkUpgrade,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const {
					networkUpgradeByChainIdAndUpgradeId,
					networkExecutionUpgradeByChainIdAndUpgradeId,
					networkConsensusUpgradeByChainIdAndUpgradeId,
				} = await import('$/constants/NetworkUpgrades.ts')
				const upgradeRow = networkUpgradeByChainIdAndUpgradeId[`${entityId.$network.chainId}:${entityId.upgradeId}`]
				if (upgradeRow == null) {
					throw new Error(`Constants_Internal: unknown NetworkUpgrade ${entityId.$network.chainId}:${entityId.upgradeId}`)
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
			entityType: EntityType.NetworkExecutionUpgrade,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const { networkExecutionUpgradeByChainIdAndUpgradeId } = await import('$/constants/NetworkUpgrades.ts')
				const upgradeRow = networkExecutionUpgradeByChainIdAndUpgradeId[`${entityId.$network.chainId}:${entityId.upgradeId}`]
				const proposals = [...(upgradeRow?.$$proposals ?? [])]
				if (proposals.length === 0) {
					throw new Error(`Constants_Internal: NetworkExecutionUpgrade ${entityId.upgradeId} has no $$proposals`)
				}
				return proposals
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.NetworkConsensusUpgrade,
			fieldName: '$$proposals',
			resolve: async (entityId) => {
				const {
					networkConsensusUpgradeByChainIdAndUpgradeId,
					networkExecutionUpgradeByChainIdAndUpgradeId,
					networkUpgrades,
				} = await import('$/constants/NetworkUpgrades.ts')
				const upgradeRow = networkConsensusUpgradeByChainIdAndUpgradeId[`${entityId.$network.chainId}:${entityId.upgradeId}`]
				const directProposals = [...(upgradeRow?.$$proposals ?? [])]
				if (directProposals.length > 0) {
					return directProposals
				}
				const umbrellaRow = networkUpgrades.find((networkUpgrade) => (
					networkUpgrade.$networkConsensusUpgrade?.[EntityMetaKey.Id].$network.chainId === entityId.$network.chainId
					&& networkUpgrade.$networkConsensusUpgrade?.[EntityMetaKey.Id].upgradeId === entityId.upgradeId
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
				youtubeNetworkSeedChannels.map((channel) => ({
					[EntityMetaKey.Id]: channel,
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeNetwork,
			fieldName: '$$youtubeVideos',
			resolve: async () => (
				youtubeNetworkSeedVideos.map((video) => ({
					[EntityMetaKey.Id]: video,
				}))
			),
		}),

		defineEntityFieldResolver({
			entityType: EntityType.YouTubeNetwork,
			fieldName: '$$youtubePlaylists',
			resolve: async () => (
				youtubeNetworkSeedPlaylists.map((playlist) => ({
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
					precompilesByChainId[entityId.$network.chainId]
					?? standardPrecompiles
				)
				return chainPrecompiles.find((precompile) => (
					precompile.address.toLowerCase() === address.toLowerCase()
				))?.name
			},
		}),

		defineEntityFieldResolver({
			entityType: EntityType.Network,
			fieldName: '$$contracts',
			resolve: async (entityId, context) => {
				const limit = resolverLoadSubsetRowLimit(context)
				return (
					precompilesByChainId[entityId.chainId]
					?? standardPrecompiles
				)
					.slice(0, limit)
					.flatMap((precompile) => {
						const address = hexLowerOfByteSize(precompile.address, 20)
						return address == null ?
							[]
						:	[{
							[EntityMetaKey.Id]: {
								$network: { chainId: entityId.chainId },
								address,
							},
						}]
					})
			},
		}),
	],
}

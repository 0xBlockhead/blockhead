import { networks } from '$/constants/Network.ts'
import { zeroExLowerCase } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'


type NetworkId = EntitySelector<typeof schema, EntityType.Network>


const chainIdFromNetwork = (
	network: NetworkId
) => {
	const caip2 = (
		'caip2' in network ?
			network.caip2
		:
			((networkRow) => (
				networkRow != null && 'caip2' in networkRow ?
					networkRow.caip2
				:
					undefined
			))(networks.find(({ slug }) => slug === network.slug))
	)
	if (caip2?.namespace !== 'eip155')
		throw new Error('ChainlinkDataFeeds_Contracts: network selector does not identify an EIP-155 network')

	const chainId = Number(caip2.reference)
	if (!Number.isSafeInteger(chainId) || chainId < 0)
		throw new Error(`ChainlinkDataFeeds_Contracts: invalid EIP-155 chain id ${caip2.reference}`)

	return chainId
}


const networkCaip2 = (
	chainId: number
) => (
	`eip155:${chainId}` as const
)


const networkRef = (
	chainId: number
) => ({
	[EntityMetaKey.Selector]: {
		caip2: {
			namespace: 'eip155' as const,
			reference: String(chainId),
		},
	},
})


const oracleFeedRef = (
	chainId: number,
	address: `0x${string}`
) => ({
	[EntityMetaKey.Selector]: {
		$network: {
			caip2: {
				namespace: 'eip155' as const,
				reference: String(chainId),
			},
		},
		address,
	},
})


const secondsToMs = (
	seconds: string,
	label: string
) => {
	const value = BigInt(seconds)
	if (value < 0n || value > BigInt(Number.MAX_SAFE_INTEGER))
		throw new Error(`ChainlinkDataFeeds_Contracts: ${label} exceeds safe integer range`)

	const ms = Number(value) * 1000
	if (!Number.isSafeInteger(ms))
		throw new Error(`ChainlinkDataFeeds_Contracts: ${label} ms exceeds safe integer range`)

	return ms
}


const readLatestViaVoltaire = async ({
	chainId,
	feedAddress,
	baseAsset,
	quoteAsset,
}: {
	chainId: number
	feedAddress: `0x${string}`
	baseAsset: string
	quoteAsset: string
}) => {
	const {
		readLatestRound,
	} = await import('$/sources/ChainlinkDataFeeds/Contracts/queries.ts')
	const {
		voltaireJsonRpcTransports,
	} = await import('$/sources/Voltaire/JsonRpc/queries.ts')

	const transports = voltaireJsonRpcTransports.httpTransportsByChainId[chainId] ?? []
	if (transports.length === 0)
		throw new Error(`ChainlinkDataFeeds_Contracts: no Voltaire HTTP execution transport for chain ${chainId}`)

	const errors: string[] = []
	for (const transport of transports) {
		try {
			return await readLatestRound({
				network: networkCaip2(chainId),
				feedAddress,
				baseAsset,
				quoteAsset,
				getBlockNumber: () => transport.getBlockNumber(),
				getCall: transport.getCall,
			})
		} catch (error) {
			errors.push(`${transport.diagnosticLabel}: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	throw new Error(`ChainlinkDataFeeds_Contracts: all execution endpoints failed for ${feedAddress} on chain ${chainId}${errors.length > 0 ? `: ${errors.join('; ')}` : ''}`)
}


const readRoundViaVoltaire = async ({
	chainId,
	feedAddress,
	roundId,
}: {
	chainId: number
	feedAddress: `0x${string}`
	roundId: bigint
}) => {
	const {
		readRound,
	} = await import('$/sources/ChainlinkDataFeeds/Contracts/queries.ts')
	const {
		voltaireJsonRpcTransports,
	} = await import('$/sources/Voltaire/JsonRpc/queries.ts')

	const transports = voltaireJsonRpcTransports.httpTransportsByChainId[chainId] ?? []
	if (transports.length === 0)
		throw new Error(`ChainlinkDataFeeds_Contracts: no Voltaire HTTP execution transport for chain ${chainId}`)

	const errors: string[] = []
	for (const transport of transports) {
		try {
			return await readRound({
				network: networkCaip2(chainId),
				feedAddress,
				roundId,
				getBlockNumber: () => transport.getBlockNumber(),
				getCall: transport.getCall,
			})
		} catch (error) {
			errors.push(`${transport.diagnosticLabel}: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	throw new Error(`ChainlinkDataFeeds_Contracts: all execution endpoints failed for ${feedAddress} round ${String(roundId)} on chain ${chainId}${errors.length > 0 ? `: ${errors.join('; ')}` : ''}`)
}


const catalogFeedOrThrow = async ({
	chainId,
	address,
}: {
	chainId: number
	address: string
}) => {
	const {
		getPriceFeed,
	} = await import('$/sources/ChainlinkDataFeeds/AddressCatalog/queries.ts')

	return getPriceFeed({
		chainId,
		proxyAddress: address,
	})
}


export default {
	source: Source.ChainlinkDataFeeds_Contracts,

	resolvers: [
		defineResolver({
			entityType: EntityType.OracleFeed,
			resolve: {
				EvmNetworkAddress: {
					resolve: async ({
						$network,
						address,
					}) => {
						const chainId = chainIdFromNetwork($network)
						const feedAddress = zeroExLowerCase(address)
						const catalog = await catalogFeedOrThrow({
							chainId,
							address: feedAddress,
						})
						const latest = await readLatestViaVoltaire({
							chainId,
							feedAddress,
							baseAsset: catalog.baseAsset,
							quoteAsset: catalog.quoteAsset,
						})
						const updatedAtMs = secondsToMs(latest.updatedAtSeconds, 'updatedAt')
						const $oracleFeed = oracleFeedRef(chainId, feedAddress)

						return {
							$network: networkRef(chainId),
							address: feedAddress,
							label: catalog.label,
							feedKind: catalog.feedKind,
							$$rounds: [{
								[EntityMetaKey.Selector]: {
									$oracleFeed,
									roundId: BigInt(latest.roundId),
								},
							}],
							$$timestamps: [{
								[EntityMetaKey.Selector]: {
									$oracleFeed,
									timestampMs: updatedAtMs,
									source: Source.ChainlinkDataFeeds_Contracts,
								},
							}],
						}
					},
				},
			},
		})({
			$network: (entity) => entity.$network,
			address: (entity) => entity.address,
			label: (entity) => entity.label,
			feedKind: (entity) => entity.feedKind,
			$$rounds: (entity) => entity.$$rounds,
			$$timestamps: (entity) => entity.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.OracleFeed_Round,
			resolve: {
				OracleFeedRoundId: {
					resolve: async ({
						$oracleFeed,
						roundId,
					}) => {
						if (!('address' in $oracleFeed) || !('$network' in $oracleFeed))
							throw new Error('ChainlinkDataFeeds_Contracts: OracleFeedRoundId requires EvmNetworkAddress feed selector')

						const chainId = chainIdFromNetwork($oracleFeed.$network)
						const feedAddress = zeroExLowerCase($oracleFeed.address)
						await catalogFeedOrThrow({
							chainId,
							address: feedAddress,
						})
						const round = await readRoundViaVoltaire({
							chainId,
							feedAddress,
							roundId,
						})
						const $feed = oracleFeedRef(chainId, feedAddress)

						return {
							$oracleFeed: $feed,
							$parentOracleFeed: $feed,
							roundId: BigInt(round.roundId),
							answer: BigInt(round.answer),
							startedAtMs: secondsToMs(round.startedAtSeconds, 'startedAt'),
							updatedAtMs: secondsToMs(round.updatedAtSeconds, 'updatedAt'),
							answeredInRound: BigInt(round.answeredInRound),
							$network: networkRef(chainId),
							blockNumber: BigInt(round.blockNumber),
						}
					},
				},
			},
		})({
			$oracleFeed: (entity) => entity.$oracleFeed,
			$parentOracleFeed: (entity) => entity.$parentOracleFeed,
			roundId: (entity) => entity.roundId,
			answer: (entity) => entity.answer,
			startedAtMs: (entity) => entity.startedAtMs,
			updatedAtMs: (entity) => entity.updatedAtMs,
			answeredInRound: (entity) => entity.answeredInRound,
			$network: (entity) => entity.$network,
			blockNumber: (entity) => entity.blockNumber,
		}),

		defineResolver({
			entityType: EntityType.OracleFeed_Timestamp,
			resolve: {
				OracleFeedTimestampMsSource: {
					resolve: async ({
						$oracleFeed,
						timestampMs,
						source,
					}) => {
						if (source !== Source.ChainlinkDataFeeds_Contracts)
							throw new Error(`ChainlinkDataFeeds_Contracts: unsupported observation source ${source}`)
						if (!('address' in $oracleFeed) || !('$network' in $oracleFeed))
							throw new Error('ChainlinkDataFeeds_Contracts: OracleFeedTimestampMsSource requires EvmNetworkAddress feed selector')

						const chainId = chainIdFromNetwork($oracleFeed.$network)
						const feedAddress = zeroExLowerCase($oracleFeed.address)
						const catalog = await catalogFeedOrThrow({
							chainId,
							address: feedAddress,
						})
						const latest = await readLatestViaVoltaire({
							chainId,
							feedAddress,
							baseAsset: catalog.baseAsset,
							quoteAsset: catalog.quoteAsset,
						})
						const latestUpdatedAtMs = secondsToMs(latest.updatedAtSeconds, 'updatedAt')
						if (timestampMs !== latestUpdatedAtMs)
							throw new Error('ChainlinkDataFeeds_Contracts: observation timestamp is not the latest round update')

						return {
							$oracleFeed: oracleFeedRef(chainId, feedAddress),
							timestampMs: latestUpdatedAtMs,
							source: Source.ChainlinkDataFeeds_Contracts,
							decimals: latest.decimals,
							description: latest.description,
							aggregatorAddress: latest.aggregatorAddress,
							latestRoundId: BigInt(latest.roundId),
							latestUpdatedAtMs,
						}
					},
				},
			},
		})({
			$oracleFeed: (entity) => entity.$oracleFeed,
			timestampMs: (entity) => entity.timestampMs,
			source: (entity) => entity.source,
			decimals: (entity) => entity.decimals,
			description: (entity) => entity.description,
			aggregatorAddress: (entity) => entity.aggregatorAddress,
			latestRoundId: (entity) => entity.latestRoundId,
			latestUpdatedAtMs: (entity) => entity.latestUpdatedAtMs,
		}),
	],
} satisfies RegisteredSourceResolverModule

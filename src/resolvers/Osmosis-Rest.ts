import { NetworkExecutionModel, NetworkLedgerModel } from '$/constants/Network.ts'
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
import bindings from '$/sources/Osmosis/bindings.ts'
import { osmosisLcdRestEndpoints } from '$/sources/Osmosis/Rest/queries.ts'
import { Source } from '$/sources/Source.ts'

type NetworkId = EntitySelector<typeof schema, EntityType.Network>

const osmosisBinding = bindings[Source.Osmosis_LCD_Rest][0]
const osmosisLcdCaip2NetworkKey = osmosisBinding.target.key

const osmosisCaip2 = {
	namespace: 'cosmos',
	reference: 'osmosis-1',
} as const

const osmosisNetworkApplicability = [
	{
		caip2: osmosisCaip2,
	},
] as const

const osmosisNetworkReferenceApplicability = [
	{
		$network: osmosisNetworkApplicability[0],
	},
] as const

const osmosisNetworkTimestampApplicability = [
	{
		...osmosisNetworkReferenceApplicability[0],
		source: Source.Osmosis_LCD_Rest,
	},
] as const

const assertOsmosisNetwork = (network: NetworkId) => {
	if (
		'caip2' in network
		&& network.caip2.namespace === osmosisCaip2.namespace
		&& network.caip2.reference === osmosisCaip2.reference
	)
		return

	if (
		'caip2' in network
		&& `${network.caip2.namespace}:${network.caip2.reference}` === osmosisLcdCaip2NetworkKey
	)
		return

	throw new Error(`${Source.Osmosis_LCD_Rest}: unsupported network`)
}

const channelPartsFromPath = (path: string) => {
	const segments = path.split('/')
	if (segments.length < 2 || segments.length % 2 !== 0)
		return undefined

	return {
		sourcePort: segments[segments.length - 2],
		sourceChannel: segments[segments.length - 1],
	}
}

export default {
	source: Source.Osmosis_LCD_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.Network,
			resolve: {
				Caip2: {
					appliesTo: osmosisNetworkApplicability,
					resolve: async (network) => {
						assertOsmosisNetwork(network)
						return osmosisLcdRestEndpoints
					},
				},
			},
		})({
			Cosmos: {
				restEndpoints: (restEndpoints) => restEndpoints,
			},
		}),

		defineResolver({
			entityType: EntityType.Network_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					appliesTo: osmosisNetworkTimestampApplicability,
					resolve: async ({
						$network,
						timestampMs,
						source,
					}) => {
						assertOsmosisNetwork($network)
						const {
							getLatestBlock,
							getNodeInfo,
						} = await import('$/sources/Osmosis/Rest/queries.ts')
						const [
							nodeInfo,
							latestBlock,
						] = await Promise.all([
							getNodeInfo(),
							getLatestBlock(),
						])
						if (nodeInfo.default_node_info.network !== osmosisCaip2.reference)
							throw new Error(`${Source.Osmosis_LCD_Rest}: LCD network mismatch`)

						return {
							$network: {
								[EntityMetaKey.Selector]: $network,
							},
							timestampMs,
							source,
							ledgerModels: [
								NetworkLedgerModel.Account,
							],
							executionModels: [
								NetworkExecutionModel.CosmosSdk,
							],
							latestBlockHeight: BigInt(latestBlock.block.header.height),
							latestBlockHash: latestBlock.block_id.hash,
							latestBlockTimeMs: Date.parse(latestBlock.block.header.time),
							chainId: nodeInfo.default_node_info.network,
							nodeNetwork: nodeInfo.default_node_info.network,
							applicationName: nodeInfo.application_version?.app_name ?? nodeInfo.application_version?.name,
							applicationVersion: nodeInfo.application_version?.version,
							cosmosSdkVersion: nodeInfo.application_version?.cosmos_sdk_version,
						}
					},
				},
			},
		})({
			$network: (timestamp) => timestamp.$network,
			timestampMs: (timestamp) => timestamp.timestampMs,
			source: (timestamp) => timestamp.source,
			ledgerModels: (timestamp) => timestamp.ledgerModels,
			executionModels: (timestamp) => timestamp.executionModels,
			Cosmos: {
				latestBlockHeight: (timestamp) => timestamp.latestBlockHeight,
				latestBlockHash: (timestamp) => timestamp.latestBlockHash,
				latestBlockTimeMs: (timestamp) => timestamp.latestBlockTimeMs,
				chainId: (timestamp) => timestamp.chainId,
				nodeNetwork: (timestamp) => timestamp.nodeNetwork,
				applicationName: (timestamp) => timestamp.applicationName,
				applicationVersion: (timestamp) => timestamp.applicationVersion,
				cosmosSdkVersion: (timestamp) => timestamp.cosmosSdkVersion,
			},
		}),

		defineResolver({
			entityType: EntityType.IbcDenomTrace,
			resolve: {
				NetworkTraceKey: {
					appliesTo: osmosisNetworkReferenceApplicability,
					resolve: async (entitySelector) => {
						assertOsmosisNetwork(entitySelector.$network)
						const {
							getDenomTrace,
						} = await import('$/sources/Osmosis/Rest/queries.ts')
						const {
							denom_trace: denomTrace,
						} = await getDenomTrace(entitySelector.traceKey)
						const channel = channelPartsFromPath(denomTrace.path)
						const denomHash = (
							entitySelector.traceKey.startsWith('hash:') ?
								entitySelector.traceKey.slice('hash:'.length).toLowerCase()
							: entitySelector.traceKey.startsWith('ibc/') ?
								entitySelector.traceKey.slice('ibc/'.length).toLowerCase()
							: /^[0-9A-Fa-f]{64}$/.test(entitySelector.traceKey) ?
								entitySelector.traceKey.toLowerCase()
							:
								undefined
						)
						return {
							path: denomTrace.path,
							baseDenom: denomTrace.base_denom,
							displayDenom: denomTrace.base_denom,
							...(denomHash != null && {
								denomHash,
							}),
							...(channel != null && {
								sourcePort: channel.sourcePort,
								sourceChannel: channel.sourceChannel,
							}),
						}
					},
				},
			},
		})({
			path: (trace) => trace.path,
			baseDenom: (trace) => trace.baseDenom,
			displayDenom: (trace) => trace.displayDenom,
			denomHash: (trace) => trace.denomHash,
			sourcePort: (trace) => trace.sourcePort,
			sourceChannel: (trace) => trace.sourceChannel,
		}),
	],
} satisfies RegisteredSourceResolverModule<Source.Osmosis_LCD_Rest>

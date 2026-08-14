import { networkBySlug } from '$/constants/Network.ts'
import { defineResolver, type RegisteredSourceResolverModule } from '$/resolvers/defineResolver.ts'
import {
	entityFieldAddressKey,
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/Source.ts'
import type {
	chainServiceInfo,
	libp2pInfo,
	walletBalance,
} from '$/sources/LogosBlockchainNode/Rest/types.ts'

type LogosBlockchainNetworkId = EntitySelector<typeof schema, EntityType.LogosBlockchainNetwork>

const assertLogosTestnet = (network: LogosBlockchainNetworkId) => {
	if (
		'slug' in network.$network
		&& network.$network.slug === networkBySlug['logos-testnet'].slug
	)
		return

	throw new Error('LogosBlockchainNode_Rest: unsupported network')
}

const zeroExHexFromWire = (hex: string) => (
	`0x${hex.toLowerCase()}`
)

const normalizeZkPublicKeyHex = (publicKey: string) => (
	(
		publicKey.startsWith('0x') || publicKey.startsWith('0X') ?
			publicKey.slice(2)
		:
			publicKey
	).toLowerCase()
)

const cryptarchiaObservationFields = (info: typeof chainServiceInfo.infer) => ({
	lib: zeroExHexFromWire(info.cryptarchia_info.lib),
	libSlot: BigInt(info.cryptarchia_info.lib_slot),
	tip: zeroExHexFromWire(info.cryptarchia_info.tip),
	slot: BigInt(info.cryptarchia_info.slot),
	height: BigInt(info.cryptarchia_info.height),
	mode: (
		info.mode === 'AwaitingStart' ?
			info.mode
		:
			info.mode.Started
	),
})

const networkInfoObservationFields = (info: typeof libp2pInfo.infer) => ({
	listenAddresses: info.listen_addresses,
	peerCount: info.n_peers,
	connectionCount: info.n_connections,
	pendingConnectionCount: info.n_pending_connections,
})

const walletBalanceObservationFields = (balance: typeof walletBalance.infer) => ({
	tip: zeroExHexFromWire(balance.tip),
	balance: BigInt(balance.balance),
	address: zeroExHexFromWire(balance.address),
})

export default {
	source: Source.LogosBlockchainNode_Rest,

	resolvers: [
		defineResolver({
			entityType: EntityType.LogosBlockchainNetwork,
			resolve: {
				Network: {
					resolve: async (network) => {
						assertLogosTestnet(network)
						const { getCryptarchiaInfo } = await import('$/sources/LogosBlockchainNode/Rest/queries.ts')
						const observedAtMs = Date.now()
						return {
							...cryptarchiaObservationFields(await getCryptarchiaInfo()),
							observedAtMs,
						}
					},
				},
			},
		})({
			$$timestamps: (snapshot, network) => [{
				[EntityMetaKey.Selector]: {
					$network: network,
					timestampMs: snapshot.observedAtMs,
					source: Source.LogosBlockchainNode_Rest,
				},
				[EntityMetaKey.Fields]: {
					[entityFieldAddressKey(EntityType.LogosBlockchainNetwork_Timestamp, [], 'lib')]: snapshot.lib,
					[entityFieldAddressKey(EntityType.LogosBlockchainNetwork_Timestamp, [], 'libSlot')]: snapshot.libSlot,
					[entityFieldAddressKey(EntityType.LogosBlockchainNetwork_Timestamp, [], 'tip')]: snapshot.tip,
					[entityFieldAddressKey(EntityType.LogosBlockchainNetwork_Timestamp, [], 'slot')]: snapshot.slot,
					[entityFieldAddressKey(EntityType.LogosBlockchainNetwork_Timestamp, [], 'height')]: snapshot.height,
					[entityFieldAddressKey(EntityType.LogosBlockchainNetwork_Timestamp, [], 'mode')]: snapshot.mode,
				},
			}],
		}),

		defineResolver({
			entityType: EntityType.LogosBlockchainNetwork_Timestamp,
			resolve: {
				NetworkTimestampMsSource: {
					resolve: async ({ $network, source }) => {
						if (source !== Source.LogosBlockchainNode_Rest)
							throw new Error(`LogosBlockchainNode_Rest: unsupported source ${source}`)
						assertLogosTestnet($network)
						const { getCryptarchiaInfo } = await import('$/sources/LogosBlockchainNode/Rest/queries.ts')
						return cryptarchiaObservationFields(await getCryptarchiaInfo())
					},
				},
			},
		})({
			lib: (snapshot) => snapshot.lib,
			libSlot: (snapshot) => snapshot.libSlot,
			tip: (snapshot) => snapshot.tip,
			slot: (snapshot) => snapshot.slot,
			height: (snapshot) => snapshot.height,
			mode: (snapshot) => snapshot.mode,
		}),

		defineResolver({
			entityType: EntityType.BlockheadLogosBlockchainNodeState,
			resolve: {
				ConnectionIdPeerId: {
					resolve: async ({ connectionId, peerId }) => {
						const {
							getNetworkInfo,
							nodeEndpoint,
						} = await import('$/sources/LogosBlockchainNode/Rest/queries.ts')
						const info = await getNetworkInfo()
						if (info.peer_id !== peerId)
							throw new Error(`LogosBlockchainNode_Rest: peer id mismatch (expected ${peerId}, got ${info.peer_id})`)
						const timestampMs = Date.now()
						return {
							connectionId,
							peerId,
							endpoint: nodeEndpoint(),
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$nodeState: {
											connectionId,
											peerId,
										},
										timestampMs,
										source: Source.LogosBlockchainNode_Rest,
									},
								},
							],
						}
					},
				},
			},
			resolveLive: {
				operatorState: {
					facetPath: [],
					publishes: {
						'$$timestamps': true,
					},
					start: ({
						fields,
						parentEntitySelector,
						signal,
					}) => {
						let timeout: ReturnType<typeof setTimeout> | undefined
						const poll = async () => {
							const { getNetworkInfo } = await import('$/sources/LogosBlockchainNode/Rest/queries.ts')
							const info = await getNetworkInfo()
							if (signal.aborted)
								return
							if (info.peer_id !== parentEntitySelector.peerId)
								throw new Error(`LogosBlockchainNode_Rest: peer id mismatch (expected ${parentEntitySelector.peerId}, got ${info.peer_id})`)
							const timestampMs = Date.now()
							const observation = networkInfoObservationFields(info)
							fields.$$timestamps.replaceRows([{
								source: Source.LogosBlockchainNode_Rest,
								value: [{
									[EntityMetaKey.Selector]: {
										$nodeState: parentEntitySelector,
										timestampMs,
										source: Source.LogosBlockchainNode_Rest,
									},
									[EntityMetaKey.Fields]: Object.fromEntries(
										Object.entries(observation).map(([fieldName, value]) => [
											entityFieldAddressKey(EntityType.BlockheadLogosBlockchainNodeState_Timestamp, [], fieldName),
											value,
										])
									),
								}],
							}])
							timeout = setTimeout(() => { void poll() }, 10_000)
						}
						const abort = () => {
							if (timeout != null)
								clearTimeout(timeout)
						}
						signal.addEventListener('abort', abort, { once: true })
						void poll()
						return () => {
							signal.removeEventListener('abort', abort)
							abort()
						}
					},
				},
			},
		})({
			connectionId: (state) => state.connectionId,
			peerId: (state) => state.peerId,
			endpoint: (state) => state.endpoint,
			$$timestamps: (state) => state.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BlockheadLogosBlockchainNodeState_Timestamp,
			resolve: {
				NodeStateTimestampMsSource: {
					resolve: async ({ $nodeState, source }) => {
						if (source !== Source.LogosBlockchainNode_Rest)
							throw new Error(`LogosBlockchainNode_Rest: unsupported source ${source}`)
						const { getNetworkInfo } = await import('$/sources/LogosBlockchainNode/Rest/queries.ts')
						const info = await getNetworkInfo()
						if (info.peer_id !== $nodeState.peerId)
							throw new Error(`LogosBlockchainNode_Rest: peer id mismatch (expected ${$nodeState.peerId}, got ${info.peer_id})`)
						return networkInfoObservationFields(info)
					},
				},
			},
		})({
			listenAddresses: (snapshot) => snapshot.listenAddresses,
			peerCount: (snapshot) => snapshot.peerCount,
			connectionCount: (snapshot) => snapshot.connectionCount,
			pendingConnectionCount: (snapshot) => snapshot.pendingConnectionCount,
		}),

		defineResolver({
			entityType: EntityType.BlockheadLogosBlockchainWalletKeyState,
			resolve: {
				NodeStatePublicKey: {
					resolve: async ({ $nodeState, publicKey }) => {
						const { getWalletBalance } = await import('$/sources/LogosBlockchainNode/Rest/queries.ts')
						const balance = await getWalletBalance(publicKey)
						if (normalizeZkPublicKeyHex(balance.address) !== normalizeZkPublicKeyHex(publicKey))
							throw new Error('LogosBlockchainNode_Rest: wallet address mismatch')
						const timestampMs = Date.now()
						return {
							$nodeState: {
								[EntityMetaKey.Selector]: $nodeState,
							},
							publicKey,
							$$timestamps: [
								{
									[EntityMetaKey.Selector]: {
										$walletKeyState: {
											$nodeState,
											publicKey,
										},
										timestampMs,
										source: Source.LogosBlockchainNode_Rest,
									},
								},
							],
						}
					},
				},
			},
		})({
			$nodeState: (state) => state.$nodeState,
			publicKey: (state) => state.publicKey,
			$$timestamps: (state) => state.$$timestamps,
		}),

		defineResolver({
			entityType: EntityType.BlockheadLogosBlockchainWalletKeyState_Timestamp,
			resolve: {
				WalletKeyStateTimestampMsSource: {
					resolve: async ({ $walletKeyState, source }) => {
						if (source !== Source.LogosBlockchainNode_Rest)
							throw new Error(`LogosBlockchainNode_Rest: unsupported source ${source}`)
						const { getWalletBalance } = await import('$/sources/LogosBlockchainNode/Rest/queries.ts')
						const balance = await getWalletBalance($walletKeyState.publicKey)
						if (normalizeZkPublicKeyHex(balance.address) !== normalizeZkPublicKeyHex($walletKeyState.publicKey))
							throw new Error('LogosBlockchainNode_Rest: wallet address mismatch')
						return walletBalanceObservationFields(balance)
					},
				},
			},
		})({
			tip: (snapshot) => snapshot.tip,
			balance: (snapshot) => snapshot.balance,
			address: (snapshot) => snapshot.address,
		}),
	],
} satisfies RegisteredSourceResolverModule

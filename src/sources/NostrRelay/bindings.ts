// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const nostrRelayNip11HttpNostrRelayReadOperationGroups = [
	SourceOperationGroup.NostrRelayRead,
] as const
const nostrRelayNip11HttpCredentials = [
	{
		scope: SourceCredentialScope.None,
	},
] as const
const nostrRelayNip11HttpArtifacts = [
	{
		kind: SourceArtifactKind.HandwrittenTypes,
		path: 'src/sources/NostrRelay/Http/types.ts',
		generated: false,
	},
] as const

const nostrRelayWebSocketNostrRelayReadGenericSubscribeOperationGroups = [
	SourceOperationGroup.NostrRelayRead,
	SourceOperationGroup.GenericSubscribe,
] as const
const nostrRelayWebSocketCredentials = [
	{
		scope: SourceCredentialScope.None,
	},
] as const
const nostrRelayWebSocketArtifacts = [
	{
		kind: SourceArtifactKind.HandwrittenTypes,
		path: 'src/sources/NostrRelay/WebSocket/types.ts',
		generated: false,
	},
] as const

const bindings = [
	{
		source: Source.NostrRelay_Nip11_Http,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'wss://relay.damus.io',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://relay.damus.io',
				origin: 'https://relay.damus.io',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.NostrRelay,
		operationGroups: nostrRelayNip11HttpNostrRelayReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: nostrRelayNip11HttpCredentials,
		artifacts: nostrRelayNip11HttpArtifacts,
	},
	{
		source: Source.NostrRelay_Nip11_Http,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'wss://nos.lol',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://nos.lol',
				origin: 'https://nos.lol',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.NostrRelay,
		operationGroups: nostrRelayNip11HttpNostrRelayReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: nostrRelayNip11HttpCredentials,
		artifacts: nostrRelayNip11HttpArtifacts,
	},
	{
		source: Source.NostrRelay_Nip11_Http,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'wss://relay.primal.net',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://relay.primal.net',
				origin: 'https://relay.primal.net',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.NostrRelay,
		operationGroups: nostrRelayNip11HttpNostrRelayReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: nostrRelayNip11HttpCredentials,
		artifacts: nostrRelayNip11HttpArtifacts,
	},
	{
		source: Source.NostrRelay_WebSocket,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'wss://relay.damus.io',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://relay.damus.io',
			},
		],
		wireProtocol: WireProtocol.WebSocketMessages,
		apiFamily: ApiFamily.NostrRelay,
		operationGroups: nostrRelayWebSocketNostrRelayReadGenericSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: nostrRelayWebSocketCredentials,
		artifacts: nostrRelayWebSocketArtifacts,
	},
	{
		source: Source.NostrRelay_WebSocket,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'wss://nos.lol',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://nos.lol',
			},
		],
		wireProtocol: WireProtocol.WebSocketMessages,
		apiFamily: ApiFamily.NostrRelay,
		operationGroups: nostrRelayWebSocketNostrRelayReadGenericSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: nostrRelayWebSocketCredentials,
		artifacts: nostrRelayWebSocketArtifacts,
	},
	{
		source: Source.NostrRelay_WebSocket,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'wss://relay.primal.net',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://relay.primal.net',
			},
		],
		wireProtocol: WireProtocol.WebSocketMessages,
		apiFamily: ApiFamily.NostrRelay,
		operationGroups: nostrRelayWebSocketNostrRelayReadGenericSubscribeOperationGroups,
		delivery: SourceDelivery.RemoteLive,
		credentials: nostrRelayWebSocketCredentials,
		artifacts: nostrRelayWebSocketArtifacts,
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{
	readonly [Source.NostrRelay_Nip11_Http]: readonly [typeof bindings[0], typeof bindings[1], typeof bindings[2]]
	readonly [Source.NostrRelay_WebSocket]: readonly [typeof bindings[3], typeof bindings[4], typeof bindings[5]]
}>(bindings)

// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const nostrRelayNip11HttpNostrRelayHttpProxyBindingAxes = {
	source: Source.NostrRelay_Nip11_Http,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.NostrRelay,
	operationGroups: [
		SourceOperationGroup.NostrRelayRead,
	],
	delivery: SourceDelivery.HttpProxy,
	credentials: [],
	artifacts: [
		{
			kind: SourceArtifactKind.HandwrittenTypes,
			path: 'src/sources/NostrRelay/Http/types.ts',
		},
	],
} as const

const nostrRelayWebSocketNostrRelayRemoteLiveBindingAxes = {
	source: Source.NostrRelay_WebSocket,
	wireProtocol: WireProtocol.WebSocketMessages,
	apiFamily: ApiFamily.NostrRelay,
	operationGroups: [
		SourceOperationGroup.NostrRelayRead,
		SourceOperationGroup.GenericSubscribe,
	],
	delivery: SourceDelivery.RemoteLive,
	credentials: [],
	artifacts: [
		{
			kind: SourceArtifactKind.HandwrittenTypes,
			path: 'src/sources/NostrRelay/WebSocket/types.ts',
		},
	],
} as const

const bindings = [
	{
		...nostrRelayNip11HttpNostrRelayHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'wss://relay.damus.io',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://relay.damus.io',
				corsEnabled: false,
			},
		],
	},
	{
		...nostrRelayNip11HttpNostrRelayHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'wss://nos.lol',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://nos.lol',
				corsEnabled: false,
			},
		],
	},
	{
		...nostrRelayNip11HttpNostrRelayHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'wss://relay.primal.net',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://relay.primal.net',
				corsEnabled: false,
			},
		],
	},
	{
		...nostrRelayWebSocketNostrRelayRemoteLiveBindingAxes,
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
	},
	{
		...nostrRelayWebSocketNostrRelayRemoteLiveBindingAxes,
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
	},
	{
		...nostrRelayWebSocketNostrRelayRemoteLiveBindingAxes,
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
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)

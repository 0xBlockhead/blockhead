// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
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
				corsEnabled: false,
			},
		],
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
	},
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
				corsEnabled: false,
			},
		],
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
	},
	{
		source: Source.NostrRelay_Nip11_Http,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'wss://relay.nostr.band',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://relay.nostr.band',
				corsEnabled: false,
			},
		],
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
				corsEnabled: false,
			},
		],
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
		operationGroups: [
			SourceOperationGroup.GenericSubscribe,
			SourceOperationGroup.NostrRelayPublish,
			SourceOperationGroup.NostrRelayRead,
		],
		delivery: SourceDelivery.RemoteLive,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/NostrRelay/WebSocket/types.ts',
			},
		],
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
		operationGroups: [
			SourceOperationGroup.GenericSubscribe,
			SourceOperationGroup.NostrRelayPublish,
			SourceOperationGroup.NostrRelayRead,
		],
		delivery: SourceDelivery.RemoteLive,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/NostrRelay/WebSocket/types.ts',
			},
		],
	},
	{
		source: Source.NostrRelay_WebSocket,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'wss://relay.nostr.band',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://relay.nostr.band',
			},
		],
		wireProtocol: WireProtocol.WebSocketMessages,
		apiFamily: ApiFamily.NostrRelay,
		operationGroups: [
			SourceOperationGroup.GenericSubscribe,
			SourceOperationGroup.NostrRelayPublish,
			SourceOperationGroup.NostrRelayRead,
			SourceOperationGroup.NostrSearch,
		],
		delivery: SourceDelivery.RemoteLive,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/NostrRelay/WebSocket/types.ts',
			},
		],
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
		operationGroups: [
			SourceOperationGroup.GenericSubscribe,
			SourceOperationGroup.NostrRelayPublish,
			SourceOperationGroup.NostrRelayRead,
		],
		delivery: SourceDelivery.RemoteLive,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/NostrRelay/WebSocket/types.ts',
			},
		],
	},
])

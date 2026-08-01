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
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

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

const nostrRelayNip11HttpTargets = [
	{
		key: 'wss://relay.damus.io',
		locator: 'https://relay.damus.io',
	},
	{
		key: 'wss://nos.lol',
		locator: 'https://nos.lol',
	},
	{
		key: 'wss://relay.primal.net',
		locator: 'https://relay.primal.net',
	},
] as const

const nostrRelayNip11HttpBindings = nostrRelayNip11HttpTargets.map(({
	key,
	locator,
}) => ({
		...nostrRelayNip11HttpNostrRelayHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.Feed,
			key,
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator,
				corsEnabled: false,
			},
		],
} satisfies SourceBinding))

const nostrRelayWebSocketTargets = [
	{
		key: 'wss://relay.damus.io',
		locator: 'wss://relay.damus.io',
	},
	{
		key: 'wss://nos.lol',
		locator: 'wss://nos.lol',
	},
	{
		key: 'wss://relay.primal.net',
		locator: 'wss://relay.primal.net',
	},
] as const

const nostrRelayWebSocketBindings = nostrRelayWebSocketTargets.map(({
	key,
	locator,
}) => ({
		...nostrRelayWebSocketNostrRelayRemoteLiveBindingAxes,
		target: {
			kind: SourceTargetKind.Feed,
			key,
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator,
			},
		],
} satisfies SourceBinding))

const bindings = [
	...nostrRelayNip11HttpBindings,
	...nostrRelayWebSocketBindings,
] satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)

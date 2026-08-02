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

const nostrRelayNip11HttpBindingAxes = {
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

const nostrRelayWebSocketBindingAxes = {
	source: Source.NostrRelay_WebSocket,
	wireProtocol: WireProtocol.WebSocketMessages,
	apiFamily: ApiFamily.NostrRelay,
	operationGroups: [
		SourceOperationGroup.GenericSubscribe,
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

export default indexSourceBindings([
	...nostrRelayNip11HttpTargets.map(({
		key,
		locator,
	}) => ({
			...nostrRelayNip11HttpBindingAxes,
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
	} satisfies SourceBinding)),
	...nostrRelayWebSocketTargets.map(({
		key,
		locator,
	}) => ({
			...nostrRelayWebSocketBindingAxes,
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
	} satisfies SourceBinding)),
] satisfies readonly SourceBinding[])

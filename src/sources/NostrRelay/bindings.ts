import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceArtifactKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export const nostrRelayBindings = [
	{
		provider: SourceProvider.NostrRelay,
		source: Source.NostrRelay_Nip11_Http,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'nostr-relay-nip11',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{relay-host}',
				origin: 'https://{relay-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.NostrRelay,
		operationGroups: [
			SourceOperationGroup.NostrRelayRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/NostrRelay/Http/types.ts',
				generated: false,
			},
		],
	},
	{
		provider: SourceProvider.NostrRelay,
		source: Source.NostrRelay_WebSocket,
		target: {
			kind: SourceTargetKind.Feed,
			key: 'nostr-relay-websocket',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'wss://{relay-host}',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.NostrRelay,
		operationGroups: [
			SourceOperationGroup.NostrRelayRead,
			SourceOperationGroup.GenericSubscribe,
		],
		delivery: SourceDelivery.RemoteLive,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/NostrRelay/WebSocket/types.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

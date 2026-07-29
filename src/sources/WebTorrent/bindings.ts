// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.WebTorrent_Client,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'webtorrent-client',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.InProcess,
				locator: 'webtorrent-client',
			},
		],
		wireProtocol: WireProtocol.InProcess,
		apiFamily: ApiFamily.WebTorrentApi,
		operationGroups: [
			SourceOperationGroup.GenericRead,
			SourceOperationGroup.BitTorrentAnnounce,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
	{
		source: Source.WebTorrent_Dht,
		target: {
			kind: SourceTargetKind.TorrentSwarm,
			key: 'webtorrent-dht',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.InProcess,
				locator: 'webtorrent-dht',
			},
		],
		wireProtocol: WireProtocol.InProcess,
		apiFamily: ApiFamily.BitTorrentDht,
		operationGroups: [
			SourceOperationGroup.BitTorrentDhtLookup,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
	{
		source: Source.WebTorrent_Tracker,
		target: {
			kind: SourceTargetKind.TorrentSwarm,
			key: 'webtorrent-tracker',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.WebSocketUrl,
				locator: 'env:WEBTORRENT_TRACKER_WS_URL',
			},
		],
		wireProtocol: WireProtocol.WebSocketMessages,
		apiFamily: ApiFamily.BitTorrentTracker,
		operationGroups: [
			SourceOperationGroup.BitTorrentAnnounce,
			SourceOperationGroup.GenericSubscribe,
		],
		delivery: SourceDelivery.RemoteLive,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{
	readonly [Source.WebTorrent_Client]: typeof bindings[0]
	readonly [Source.WebTorrent_Dht]: typeof bindings[1]
	readonly [Source.WebTorrent_Tracker]: typeof bindings[2]
}>(bindings)

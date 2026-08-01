// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

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
		credentials: [],
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
		credentials: [],
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
		credentials: [],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)

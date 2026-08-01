// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bitTorrentEndpoints = [
	{
		endpointKind: SourceEndpointKind.TcpAddress,
		locator: '{peer-host}:{port}',
	},
] as const
const bitTorrentRepositoryMetadataOperationGroups = [
	SourceOperationGroup.RepositoryMetadata,
] as const
const bitTorrentAnnounceOperationGroups = [
	SourceOperationGroup.BitTorrentAnnounce,
] as const

const bindings = [
	{
		source: Source.BitTorrent,
		target: {
			kind: SourceTargetKind.TorrentSwarm,
			key: 'metainfo-file',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.LocalFilePath,
				locator: '{torrent-file-path}',
			},
		],
		wireProtocol: WireProtocol.Bencode,
		apiFamily: ApiFamily.BitTorrentClient,
		operationGroups: bitTorrentRepositoryMetadataOperationGroups,
		delivery: SourceDelivery.LocalOnly,
		credentials: [],
	},
	{
		source: Source.BitTorrent,
		target: {
			kind: SourceTargetKind.TorrentSwarm,
			key: 'http-tracker',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{tracker-host}/announce',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.RawHttp,
		apiFamily: ApiFamily.BitTorrentTracker,
		operationGroups: bitTorrentAnnounceOperationGroups,
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
	},
	{
		source: Source.BitTorrent,
		target: {
			kind: SourceTargetKind.TorrentSwarm,
			key: 'udp-tracker',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.UdpAddress,
				locator: 'udp://{tracker-host}:{port}',
			},
		],
		wireProtocol: WireProtocol.Bencode,
		apiFamily: ApiFamily.BitTorrentTracker,
		operationGroups: bitTorrentAnnounceOperationGroups,
		delivery: SourceDelivery.ServerOnly,
		credentials: [],
	},
	{
		source: Source.BitTorrent,
		target: {
			kind: SourceTargetKind.TorrentSwarm,
			key: 'mainline-dht',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.UdpAddress,
				locator: 'udp://{bootstrap-node}:{port}',
			},
		],
		wireProtocol: WireProtocol.Bencode,
		apiFamily: ApiFamily.BitTorrentDht,
		operationGroups: [
			SourceOperationGroup.BitTorrentDhtLookup,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [],
	},
	{
		source: Source.BitTorrent,
		target: {
			kind: SourceTargetKind.TorrentSwarm,
			key: 'metadata-exchange',
		},
		endpoints: bitTorrentEndpoints,
		wireProtocol: WireProtocol.Bencode,
		apiFamily: ApiFamily.BitTorrentClient,
		operationGroups: bitTorrentRepositoryMetadataOperationGroups,
		delivery: SourceDelivery.ServerOnly,
		credentials: [],
	},
	{
		source: Source.BitTorrent,
		target: {
			kind: SourceTargetKind.TorrentSwarm,
			key: 'peer-wire',
		},
		endpoints: bitTorrentEndpoints,
		wireProtocol: WireProtocol.Bencode,
		apiFamily: ApiFamily.BitTorrentClient,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)

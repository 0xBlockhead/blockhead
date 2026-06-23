import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export const bitTorrentBindings = [
	{
		provider: SourceProvider.BitTorrent,
		source: Source.BitTorrentMetainfo_File,
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
		operationGroups: [
			SourceOperationGroup.RepositoryMetadata,
		],
		delivery: SourceDelivery.LocalOnly,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
	{
		provider: SourceProvider.BitTorrent,
		source: Source.BitTorrent_HttpTracker,
		target: {
			kind: SourceTargetKind.TorrentSwarm,
			key: 'http-tracker',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{tracker-host}/announce',
				origin: 'https://{tracker-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.RawHttp,
		apiFamily: ApiFamily.BitTorrentTracker,
		operationGroups: [
			SourceOperationGroup.BitTorrentAnnounce,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
	{
		provider: SourceProvider.BitTorrent,
		source: Source.BitTorrent_UdpTracker,
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
		operationGroups: [
			SourceOperationGroup.BitTorrentAnnounce,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
	{
		provider: SourceProvider.BitTorrent,
		source: Source.BitTorrent_MainlineDht,
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
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
	{
		provider: SourceProvider.BitTorrent,
		source: Source.BitTorrent_MetadataExchange,
		target: {
			kind: SourceTargetKind.TorrentSwarm,
			key: 'metadata-exchange',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.TcpAddress,
				locator: '{peer-host}:{port}',
			},
		],
		wireProtocol: WireProtocol.Bencode,
		apiFamily: ApiFamily.BitTorrentClient,
		operationGroups: [
			SourceOperationGroup.RepositoryMetadata,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
	{
		provider: SourceProvider.BitTorrent,
		source: Source.BitTorrent_PeerWire,
		target: {
			kind: SourceTargetKind.TorrentSwarm,
			key: 'peer-wire',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.TcpAddress,
				locator: '{peer-host}:{port}',
			},
		],
		wireProtocol: WireProtocol.Bencode,
		apiFamily: ApiFamily.BitTorrentClient,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

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

export const magnetUriBindings = [
	{
		provider: SourceProvider.MagnetUri,
		source: Source.MagnetUri_Uri,
		target: {
			kind: SourceTargetKind.TorrentSwarm,
			key: 'magnet-uri',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.InProcess,
				locator: 'magnet-uri-parser',
			},
		],
		wireProtocol: WireProtocol.Uri,
		apiFamily: ApiFamily.UriScheme,
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
] as const satisfies readonly SourceBinding[]

// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
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

export default indexSourceBindings<{ readonly [Source.MagnetUri_Uri]: typeof bindings[0] }>(bindings)

// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.SqdPortal_RawHttp]: {
		source: Source.SqdPortal_RawHttp,
		target: {
			kind: SourceTargetKind.Eip155Chain,
			key: '1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
				origin: 'https://portal.sqd.dev',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.RawHttp,
		apiFamily: ApiFamily.SqdPortalStream,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		proxyId: '["SqdPortal_RawHttp","Eip155Chain","1","HttpProxy","SqdPortalStream"]',
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Sqd/Portal/types.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex

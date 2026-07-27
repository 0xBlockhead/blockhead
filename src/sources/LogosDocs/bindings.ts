// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.LogosDocs_Rest]: {
		source: Source.LogosDocs_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'docs',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://docs.logoslabs.io',
				origin: 'https://docs.logoslabs.io',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/LogosDocs/Rest/types.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex

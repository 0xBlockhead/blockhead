// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.SigstoreRekor_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'transparency-log',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://rekor.sigstore.dev',
				origin: 'https://rekor.sigstore.dev',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.SigstoreRekorApi,
		operationGroups: [
			SourceOperationGroup.AiArtifactCatalog,
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.SigstoreRekor_Rest]: typeof bindings[0] }>(bindings)

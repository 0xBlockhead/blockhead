// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.EasScan_Graphql,
		target: {
			kind: SourceTargetKind.Global,
			key: 'eas-scan',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{eas-scan-graphql-host}',
				origin: 'https://{eas-scan-graphql-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
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
				path: 'src/sources/EasScan/Graphql/types.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.EasScan_Graphql]: typeof bindings[0] }>(bindings)

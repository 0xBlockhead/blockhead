// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.Amboss_Graphql,
		target: {
			kind: SourceTargetKind.Global,
			key: 'amboss-space',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.amboss.space/graphql',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.RuntimeSecret,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/Amboss/Graphql/schema.graphql',
				generated: true,
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Amboss/Graphql/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/Amboss/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)

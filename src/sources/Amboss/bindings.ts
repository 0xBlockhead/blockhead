// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.Amboss_Graphql]: {
		source: Source.Amboss_Graphql,
		target: {
			kind: SourceTargetKind.Global,
			key: 'amboss-space',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.amboss.space/graphql',
				origin: 'https://api.amboss.space',
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
		proxyId: '["Amboss_Graphql","Global","amboss-space","HttpProxy","GraphqlHttp"]',
		serverCredentialId: '["Amboss_Graphql","Global","amboss-space","HttpProxy","GraphqlHttp"]',
		artifacts: [
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/Amboss/Graphql/schema.graphql',
				generated: true,
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Amboss/Graphql/schema-source.ts',
				generated: false,
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/Amboss/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
} as const satisfies SourceBindingIndex

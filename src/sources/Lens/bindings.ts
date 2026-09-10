// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
	{
		source: Source.Lens_Graphql,
		target: {
			kind: SourceTargetKind.Global,
			key: 'lens-protocol',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.lens.xyz/graphql',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.Graphql,
		apiFamily: ApiFamily.GraphqlHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Lens/Graphql/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.GraphqlSchema,
				path: 'src/sources/Lens/Graphql/schema.graphql',
			},
			{
				kind: SourceArtifactKind.GraphqlTypes,
				path: 'src/sources/Lens/Graphql/graphql-env.d.ts',
				generated: true,
			},
		],
	},
])

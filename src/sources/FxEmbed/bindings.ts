// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	genericReadOperationGroups,
	indexSourceBindings,
	SourceArtifactKind,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
	{
		source: Source.X_FxEmbed_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'fxembed-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.fxtwitter.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.OpenApiHttp,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.HttpProxy,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/FxEmbed/OpenApi/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/FxEmbed/OpenApi/openapi.json',
				generated: true,
				officialUrl: 'https://raw.githubusercontent.com/FxEmbed/FxEmbed/main/docs/specs/fxtwitter-openapi.json',
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/FxEmbed/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
])

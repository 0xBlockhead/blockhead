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
		source: Source.StellarExpert,
		target: {
			kind: SourceTargetKind.Global,
			key: 'stellar-expert-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.stellar.expert',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.OpenApiHttp,
		operationGroups: genericReadOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/StellarExpert/OpenApi/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/StellarExpert/OpenApi/openapi.yml',
				generated: true,
				officialUrl: 'https://raw.githubusercontent.com/stellar-expert/stellar-expert-explorer/master/ui/open-api/openapi.yml',
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/StellarExpert/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
])

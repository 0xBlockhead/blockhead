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
		source: Source.EnsMetadataService,
		target: {
			kind: SourceTargetKind.Global,
			key: 'ens-metadata-service',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://metadata.ens.domains',
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
				path: 'src/sources/EnsMetadataService/OpenApi/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/EnsMetadataService/OpenApi/openapi.json',
				generated: true,
				officialUrl: 'https://metadata.ens.domains/assets/doc_output.json',
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/EnsMetadataService/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
])

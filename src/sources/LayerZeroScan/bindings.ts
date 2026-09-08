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
		source: Source.LayerZeroScan_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'layerzero-scan-api',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://scan.layerzero-api.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.OpenApiHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
		artifacts: [
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/LayerZeroScan/OpenApi/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/LayerZeroScan/OpenApi/openapi.json',
				generated: true,
				officialUrl: 'https://scan.layerzero-api.com/v1/openapi',
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/LayerZeroScan/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
])

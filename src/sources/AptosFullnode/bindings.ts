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
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
	{
		source: Source.AptosFullnode_Rest,
		target: {
			kind: SourceTargetKind.Caip2Network,
			key: 'aptos:1',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://fullnode.mainnet.aptoslabs.com/v1/',
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
				path: 'src/sources/AptosFullnode/OpenApi/schema-source.ts',
			},
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/AptosFullnode/OpenApi/spec.yaml',
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/AptosFullnode/OpenApi/openapi.d.ts',
				generated: true,
			},
		],
	},
] as const satisfies readonly SourceBinding[])

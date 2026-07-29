// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.LifiStatus_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'lifi-status',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://li.quest',
				origin: 'https://li.quest',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.OpenApiHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
	{
		source: Source.Lifi_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'lifi',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://li.quest',
				origin: 'https://li.quest',
				corsEnabled: true,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://staging.li.quest',
				origin: 'https://staging.li.quest',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.OpenApiSpec,
				path: 'src/sources/Lifi/OpenApi/openapi.yaml',
				generated: false,
			},
			{
				kind: SourceArtifactKind.OpenApiTypes,
				path: 'src/sources/Lifi/OpenApi/openapi.d.ts',
				generated: true,
			},
			{
				kind: SourceArtifactKind.GenerationManifest,
				path: 'src/sources/Lifi/OpenApi/schema-source.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{
	readonly [Source.LifiStatus_Rest]: typeof bindings[0]
	readonly [Source.Lifi_Rest]: typeof bindings[1]
}>(bindings)

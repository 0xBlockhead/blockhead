// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.LifiStatus_Rest]: {
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
	[Source.Lifi_Rest]: {
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
} as const satisfies SourceBindingIndex

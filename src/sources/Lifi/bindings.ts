import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const lifiOrigin = 'https://li.quest' as const
const lifiStagingOrigin = 'https://staging.li.quest' as const

export const lifiBindings = [
	{
		provider: SourceProvider.Lifi,
		source: Source.LifiStatus_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'lifi-status',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: lifiOrigin,
				origin: lifiOrigin,
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.OpenApiHttp,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
	{
		provider: SourceProvider.Lifi,
		source: Source.Lifi_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'lifi',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: lifiOrigin,
				origin: lifiOrigin,
				corsEnabled: false,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: lifiStagingOrigin,
				origin: lifiStagingOrigin,
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.HttpProxy,
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

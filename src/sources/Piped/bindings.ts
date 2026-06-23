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
import { pipedApiOrigins } from '$/sources/Piped/Rest/constants.ts'

export const pipedBindings = pipedApiOrigins.map((pipedApiOrigin) => ({
	provider: SourceProvider.Piped,
	source: Source.Piped_Rest,
	target: {
		kind: SourceTargetKind.Global,
		key: 'piped-api',
	},
	endpoints: [
		{
			endpointKind: SourceEndpointKind.HttpUrl,
			locator: pipedApiOrigin.origin,
			origin: pipedApiOrigin.origin,
			corsEnabled: pipedApiOrigin.corsEnabled,
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
			kind: SourceArtifactKind.HandwrittenTypes,
			path: 'src/sources/Piped/Rest/types.ts',
			generated: false,
		},
	],
})) satisfies SourceBinding[]

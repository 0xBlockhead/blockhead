// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.OciRegistry_Distribution]: {
		source: Source.OciRegistry_Distribution,
		target: {
			kind: SourceTargetKind.Global,
			key: 'oci-registry',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{registry}/v2',
				origin: 'https://{registry}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.OciDistribution,
		apiFamily: ApiFamily.OciDistributionApi,
		operationGroups: [
			SourceOperationGroup.SoftwareArtifactRegistry,
			SourceOperationGroup.RepositoryMetadata,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.UserDelegated,
			},
		],
	},
} as const satisfies SourceBindingIndex

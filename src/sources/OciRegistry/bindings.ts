import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export const ociRegistryBindings = [
	{
		provider: SourceProvider.OciRegistry,
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
] as const satisfies readonly SourceBinding[]

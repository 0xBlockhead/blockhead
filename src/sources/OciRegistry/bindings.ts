import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
	{
		source: Source.OciRegistry_Distribution,
		target: {
			kind: SourceTargetKind.Global,
			key: 'oci-registry',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{registry}/v2',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.OciDistribution,
		apiFamily: ApiFamily.OciDistributionApi,
		operationGroups: [
			SourceOperationGroup.RepositoryMetadata,
			SourceOperationGroup.SoftwareArtifactRegistry,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.UserDelegated,
			},
		],
	},
])

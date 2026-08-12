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
		source: Source.RadicleCli_Local,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'radicle-cli',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.LocalProcess,
				locator: 'rad',
			},
		],
		wireProtocol: WireProtocol.InProcess,
		apiFamily: ApiFamily.LocalParser,
		operationGroups: [
			SourceOperationGroup.GenericRead,
			SourceOperationGroup.IssueTracking,
			SourceOperationGroup.PullRequestReview,
			SourceOperationGroup.RepositoryMetadata,
		],
		delivery: SourceDelivery.LocalOnly,
		credentials: [
			{
				scope: SourceCredentialScope.LocalSecret,
			},
		],
	},
])

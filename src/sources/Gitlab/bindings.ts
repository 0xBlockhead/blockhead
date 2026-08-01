// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.Gitlab_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'gitlab-rest',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://gitlab.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.GitlabRestApi,
		operationGroups: [
			SourceOperationGroup.GitRepositoryContents,
			SourceOperationGroup.IssueTracking,
			SourceOperationGroup.PullRequestReview,
			SourceOperationGroup.ReleaseMetadata,
			SourceOperationGroup.RepositoryMetadata,
		],
		delivery: SourceDelivery.HttpProxy,
		credentials: [
			{
				scope: SourceCredentialScope.UserDelegated,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)

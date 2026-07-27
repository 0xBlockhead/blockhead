// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.Gitlab_Rest]: {
		source: Source.Gitlab_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'gitlab-rest',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://gitlab.com',
				origin: 'https://gitlab.com',
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
		proxyId: '["Gitlab_Rest","Global","gitlab-rest","HttpProxy","GitlabRestApi"]',
	},
} as const satisfies SourceBindingIndex

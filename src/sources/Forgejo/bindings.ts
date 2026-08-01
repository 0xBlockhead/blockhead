// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.Forgejo_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'forgejo-instance',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{forgejo-host}/api/v1',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.ForgejoRestApi,
		operationGroups: [
			SourceOperationGroup.GitRepositoryContents,
			SourceOperationGroup.IssueTracking,
			SourceOperationGroup.PullRequestReview,
			SourceOperationGroup.ReleaseMetadata,
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

export default indexSourceBindings(bindings)

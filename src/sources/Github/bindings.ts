// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.Github_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'github-rest',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://api.github.com',
				origin: 'https://api.github.com',
				corsEnabled: true,
			},
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://raw.githubusercontent.com',
				origin: 'https://raw.githubusercontent.com',
				corsEnabled: true,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.GithubRestApi,
		operationGroups: [
			SourceOperationGroup.GitRepositoryContents,
			SourceOperationGroup.IssueTracking,
			SourceOperationGroup.PullRequestReview,
			SourceOperationGroup.ReleaseMetadata,
			SourceOperationGroup.RepositoryMetadata,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.UserDelegated,
			},
		],
	},
	{
		source: Source.Github_Git,
		target: {
			kind: SourceTargetKind.GitRepository,
			key: 'github-git',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://github.com/{owner}/{repo}.git',
				origin: 'https://github.com',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Git,
		apiFamily: ApiFamily.GitObject,
		operationGroups: [
			SourceOperationGroup.GitRepositoryContents,
			SourceOperationGroup.RepositoryMetadata,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.UserDelegated,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{
	readonly [Source.Github_Rest]: typeof bindings[0]
	readonly [Source.Github_Git]: typeof bindings[1]
}>(bindings)

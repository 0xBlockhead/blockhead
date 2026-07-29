// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.ForgejoRepos_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'forgejo-repositories',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{forgejo-host}/api/v1',
				origin: 'https://{forgejo-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.ForgejoRestApi,
		operationGroups: [
			SourceOperationGroup.GitRepositoryContents,
			SourceOperationGroup.RepositoryMetadata,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.UserDelegated,
			},
		],
	},
	{
		source: Source.ForgejoIssues_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'forgejo-issues',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{forgejo-host}/api/v1',
				origin: 'https://{forgejo-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.ForgejoRestApi,
		operationGroups: [
			SourceOperationGroup.IssueTracking,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.UserDelegated,
			},
		],
	},
	{
		source: Source.ForgejoPulls_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'forgejo-pulls',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{forgejo-host}/api/v1',
				origin: 'https://{forgejo-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.ForgejoRestApi,
		operationGroups: [
			SourceOperationGroup.PullRequestReview,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.UserDelegated,
			},
		],
	},
	{
		source: Source.ForgejoReleases_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'forgejo-releases',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{forgejo-host}/api/v1',
				origin: 'https://{forgejo-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.ForgejoRestApi,
		operationGroups: [
			SourceOperationGroup.ReleaseMetadata,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.UserDelegated,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{
	readonly [Source.ForgejoRepos_Rest]: typeof bindings[0]
	readonly [Source.ForgejoIssues_Rest]: typeof bindings[1]
	readonly [Source.ForgejoPulls_Rest]: typeof bindings[2]
	readonly [Source.ForgejoReleases_Rest]: typeof bindings[3]
}>(bindings)

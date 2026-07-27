// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.ForgejoRepos_Rest]: {
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
	[Source.ForgejoIssues_Rest]: {
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
	[Source.ForgejoPulls_Rest]: {
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
	[Source.ForgejoReleases_Rest]: {
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
} as const satisfies SourceBindingIndex

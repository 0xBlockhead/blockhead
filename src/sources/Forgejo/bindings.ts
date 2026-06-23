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

const forgejoEndpoint = {
	endpointKind: SourceEndpointKind.HttpUrl,
	locator: 'https://{forgejo-host}/api/v1',
	origin: 'https://{forgejo-host}',
	corsEnabled: false,
} as const

export const forgejoBindings = [
	{
		provider: SourceProvider.Forgejo,
		source: Source.ForgejoRepos_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'forgejo-repositories',
		},
		endpoints: [
			forgejoEndpoint,
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
		provider: SourceProvider.Forgejo,
		source: Source.ForgejoIssues_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'forgejo-issues',
		},
		endpoints: [
			forgejoEndpoint,
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
		provider: SourceProvider.Forgejo,
		source: Source.ForgejoPulls_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'forgejo-pulls',
		},
		endpoints: [
			forgejoEndpoint,
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
		provider: SourceProvider.Forgejo,
		source: Source.ForgejoReleases_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'forgejo-releases',
		},
		endpoints: [
			forgejoEndpoint,
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

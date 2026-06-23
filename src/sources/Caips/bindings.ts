import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'
import { githubHttpEndpoints } from '$/sources/_shared/hosts/Github/Http/constants.ts'

export const caipsBindings = [
	{
		provider: SourceProvider.Caips,
		source: Source.Caips_Github,
		target: {
			kind: SourceTargetKind.GitRepository,
			key: 'ChainAgnostic/CAIPs@main:CAIPs',
		},
		endpoints: githubHttpEndpoints,
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.GithubContentsApi,
		operationGroups: [
			SourceOperationGroup.GithubRepositoryContents,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
	{
		provider: SourceProvider.Caips,
		source: Source.CaipNamespaces_Github,
		target: {
			kind: SourceTargetKind.GitRepository,
			key: 'ChainAgnostic/namespaces@main:namespaces',
		},
		endpoints: githubHttpEndpoints,
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.GithubContentsApi,
		operationGroups: [
			SourceOperationGroup.GithubRepositoryContents,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

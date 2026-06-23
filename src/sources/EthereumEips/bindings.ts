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

const ethereumEipsGithubEndpoints = [
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
] as const

export const ethereumEipsBindings = [
	...[
		{
			target: {
				kind: SourceTargetKind.GitRepository,
				key: 'ethereum/EIPs@master:EIPS',
			},
		},
		{
			target: {
				kind: SourceTargetKind.GitRepository,
				key: 'ethereum/ercs@master:ERCS',
			},
		},
	].map(({ target }) => ({
		provider: SourceProvider.EthereumEips,
		source: Source.EthereumEips_Github,
		target,
		endpoints: ethereumEipsGithubEndpoints,
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
	})),
] as const satisfies readonly SourceBinding[]

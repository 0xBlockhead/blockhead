// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

const ethereumEipsGithubGitRepositoryEthereumEIPsMasterEIPSEndpoints = [
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
const ethereumEipsGithubGithubRepositoryContentsOperationGroups = [
	SourceOperationGroup.GithubRepositoryContents,
] as const
const ethereumEipsGithubCredentials = [
	{
		scope: SourceCredentialScope.None,
	},
] as const

export default {
	[Source.EthereumEips_Github]: [
		{
			source: Source.EthereumEips_Github,
			target: {
				kind: SourceTargetKind.GitRepository,
				key: 'ethereum/EIPs@master:EIPS',
			},
			endpoints: ethereumEipsGithubGitRepositoryEthereumEIPsMasterEIPSEndpoints,
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.GithubContentsApi,
			operationGroups: ethereumEipsGithubGithubRepositoryContentsOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: ethereumEipsGithubCredentials,
			proxyId: '["EthereumEips_Github","GitRepository","ethereum/EIPs@master:EIPS","HttpProxy","GithubContentsApi"]',
		},
		{
			source: Source.EthereumEips_Github,
			target: {
				kind: SourceTargetKind.GitRepository,
				key: 'ethereum/ercs@master:ERCS',
			},
			endpoints: ethereumEipsGithubGitRepositoryEthereumEIPsMasterEIPSEndpoints,
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.GithubContentsApi,
			operationGroups: ethereumEipsGithubGithubRepositoryContentsOperationGroups,
			delivery: SourceDelivery.HttpProxy,
			credentials: ethereumEipsGithubCredentials,
			proxyId: '["EthereumEips_Github","GitRepository","ethereum/ercs@master:ERCS","HttpProxy","GithubContentsApi"]',
		},
	],
} as const satisfies SourceBindingIndex

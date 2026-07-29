// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

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

const bindings = [
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
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.EthereumEips_Github]: readonly [typeof bindings[0], typeof bindings[1]] }>(bindings)

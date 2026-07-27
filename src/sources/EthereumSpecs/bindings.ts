// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

const ethereumSpecsGithubGithubRepositoryContentsOperationGroups = [
	SourceOperationGroup.GithubRepositoryContents,
] as const
const ethereumSpecsGithubCredentials = [
	{
		scope: SourceCredentialScope.None,
	},
] as const

export default {
	[Source.EthereumSpecs_Github]: [
		{
			source: Source.EthereumSpecs_Github,
			target: {
				kind: SourceTargetKind.GitRepository,
				key: 'ethereum/consensus-specs@master:configs',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://raw.githubusercontent.com/ethereum/consensus-specs/master/configs/',
					origin: 'https://raw.githubusercontent.com',
					corsEnabled: true,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.GithubContentsApi,
			operationGroups: ethereumSpecsGithubGithubRepositoryContentsOperationGroups,
			delivery: SourceDelivery.BrowserDirect,
			credentials: ethereumSpecsGithubCredentials,
		},
		{
			source: Source.EthereumSpecs_Github,
			target: {
				kind: SourceTargetKind.GitRepository,
				key: 'ethereum/go-ethereum@master:params/config.go',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://raw.githubusercontent.com/ethereum/go-ethereum/master/params/config.go',
					origin: 'https://raw.githubusercontent.com',
					corsEnabled: true,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.GithubContentsApi,
			operationGroups: ethereumSpecsGithubGithubRepositoryContentsOperationGroups,
			delivery: SourceDelivery.BrowserDirect,
			credentials: ethereumSpecsGithubCredentials,
		},
		{
			source: Source.EthereumSpecs_Github,
			target: {
				kind: SourceTargetKind.GitRepository,
				key: 'ethereum/execution-specs@8dbde99b65d519ea4c96084d784f85957e9314d0:network-upgrades/mainnet-upgrades',
			},
			endpoints: [
				{
					endpointKind: SourceEndpointKind.HttpUrl,
					locator: 'https://raw.githubusercontent.com/ethereum/execution-specs/8dbde99b65d519ea4c96084d784f85957e9314d0/network-upgrades/mainnet-upgrades/',
					origin: 'https://raw.githubusercontent.com',
					corsEnabled: true,
				},
			],
			wireProtocol: WireProtocol.HttpRest,
			apiFamily: ApiFamily.GithubContentsApi,
			operationGroups: ethereumSpecsGithubGithubRepositoryContentsOperationGroups,
			delivery: SourceDelivery.BrowserDirect,
			credentials: ethereumSpecsGithubCredentials,
		},
	],
} as const satisfies SourceBindingIndex

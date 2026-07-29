// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const ethereumSpecsGithubGithubRepositoryContentsOperationGroups = [
	SourceOperationGroup.GithubRepositoryContents,
] as const
const ethereumSpecsGithubCredentials = [
	{
		scope: SourceCredentialScope.None,
	},
] as const

const bindings = [
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
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.EthereumSpecs_Github]: readonly [typeof bindings[0], typeof bindings[1], typeof bindings[2]] }>(bindings)

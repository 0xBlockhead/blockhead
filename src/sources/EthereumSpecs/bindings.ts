// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const ethereumSpecsGithubGithubContentsApiBrowserDirectBindingAxes = {
	source: Source.EthereumSpecs_Github,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.GithubContentsApi,
	operationGroups: [
		SourceOperationGroup.GithubRepositoryContents,
	],
	delivery: SourceDelivery.BrowserDirect,
	credentials: [],
} as const

const bindings = [
	{
		...ethereumSpecsGithubGithubContentsApiBrowserDirectBindingAxes,
		target: {
			kind: SourceTargetKind.GitRepository,
			key: 'ethereum/consensus-specs@master:configs',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://raw.githubusercontent.com/ethereum/consensus-specs/master/configs/',
				corsEnabled: true,
			},
		],
	},
	{
		...ethereumSpecsGithubGithubContentsApiBrowserDirectBindingAxes,
		target: {
			kind: SourceTargetKind.GitRepository,
			key: 'ethereum/go-ethereum@master:params/config.go',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://raw.githubusercontent.com/ethereum/go-ethereum/master/params/config.go',
				corsEnabled: true,
			},
		],
	},
	{
		...ethereumSpecsGithubGithubContentsApiBrowserDirectBindingAxes,
		target: {
			kind: SourceTargetKind.GitRepository,
			key: 'ethereum/execution-specs@8dbde99b65d519ea4c96084d784f85957e9314d0:network-upgrades/mainnet-upgrades',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://raw.githubusercontent.com/ethereum/execution-specs/8dbde99b65d519ea4c96084d784f85957e9314d0/network-upgrades/mainnet-upgrades/',
				corsEnabled: true,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)

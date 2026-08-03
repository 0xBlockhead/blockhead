// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	mapSourceBindings,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

const ethereumSpecsGithubBindingAxes = {
	source: Source.EthereumSpecs_Github,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.GithubContentsApi,
	operationGroups: [
		SourceOperationGroup.GithubRepositoryContents,
	],
	delivery: SourceDelivery.BrowserDirect,
	credentials: [],
} as const

export default indexSourceBindings(mapSourceBindings(
	[
		{
			key: 'ethereum/consensus-specs@master:configs',
			locator: 'https://raw.githubusercontent.com/ethereum/consensus-specs/master/configs/',
		},
		{
			key: 'ethereum/go-ethereum@master:params/config.go',
			locator: 'https://raw.githubusercontent.com/ethereum/go-ethereum/master/params/config.go',
		},
		{
			key: 'ethereum/execution-specs@8dbde99b65d519ea4c96084d784f85957e9314d0:network-upgrades/mainnet-upgrades',
			locator: 'https://raw.githubusercontent.com/ethereum/execution-specs/8dbde99b65d519ea4c96084d784f85957e9314d0/network-upgrades/mainnet-upgrades/',
		},
	] as const,
	({
		key,
		locator,
	}) => ({
		...ethereumSpecsGithubBindingAxes,
		target: {
			kind: SourceTargetKind.GitRepository,
			key,
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator,
				corsEnabled: true,
			},
		],
	})
))

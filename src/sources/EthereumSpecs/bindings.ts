// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

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

const ethereumSpecsGithubTargets = [
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
] as const

const bindings = ethereumSpecsGithubTargets.map(({
	key,
	locator,
}) => ({
		...ethereumSpecsGithubGithubContentsApiBrowserDirectBindingAxes,
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
} satisfies SourceBinding))

export default indexSourceBindings(bindings)

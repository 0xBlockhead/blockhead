import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

const ethereumEipsGithubEndpoints = [
	{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://api.github.com',
		corsEnabled: true,
	},
	{
		endpointKind: SourceEndpointKind.HttpUrl,
		locator: 'https://raw.githubusercontent.com',
		corsEnabled: true,
	},
] as const

const ethereumEipsGithubBindingAxes = {
	source: Source.EthereumEips_Github,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.GithubContentsApi,
	operationGroups: [
		SourceOperationGroup.GithubRepositoryContents,
	],
	delivery: SourceDelivery.HttpProxy,
	credentials: [],
} as const

export default indexSourceBindings([
	{
		...ethereumEipsGithubBindingAxes,
		target: {
			kind: SourceTargetKind.GitRepository,
			key: 'ethereum/EIPs@master:EIPS',
		},
		endpoints: ethereumEipsGithubEndpoints,
	},
	{
		...ethereumEipsGithubBindingAxes,
		target: {
			kind: SourceTargetKind.GitRepository,
			key: 'ethereum/ercs@master:ERCS',
		},
		endpoints: ethereumEipsGithubEndpoints,
	},
])

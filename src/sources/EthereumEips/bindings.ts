// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

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

const ethereumEipsGithubGithubContentsApiHttpProxyBindingAxes = {
	source: Source.EthereumEips_Github,
	wireProtocol: WireProtocol.HttpRest,
	apiFamily: ApiFamily.GithubContentsApi,
	operationGroups: [
		SourceOperationGroup.GithubRepositoryContents,
	],
	delivery: SourceDelivery.HttpProxy,
	credentials: [],
} as const

const bindings = [
	{
		...ethereumEipsGithubGithubContentsApiHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.GitRepository,
			key: 'ethereum/EIPs@master:EIPS',
		},
		endpoints: ethereumEipsGithubEndpoints,
	},
	{
		...ethereumEipsGithubGithubContentsApiHttpProxyBindingAxes,
		target: {
			kind: SourceTargetKind.GitRepository,
			key: 'ethereum/ercs@master:ERCS',
		},
		endpoints: ethereumEipsGithubEndpoints,
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)

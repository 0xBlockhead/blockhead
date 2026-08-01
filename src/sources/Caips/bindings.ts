// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const caipsEndpoints = [
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
const caipsGithubRepositoryContentsOperationGroups = [
	SourceOperationGroup.GithubRepositoryContents,
] as const

const bindings = [
	{
		source: Source.Caips_Github,
		target: {
			kind: SourceTargetKind.GitRepository,
			key: 'ChainAgnostic/CAIPs@main:CAIPs',
		},
		endpoints: caipsEndpoints,
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.GithubContentsApi,
		operationGroups: caipsGithubRepositoryContentsOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
	},
	{
		source: Source.CaipNamespaces_Github,
		target: {
			kind: SourceTargetKind.GitRepository,
			key: 'ChainAgnostic/namespaces@main:namespaces',
		},
		endpoints: caipsEndpoints,
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.GithubContentsApi,
		operationGroups: caipsGithubRepositoryContentsOperationGroups,
		delivery: SourceDelivery.BrowserDirect,
		credentials: [],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)

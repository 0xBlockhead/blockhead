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

export default indexSourceBindings([
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
])

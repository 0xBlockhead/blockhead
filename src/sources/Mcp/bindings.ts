// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.McpDeclared_Protocol,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'declared-mcp-server',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.LocalProcess,
				locator: 'mcp',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.McpProtocol,
		operationGroups: [
			SourceOperationGroup.AgentCapabilityCatalog,
			SourceOperationGroup.AgentRuntimeInvocation,
		],
		delivery: SourceDelivery.LocalOnly,
		credentials: [
			{
				scope: SourceCredentialScope.LocalSecret,
			},
		],
	},
	{
		source: Source.McpPackageRegistry_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'mcp-package-registry',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://registry.modelcontextprotocol.io/v0.1/servers',
				origin: 'https://registry.modelcontextprotocol.io',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.AgentCapabilityCatalog,
			SourceOperationGroup.AiArtifactCatalog,
			SourceOperationGroup.RepositoryMetadata,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.None,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{
	readonly [Source.McpDeclared_Protocol]: typeof bindings[0]
	readonly [Source.McpPackageRegistry_Rest]: typeof bindings[1]
}>(bindings)

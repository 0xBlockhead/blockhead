import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

const mcpRegistryOrigin = 'https://registry.modelcontextprotocol.io' as const

export const mcpBindings = [
	{
		provider: SourceProvider.Mcp,
		source: Source.McpDeclared_Protocol,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'mcp-configured',
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
		provider: SourceProvider.Mcp,
		source: Source.McpPackageRegistry_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'mcp-package-registry',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: `${mcpRegistryOrigin}/v0.1/servers`,
				origin: mcpRegistryOrigin,
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

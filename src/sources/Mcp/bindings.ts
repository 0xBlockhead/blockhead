// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
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
		wireProtocol: WireProtocol.Mcp,
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
		source: Source.McpDeclared_Protocol,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'declared-mcp-server',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{mcp-host}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.Mcp,
		apiFamily: ApiFamily.McpProtocol,
		operationGroups: [
			SourceOperationGroup.AgentCapabilityCatalog,
			SourceOperationGroup.AgentRuntimeInvocation,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [],
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
		credentials: [],
	},
])

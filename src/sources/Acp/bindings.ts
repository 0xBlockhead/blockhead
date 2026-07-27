// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.AcpLocal_JsonRpc]: {
		source: Source.AcpLocal_JsonRpc,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'acp-local',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.LocalProcess,
				locator: 'acp',
			},
		],
		wireProtocol: WireProtocol.JsonRpc2,
		apiFamily: ApiFamily.AcpProtocol,
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
	[Source.AcpRegistry_Rest]: {
		source: Source.AcpRegistry_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'acp-registry',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json',
				origin: 'https://cdn.agentclientprotocol.com',
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
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Acp/Rest/types.ts',
				generated: false,
			},
		],
	},
} as const satisfies SourceBindingIndex

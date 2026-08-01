// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceArtifactKind, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
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
	{
		source: Source.AcpRegistry_Rest,
		target: {
			kind: SourceTargetKind.Global,
			key: 'acp-registry',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json',
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
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/Acp/Rest/types.ts',
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings(bindings)

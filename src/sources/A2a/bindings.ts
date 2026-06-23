import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import {
	ApiFamily,
	SourceArtifactKind,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceOperationGroup,
	SourceTargetKind,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export const a2aBindings = [
	{
		provider: SourceProvider.A2a,
		source: Source.A2aWellKnown_Http,
		target: {
			kind: SourceTargetKind.Global,
			key: 'a2a-well-known',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{origin}/.well-known/agent.json',
				origin: 'https://{origin}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.A2aProtocol,
		operationGroups: [
			SourceOperationGroup.AgentCapabilityCatalog,
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
				path: 'src/sources/A2a/Http/types.ts',
				generated: false,
			},
		],
	},
	{
		provider: SourceProvider.A2a,
		source: Source.A2aService_Http,
		target: {
			kind: SourceTargetKind.Global,
			key: 'a2a-service',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'https://{origin}/{agent-path}',
				origin: 'https://{origin}',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.A2aProtocol,
		operationGroups: [
			SourceOperationGroup.AgentRuntimeInvocation,
		],
		delivery: SourceDelivery.RemoteQuery,
		credentials: [
			{
				scope: SourceCredentialScope.UserDelegated,
			},
		],
		artifacts: [
			{
				kind: SourceArtifactKind.HandwrittenTypes,
				path: 'src/sources/A2a/Http/types.ts',
				generated: false,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

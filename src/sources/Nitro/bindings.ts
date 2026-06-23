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

export const nitroBindings = [
	{
		provider: SourceProvider.Nitro,
		source: Source.Nitro_ClientStore,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'nitro-client-store',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.InProcess,
				locator: 'nitro-client-store',
			},
		],
		wireProtocol: WireProtocol.InProcess,
		apiFamily: ApiFamily.LocalStateStore,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.LocalOnly,
		credentials: [
			{
				scope: SourceCredentialScope.LocalSecret,
			},
		],
	},
	{
		provider: SourceProvider.Nitro,
		source: Source.Nitro_NodeRpc,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'nitro-node',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.HttpUrl,
				locator: 'env:NITRO_NODE_RPC_URL',
				origin: 'env:NITRO_NODE_RPC_URL',
				corsEnabled: false,
			},
		],
		wireProtocol: WireProtocol.HttpRest,
		apiFamily: ApiFamily.RestJson,
		operationGroups: [
			SourceOperationGroup.GenericRead,
		],
		delivery: SourceDelivery.ServerOnly,
		credentials: [
			{
				scope: SourceCredentialScope.LocalSecret,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

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

export const zcashClientBackendBindings = [
	{
		provider: SourceProvider.ZcashClientBackend,
		source: Source.ZcashClientBackend_Local,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'zcash-client-backend',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.LocalFilePath,
				locator: 'env:ZCASH_CLIENT_BACKEND_PATH',
			},
		],
		wireProtocol: WireProtocol.LocalFile,
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
] as const satisfies readonly SourceBinding[]

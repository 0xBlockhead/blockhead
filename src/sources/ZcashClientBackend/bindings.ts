// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBindingIndex } from '$/sources/SourceBinding.ts'

export default {
	[Source.ZcashClientBackend_Local]: {
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
} as const satisfies SourceBindingIndex

// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.AptosAip62_WalletApi,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'aptos-aip62-wallet',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.BrowserWalletProvider,
				locator: 'aptos',
			},
		],
		wireProtocol: WireProtocol.WalletProvider,
		apiFamily: ApiFamily.WalletApi,
		operationGroups: [
			SourceOperationGroup.WalletAccountRead,
			SourceOperationGroup.WalletSign,
		],
		delivery: SourceDelivery.BrowserDirect,
		credentials: [
			{
				scope: SourceCredentialScope.UserDelegated,
			},
		],
	},
] as const satisfies readonly SourceBinding[]

export default indexSourceBindings<{ readonly [Source.AptosAip62_WalletApi]: typeof bindings[0] }>(bindings)

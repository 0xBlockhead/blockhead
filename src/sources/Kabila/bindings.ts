// Generated from APP.ts. Do not edit by hand.

import { Source } from '$/sources/Source.ts'
import { ApiFamily, indexSourceBindings, SourceCredentialScope, SourceDelivery, SourceEndpointKind, SourceOperationGroup, SourceTargetKind, WireProtocol, type SourceBinding } from '$/sources/SourceBinding.ts'

const bindings = [
	{
		source: Source.Kabila_WalletConnect,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'kabila-walletconnect',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.BrowserWalletProvider,
				locator: 'kabila-walletconnect',
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

export default indexSourceBindings<{ readonly [Source.Kabila_WalletConnect]: typeof bindings[0] }>(bindings)

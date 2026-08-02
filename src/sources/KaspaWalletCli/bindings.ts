// Generated from APP.ts.

import { Source } from '$/sources/Source.ts'
import {
	ApiFamily,
	indexSourceBindings,
	SourceCredentialScope,
	SourceDelivery,
	SourceEndpointKind,
	SourceTargetKind,
	walletReadAndSignOperationGroups,
	WireProtocol,
	type SourceBinding,
} from '$/sources/SourceBinding.ts'

export default indexSourceBindings([
	{
		source: Source.KaspaWalletCli_WalletApi,
		target: {
			kind: SourceTargetKind.LocalDevice,
			key: 'kaspa-wallet-cli',
		},
		endpoints: [
			{
				endpointKind: SourceEndpointKind.LocalProcess,
				locator: 'kaspa-wallet-cli',
			},
		],
		wireProtocol: WireProtocol.WalletProvider,
		apiFamily: ApiFamily.WalletApi,
		operationGroups: walletReadAndSignOperationGroups,
		delivery: SourceDelivery.LocalOnly,
		credentials: [
			{
				scope: SourceCredentialScope.LocalSecret,
			},
		],
	},
] as const satisfies readonly SourceBinding[])

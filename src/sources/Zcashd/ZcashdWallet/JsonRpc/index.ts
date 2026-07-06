// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const zcashdWalletJsonRpcSourceDefinition = {
	provider: SourceProvider.Zcashd,
	source: Source.ZcashdWallet_JsonRpc,
	label: 'zcashd wallet JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default zcashdWalletJsonRpcSourceDefinition

// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const zcashdJsonRpcSourceDefinition = {
	provider: SourceProvider.Zcashd,
	source: Source.Zcashd_JsonRpc,
	label: 'zcashd JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default zcashdJsonRpcSourceDefinition

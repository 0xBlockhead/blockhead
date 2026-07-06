// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const avalanchePlatformVmJsonRpcSourceDefinition = {
	provider: SourceProvider.AvalanchePlatformVm,
	source: Source.AvalanchePlatformVm_JsonRpc,
	label: 'Avalanche PlatformVM JSON-RPC',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default avalanchePlatformVmJsonRpcSourceDefinition

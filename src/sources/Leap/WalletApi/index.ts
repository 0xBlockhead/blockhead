// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const leapWalletApiSourceDefinition = {
	provider: SourceProvider.Leap,
	source: Source.Leap_WalletApi,
	label: 'Leap wallet API',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default leapWalletApiSourceDefinition

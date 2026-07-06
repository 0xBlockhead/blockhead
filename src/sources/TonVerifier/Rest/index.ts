// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const tonVerifierRestSourceDefinition = {
	provider: SourceProvider.TonVerifier,
	source: Source.TonVerifier_Rest,
	label: 'TON Verifier REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default tonVerifierRestSourceDefinition

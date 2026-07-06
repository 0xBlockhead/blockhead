// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const sigstoreRekorRestSourceDefinition = {
	provider: SourceProvider.SigstoreRekor,
	source: Source.SigstoreRekor_Rest,
	label: 'Sigstore Rekor REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default sigstoreRekorRestSourceDefinition

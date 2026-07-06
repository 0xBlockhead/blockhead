// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const magnetUriUriSourceDefinition = {
	provider: SourceProvider.MagnetUri,
	source: Source.MagnetUri_Uri,
	label: 'Magnet URI parser',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default magnetUriUriSourceDefinition

// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/RadicleCli/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.RadicleCli,
	label: 'Radicle CLI',
	sources: [
		{
			source: Source.RadicleCli_Local,
			label: 'Radicle CLI local',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition

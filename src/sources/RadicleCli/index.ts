// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/RadicleCli/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.RadicleCli,
	label: 'Radicle CLI',
	sources: [
		{
			source: Source.RadicleCli_Local,
			label: 'Radicle CLI local',
		},
	],
	bindings: [bindings[Source.RadicleCli_Local]],
} satisfies SourceProviderDefinition

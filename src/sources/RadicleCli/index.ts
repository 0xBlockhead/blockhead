import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { radicleCliBindings } from '$/sources/RadicleCli/bindings.ts'

export default {
	provider: SourceProvider.RadicleCli,
	label: 'Radicle CLI',
	sources: [
		{
			provider: SourceProvider.RadicleCli,
			source: Source.RadicleCli_Local,
			label: 'Radicle CLI local',
		},
	],
	bindings: radicleCliBindings,
} satisfies SourceProviderDefinition

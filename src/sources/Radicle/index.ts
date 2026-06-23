import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { radicleBindings } from '$/sources/Radicle/bindings.ts'

export default {
	provider: SourceProvider.Radicle,
	label: 'Radicle',
	sources: [
		{
			provider: SourceProvider.Radicle,
			source: Source.Radicle_Local,
			label: 'Radicle local repository',
		},
		{
			provider: SourceProvider.Radicle,
			source: Source.Radicle_Remote,
			label: 'Radicle remote repository',
		},
	],
	bindings: radicleBindings,
} satisfies SourceProviderDefinition

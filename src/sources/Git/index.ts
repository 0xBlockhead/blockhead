import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { gitBindings } from '$/sources/Git/bindings.ts'

export default {
	provider: SourceProvider.Git,
	label: 'Git',
	sources: [
		{
			provider: SourceProvider.Git,
			source: Source.Git_Local,
			label: 'Local Git repository',
		},
		{
			provider: SourceProvider.Git,
			source: Source.Git_Remote,
			label: 'Remote Git repository',
		},
	],
	bindings: gitBindings,
} satisfies SourceProviderDefinition

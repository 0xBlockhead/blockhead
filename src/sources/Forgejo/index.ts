import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { forgejoBindings } from '$/sources/Forgejo/bindings.ts'

export default {
	provider: SourceProvider.Forgejo,
	label: 'Forgejo',
	sources: [
		{
			provider: SourceProvider.Forgejo,
			source: Source.ForgejoRepos_Rest,
			label: 'Forgejo repositories REST',
		},
		{
			provider: SourceProvider.Forgejo,
			source: Source.ForgejoIssues_Rest,
			label: 'Forgejo issues REST',
		},
		{
			provider: SourceProvider.Forgejo,
			source: Source.ForgejoPulls_Rest,
			label: 'Forgejo pulls REST',
		},
		{
			provider: SourceProvider.Forgejo,
			source: Source.ForgejoReleases_Rest,
			label: 'Forgejo releases REST',
		},
	],
	bindings: forgejoBindings,
} satisfies SourceProviderDefinition

// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Forgejo/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Forgejo,
	label: 'Forgejo',
	sources: [
		{
			source: Source.ForgejoRepos_Rest,
			label: 'Forgejo repositories REST',
		},
		{
			source: Source.ForgejoIssues_Rest,
			label: 'Forgejo issues REST',
		},
		{
			source: Source.ForgejoPulls_Rest,
			label: 'Forgejo pulls REST',
		},
		{
			source: Source.ForgejoReleases_Rest,
			label: 'Forgejo releases REST',
		},
	],
	bindings: [
		bindings[Source.ForgejoRepos_Rest],
		bindings[Source.ForgejoIssues_Rest],
		bindings[Source.ForgejoPulls_Rest],
		bindings[Source.ForgejoReleases_Rest],
	],
} satisfies SourceProviderDefinition

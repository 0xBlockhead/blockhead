
import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/$SourceProvider.ts'
import { origin } from '$/sources/Sourcify/Rest/constants.ts'
import SourcifyRestSource from '$/sources/Sourcify/Rest/index.ts'

export default {
	provider: SourceProvider.Sourcify,
	label: 'Sourcify',
	origins: [
		{
			origin,
			corsEnabled: false,
		},
	],
	sources: [
		SourcifyRestSource,
	],
} satisfies SourceProviderDefinition

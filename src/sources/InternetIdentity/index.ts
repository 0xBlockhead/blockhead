import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { internetIdentityBindings } from '$/sources/InternetIdentity/bindings.ts'

export default {
	provider: SourceProvider.InternetIdentity,
	label: 'Internet Identity',
	sources: [
		{
			provider: SourceProvider.InternetIdentity,
			source: Source.InternetIdentity_Delegation,
			label: 'Internet Identity delegation',
		},
	],
	bindings: internetIdentityBindings,
} satisfies SourceProviderDefinition

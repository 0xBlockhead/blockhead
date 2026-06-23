import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { sigstoreRekorBindings } from '$/sources/SigstoreRekor/bindings.ts'

export default {
	provider: SourceProvider.SigstoreRekor,
	label: 'Sigstore Rekor',
	sources: [
		{
			provider: SourceProvider.SigstoreRekor,
			source: Source.SigstoreRekor_Rest,
			label: 'Sigstore Rekor REST',
		},
	],
	bindings: sigstoreRekorBindings,
} satisfies SourceProviderDefinition

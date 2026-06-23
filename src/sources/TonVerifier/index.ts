import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { tonVerifierBindings } from '$/sources/TonVerifier/bindings.ts'

export default {
	provider: SourceProvider.TonVerifier,
	label: 'TON Verifier',
	sources: [
		{
			provider: SourceProvider.TonVerifier,
			source: Source.TonVerifier_Rest,
			label: 'TON Verifier REST',
		},
	],
	bindings: tonVerifierBindings,
} satisfies SourceProviderDefinition

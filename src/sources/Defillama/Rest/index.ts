import { type as arktype } from 'arktype'

import { Source } from '$/sources/$Source.ts'
import { SourceProvider } from '$/sources/$SourceProvider.ts'
import type { SourceDefinition } from '$/sources/$Source.ts'

const DefillamaRestSource = {
	provider: SourceProvider.Defillama,
	source: Source.Defillama_Rest,
	label: 'Defillama Rest',
	env: arktype({
		PUBLIC_DEFILLAMA_PRO_API_KEY: 'string > 0',
	}),
} satisfies SourceDefinition

export default DefillamaRestSource

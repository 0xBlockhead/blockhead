// Generated from APP.ts.

import bindings from '$/sources/AwsBedrock/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.AwsBedrock,
	label: 'AWS Bedrock',
	sources: [
		{
			source: Source.AwsBedrock_Rest,
			label: 'AWS Bedrock REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition<typeof bindings>

// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/AwsBedrock/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.AwsBedrock,
	label: 'AWS Bedrock',
	sources: [
		{
			source: Source.AwsBedrock_Rest,
			label: 'AWS Bedrock REST',
		},
	],
	bindings: [bindings[Source.AwsBedrock_Rest]],
} satisfies SourceProviderDefinition

// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const awsBedrockRestSourceDefinition = {
	provider: SourceProvider.AwsBedrock,
	source: Source.AwsBedrock_Rest,
	label: 'AWS Bedrock REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default awsBedrockRestSourceDefinition

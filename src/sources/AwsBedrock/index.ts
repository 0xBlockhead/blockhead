import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { awsBedrockBindings } from '$/sources/AwsBedrock/bindings.ts'

export default {
	provider: SourceProvider.AwsBedrock,
	label: 'AWS Bedrock',
	sources: [
		{
			provider: SourceProvider.AwsBedrock,
			source: Source.AwsBedrock_Rest,
			label: 'AWS Bedrock REST',
		},
	],
	bindings: awsBedrockBindings,
} satisfies SourceProviderDefinition

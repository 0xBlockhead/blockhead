// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Mlflow/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'
import type { SourceProviderDefinition } from '$/sources/SourceProviderDefinition.ts'

export default {
	provider: SourceProvider.Mlflow,
	label: 'MLflow',
	sources: [
		{
			source: Source.Mlflow_Rest,
			label: 'MLflow REST',
		},
	],
	bindings: Object.values(bindings).flat(),
} satisfies SourceProviderDefinition

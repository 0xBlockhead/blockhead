// Generated from APP.ts. Do not edit by hand.

import bindings from '$/sources/Mlflow/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

export default {
	provider: SourceProvider.Mlflow,
	label: 'MLflow',
	sources: [
		{
			source: Source.Mlflow_Rest,
			label: 'MLflow REST',
		},
	],
	bindings: [bindings[Source.Mlflow_Rest]],
} satisfies SourceProviderDefinition

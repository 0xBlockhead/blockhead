import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { mlflowBindings } from '$/sources/Mlflow/bindings.ts'

export default {
	provider: SourceProvider.Mlflow,
	label: 'MLflow',
	sources: [
		{
			provider: SourceProvider.Mlflow,
			source: Source.Mlflow_Rest,
			label: 'MLflow REST',
		},
	],
	bindings: mlflowBindings,
} satisfies SourceProviderDefinition

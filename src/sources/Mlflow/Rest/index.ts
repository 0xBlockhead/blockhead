// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const mlflowRestSourceDefinition = {
	provider: SourceProvider.Mlflow,
	source: Source.Mlflow_Rest,
	label: 'MLflow REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default mlflowRestSourceDefinition

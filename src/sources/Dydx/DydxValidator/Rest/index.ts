// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const dydxValidatorRestSourceDefinition = {
	provider: SourceProvider.Dydx,
	source: Source.DydxValidator_Rest,
	label: 'dYdX Validator REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default dydxValidatorRestSourceDefinition

// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const internetIdentityDelegationSourceDefinition = {
	provider: SourceProvider.InternetIdentity,
	source: Source.InternetIdentity_Delegation,
	label: 'Internet Identity delegation',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default internetIdentityDelegationSourceDefinition

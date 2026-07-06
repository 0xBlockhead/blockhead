// Generated from APP.ts. Do not edit by hand.

import type { SourceDefinition as SourceDefinitionTemplate } from '$/sources/$sources.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider } from '$/sources/SourceProvider.ts'

const gitlabRestSourceDefinition = {
	provider: SourceProvider.Gitlab,
	source: Source.Gitlab_Rest,
	label: 'GitLab REST',
} satisfies SourceDefinitionTemplate<SourceProvider, Source>

export default gitlabRestSourceDefinition

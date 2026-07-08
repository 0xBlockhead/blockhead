import { sourceOriginsFromBindings } from '$/sources/$sources.ts'
import { acpBindings } from '$/sources/Acp/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { SourceProvider, type SourceProviderDefinition } from '$/sources/SourceProvider.ts'

const acpOrigins = sourceOriginsFromBindings(acpBindings)

const acpSourceProviderDefinition = {
	provider: SourceProvider.Acp,
	label: 'Agent Client Protocol',
	sources: [
		{
			provider: SourceProvider.Acp,
			source: Source.AcpLocal_JsonRpc,
			label: 'ACP local JSON-RPC',
		},
		{
			provider: SourceProvider.Acp,
			source: Source.AcpRegistry_Rest,
			label: 'ACP registry REST',
		},
	],
	bindings: acpBindings,
	origins: acpOrigins,
} satisfies SourceProviderDefinition

export default acpSourceProviderDefinition

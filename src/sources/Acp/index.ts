import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { acpBindings } from '$/sources/Acp/bindings.ts'

export default {
	provider: SourceProvider.Acp,
	label: 'ACP',
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
} satisfies SourceProviderDefinition

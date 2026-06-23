import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { aptosFullnodeBindings } from '$/sources/AptosFullnode/bindings.ts'

export default {
	provider: SourceProvider.AptosFullnode,
	label: 'Aptos fullnode',
	sources: [
		{
			provider: SourceProvider.AptosFullnode,
			source: Source.AptosFullnode_Rest,
			label: 'Aptos fullnode REST',
		},
	],
	bindings: aptosFullnodeBindings,
} satisfies SourceProviderDefinition

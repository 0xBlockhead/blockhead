import { Source } from '$/sources/Source.ts'
import {
	SourceProvider,
	type SourceProviderDefinition,
} from '$/sources/SourceProvider.ts'
import { internetComputerBindings } from '$/sources/InternetComputer/bindings.ts'

export default {
	provider: SourceProvider.InternetComputer,
	label: 'Internet Computer',
	sources: [
		{
			provider: SourceProvider.InternetComputer,
			source: Source.IcDashboard_Canister,
			label: 'IC dashboard canister',
		},
		{
			provider: SourceProvider.InternetComputer,
			source: Source.InternetComputer_Canister,
			label: 'Internet Computer canister',
		},
		{
			provider: SourceProvider.InternetComputer,
			source: Source.InternetComputer_Http,
			label: 'Internet Computer HTTP gateway',
		},
		{
			provider: SourceProvider.InternetComputer,
			source: Source.InternetComputer_RosettaApi,
			label: 'Internet Computer Rosetta API',
		},
		{
			provider: SourceProvider.InternetComputer,
			source: Source.InternetComputer_WalletApi,
			label: 'Internet Computer wallet API',
		},
	],
	bindings: internetComputerBindings,
} satisfies SourceProviderDefinition

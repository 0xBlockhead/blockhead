import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { eip8004ScanOrigins } from '$/sources/Eip8004Scan/Rest/constants.ts'
import Eip8004ScanRestSource from '$/sources/Eip8004Scan/Rest/index.ts'

export default {
	provider: SourceProvider.Eip8004Scan,
	label: '8004scan',
	origins: eip8004ScanOrigins,
	sources: [
		Eip8004ScanRestSource,
	],
} satisfies SourceProviderDefinition

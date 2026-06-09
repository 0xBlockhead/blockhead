
import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import { gatewayUrls } from '$/sources/Ipfs/Rest/constants.ts'
import IpfsRestSource from '$/sources/Ipfs/Rest/index.ts'

export default {
	provider: SourceProvider.Ipfs,
	label: 'Ipfs',
	origins: gatewayUrls.map((origin) => ({
		origin,
		corsEnabled: false,
	})),
	sources: [
		IpfsRestSource,
	],
} satisfies SourceProviderDefinition

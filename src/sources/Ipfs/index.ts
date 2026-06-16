import { ipfsPublicGateways } from '$/constants/IpfsProtocol.ts'
import {
	type SourceProviderDefinition,
	SourceProvider,
} from '$/sources/SourceProvider.ts'
import IpfsRestSource from '$/sources/Ipfs/Rest/index.ts'

export default {
	provider: SourceProvider.Ipfs,
	label: 'Ipfs',
	origins: ipfsPublicGateways.map((gateway) => ({
		origin: gateway.origin,
		corsEnabled: false,
	})),
	sources: [
		IpfsRestSource,
	],
} satisfies SourceProviderDefinition

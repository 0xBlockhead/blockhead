import { networkBySlug } from '$/constants/Network.ts'
import { bitcoinCoreJsonRpcResolvers } from '$/resolvers/BitcoinCoreJsonRpc.ts'
import { Source } from '$/sources/Source.ts'

export default bitcoinCoreJsonRpcResolvers({
	acceptsSlugSelector: false,
	loadQueries: () => import('$/sources/BitcoinCore/JsonRpc/queries.ts'),
	network: networkBySlug.bitcoin,
	source: Source.BitcoinCore_JsonRpc,
})

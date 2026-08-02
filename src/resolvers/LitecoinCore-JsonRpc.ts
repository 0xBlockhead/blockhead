import { networkBySlug } from '$/constants/Network.ts'
import { bitcoinCoreJsonRpcResolvers } from '$/resolvers/BitcoinCoreJsonRpc.ts'
import { Source } from '$/sources/Source.ts'

export default bitcoinCoreJsonRpcResolvers({
	acceptsSlugSelector: true,
	loadQueries: () => import('$/sources/LitecoinCore/JsonRpc/queries.ts'),
	network: networkBySlug.litecoin,
	source: Source.LitecoinCore_JsonRpc,
})

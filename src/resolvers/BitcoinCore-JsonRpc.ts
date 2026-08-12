import { networkBySlug } from '$/constants/Network.ts'
import { bitcoinCoreJsonRpcResolvers } from '$/resolvers/BitcoinCoreJsonRpc.ts'
import { Source } from '$/sources/Source.ts'

export default bitcoinCoreJsonRpcResolvers({
	acceptsSlugSelector: false,
	loadMempoolTransactionIds: async () => (
		(await import('$/sources/BitcoinCore/JsonRpc/queries.ts')).getMempoolTransactionIds()
	),
	loadQueries: () => import('$/sources/BitcoinCore/JsonRpc/queries.ts'),
	network: networkBySlug.bitcoin,
	source: Source.BitcoinCore_JsonRpc,
})

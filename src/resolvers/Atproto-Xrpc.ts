import { bskyAppViewResolvers } from '$/resolvers/BskyAppViewXrpc.ts'
import { Source } from '$/sources/Source.ts'

export default bskyAppViewResolvers(
	Source.Atproto_Xrpc,
	() => import('$/sources/AtprotoBsky/Rest/queries.ts')
)

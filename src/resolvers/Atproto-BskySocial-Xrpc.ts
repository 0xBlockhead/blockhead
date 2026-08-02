import { bskyAppViewResolvers } from '$/resolvers/BskyAppViewXrpc.ts'
import { Source } from '$/sources/Source.ts'

export default bskyAppViewResolvers(
	Source.Atproto_BskySocial_Xrpc,
	() => import('$/sources/AtprotoBskySocial/Rest/queries.ts')
)

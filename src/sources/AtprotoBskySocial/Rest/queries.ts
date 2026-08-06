import bindings from '$/sources/AtprotoBskySocial/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { bskyAppViewXrpc } from '$/sources/_shared/interfaces/BskyAppViewXrpc/queries.ts'

export const {
	getAuthorFeed,
	getPostThread,
	getPosts,
	getProfile,
	resolveHandle,
	searchActors,
	searchActorsTypeahead,
	searchPosts,
} = bskyAppViewXrpc(bindings[Source.Atproto_BskySocial_Xrpc][0])

import bindings from '$/sources/AtprotoBsky/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { bskyAppViewXrpc } from '$/sources/_shared/interfaces/BskyAppViewXrpc/queries.ts'

export const {
	getAuthorFeed,
	getPostThread,
	getPosts,
	getProfile,
	resolveHandle,
	searchActorsTypeahead,
	searchPosts,
} = bskyAppViewXrpc(bindings[Source.Atproto_Xrpc][0])

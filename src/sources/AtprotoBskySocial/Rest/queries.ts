import type { SourceBinding } from '$/sources/SourceBinding.ts'
import { bskyAppViewXrpc } from '$/sources/_shared/interfaces/BskyAppViewXrpc/queries.ts'

export const resolveHandle = (binding: SourceBinding, handle: string) => (
	bskyAppViewXrpc(binding).resolveHandle(handle)
)

export const getProfile = (binding: SourceBinding, actor: string) => (
	bskyAppViewXrpc(binding).getProfile(actor)
)

export const getPosts = (binding: SourceBinding, uris: string[]) => (
	bskyAppViewXrpc(binding).getPosts(uris)
)

export const getPostThread = (
	binding: SourceBinding,
	uri: string,
	options?: {
		depth?: number
		parentHeight?: number
	}
) => (
	bskyAppViewXrpc(binding).getPostThread(uri, options)
)

export const getAuthorFeed = (
	binding: SourceBinding,
	params: {
		actor: string
		limit?: number
		cursor?: string
		includePins?: boolean
	}
) => (
	bskyAppViewXrpc(binding).getAuthorFeed(params)
)

export const searchActorsTypeahead = (
	binding: SourceBinding,
	params: {
		limit?: number
		q: string
	}
) => (
	bskyAppViewXrpc(binding).searchActorsTypeahead(params)
)

export const searchActors = (
	binding: SourceBinding,
	params: {
		limit?: number
		q: string
		cursor?: string
	}
) => (
	bskyAppViewXrpc(binding).searchActors(params)
)

export const searchPosts = (
	binding: SourceBinding,
	params: {
		limit?: number
		q: string
		cursor?: string
	}
) => (
	bskyAppViewXrpc(binding).searchPosts(params)
)

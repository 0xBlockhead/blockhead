import type { AtprotoSyncSubscribeReposRequest } from '$/sources/AtprotoSync/Xrpc/types.ts'

export const subscribeReposUrl = ({
	serviceUrl,
}: AtprotoSyncSubscribeReposRequest) => {
	const url = new URL('/xrpc/com.atproto.sync.subscribeRepos', serviceUrl)
	if (url.protocol === 'https:')
		url.protocol = 'wss:'
	else if (url.protocol === 'http:')
		url.protocol = 'ws:'

	return url.toString()
}

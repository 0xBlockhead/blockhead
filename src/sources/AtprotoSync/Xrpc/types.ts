export type AtprotoSyncSubscribeReposRequest = {
	serviceOrigin: string
	cursor?: number
}

export type AtprotoSyncSubscribeReposMessage = {
	type:
		| '#account'
		| '#commit'
		| '#identity'
		| '#info'
		| '#sync'
	body: object
}
